import { CHAINLINK_MAPPING, CHAINLINK_TOKENS } from '../constants/chainlink'
import { CHAINLINK_ORACLE_ADDRESS, KASHI_ADDRESS } from '../constants/kashi'
import { Currency, Token } from '@sushiswap/sdk'
import { Listbox, Transition } from '@headlessui/react'
import React, { useEffect, useState } from 'react'

import Button from '../components/Button'
import Card from '../components/Card'
import CardHeader from '../components/CardHeader'
import CurrencyLogo from '../components/CurrencyLogo'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../layouts/KashiLayout'
import { WrappedTokenInfo } from '../state/lists/hooks'
import { e10 } from '../functions/math'
import { ethers } from 'ethers'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useAllTokens } from '../hooks/Tokens'
import { useBentoBoxContract } from '../hooks/useContract'
import { useRouter } from 'next/router'
import { useTransactionAdder } from '../state/transactions/hooks'

export type ChainlinkToken = {
    symbol: string
    name: string
    address: string
    decimals: number
}

export default function Create() {
    const { chainId } = useActiveWeb3React()
    const bentoBoxContract = useBentoBoxContract()

    const [selectedAsset, setSelectedAsset] = useState<
        WrappedTokenInfo | undefined
    >(undefined)
    const [selectedCollateral, setSelectedCollateral] = useState<
        WrappedTokenInfo | undefined
    >(undefined)

    const addTransaction = useTransactionAdder()

    const tokens = useAllTokens()

    const router = useRouter()

    const chainlinkTokens = chainId && CHAINLINK_TOKENS[chainId]

    // const tokens: ChainlinkToken[] = CHAINLINK_TOKENS[chainId || 1] || []
    // const empty = { symbol: '', name: 'Select a token', address: '0', decimals: 0 }

    useEffect(() => {
        if (
            selectedAsset &&
            selectedAsset.symbol &&
            selectedCollateral &&
            selectedCollateral.symbol &&
            !getOracleData(selectedAsset, selectedCollateral)
        ) {
            setSelectedCollateral(undefined)
        }
    }, [selectedAsset])

    const getOracleData = async (
        asset: WrappedTokenInfo,
        collateral: WrappedTokenInfo
    ) => {
        const oracleData = ''

        const mapping = CHAINLINK_MAPPING[chainId || 1] || {}

        for (const address in mapping) {
            mapping[address].address = address
        }

        let multiply = ethers.constants.AddressZero
        let divide = ethers.constants.AddressZero
        const multiplyMatches = Object.values(mapping).filter(
            (m) => m.from === asset.address && m.to === collateral.address
        )

        let decimals = 0
        if (multiplyMatches.length) {
            const match = multiplyMatches[0]
            multiply = match.address!
            decimals =
                18 + match.decimals - match.toDecimals + match.fromDecimals
        } else {
            const divideMatches = Object.values(mapping).filter(
                (m) => m.from === collateral.address && m.to === asset.address
            )
            if (divideMatches.length) {
                const match = divideMatches[0]
                divide = match.address!
                decimals =
                    36 - match.decimals - match.toDecimals + match.fromDecimals
            } else {
                const mapFrom = Object.values(mapping).filter(
                    (m) => m.from === asset.address
                )
                const mapTo = Object.values(mapping).filter(
                    (m) => m.from === collateral.address
                )
                const match = mapFrom
                    .map((mfrom) => ({
                        mfrom: mfrom,
                        mto: mapTo.filter((mto) => mfrom.to === mto.to),
                    }))
                    .filter((path) => path.mto.length)
                if (match.length) {
                    multiply = match[0].mfrom.address!
                    divide = match[0].mto[0].address!
                    decimals =
                        18 +
                        match[0].mfrom.decimals -
                        match[0].mto[0].decimals -
                        collateral.decimals +
                        asset.decimals
                } else {
                    return ''
                }
            }
        }
        return ethers.utils.defaultAbiCoder.encode(
            ['address', 'address', 'uint256'],
            [multiply, divide, e10(decimals)]
        )
    }

    // const assetTokens = Object.values(tokens).filter((token: Token) => {
    //     return true
    // })

    // const collateralTokens = Object.values(tokens).filter((token: Token) => {
    //     return token !== selectedAsset && (!selectedAsset.symbol || getOracleData(selectedAsset, token))
    // })

    const handleCreate = async () => {
        try {
            if (!selectedAsset || !selectedCollateral) return

            const oracleData = await getOracleData(
                selectedAsset,
                selectedCollateral
            )

            if (!oracleData) {
                console.log('No path')
                return
            }

            let oracleAddress = CHAINLINK_ORACLE_ADDRESS

            const kashiData = ethers.utils.defaultAbiCoder.encode(
                ['address', 'address', 'address', 'bytes'],
                [
                    selectedCollateral.address,
                    selectedAsset.address,
                    oracleAddress,
                    oracleData,
                ]
            )

            addTransaction(
                await bentoBoxContract?.deploy(
                    chainId && KASHI_ADDRESS[chainId],
                    kashiData,
                    true
                ),
                {
                    summary: `Add Kashi market ${selectedAsset.symbol}/${selectedCollateral.symbol} Chainlink`,
                }
            )

            setSelectedAsset(undefined)
            setSelectedCollateral(undefined)

            router.push('/lend')
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Layout
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage="/deposit-graphic.png"
                    title={'Create a new Kashi Market'}
                    description={
                        'If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.'
                    }
                />
            }
        >
            <Head>
                <title>Create Lending Pair | Kashi by Sushi</title>
                <meta
                    name="description"
                    content="Create Lending Pair on Kashi by Sushi"
                />
            </Head>
            <Card
                className="h-full bg-dark-900"
                header={
                    <CardHeader className="bg-dark-800">
                        <div className="text-3xl text-high-emphesis leading-48px">
                            Create a Market
                        </div>
                    </CardHeader>
                }
            >
                <div className="space-y-6">
                    <Listbox
                        as="div"
                        className="space-y-1 cursor-pointer"
                        value={selectedAsset}
                        onChange={setSelectedAsset}
                        disabled={false}
                    >
                        {({ open }) => (
                            <>
                                <Listbox.Label className="block pb-2 text-base font-medium leading-5 text-gray-700">
                                    LONG
                                </Listbox.Label>
                                <div className="relative">
                                    <span className="inline-block w-full rounded-md shadow-sm">
                                        <Listbox.Button className="relative w-full p-3 text-left transition duration-150 ease-in-out border border-none rounded-md cursor-pointer bg-dark-700 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5">
                                            <span className="flex items-center space-x-3 truncate">
                                                <CurrencyLogo
                                                    currency={selectedAsset}
                                                    squared
                                                    size={48}
                                                />
                                                <span>
                                                    <span className="text-lg">
                                                        {selectedAsset &&
                                                            selectedAsset.symbol}
                                                        &nbsp;
                                                    </span>
                                                    <span className="text-lg text-secondary">
                                                        {selectedAsset &&
                                                            selectedAsset.name}
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-secondary"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </Listbox.Button>
                                    </span>

                                    <Transition
                                        show={open}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        className="absolute z-10 w-full mt-1 rounded-md shadow-lg bg-dark-700"
                                    >
                                        <Listbox.Options
                                            static
                                            className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:border-none focus:outline-none sm:text-sm sm:leading-5"
                                        >
                                            {Object.values(tokens).map(
                                                (token: any) => (
                                                    <Listbox.Option
                                                        key={token.address}
                                                        value={token}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <div
                                                                className={`${
                                                                    selected ||
                                                                    active
                                                                        ? 'bg-dark-blue'
                                                                        : ''
                                                                } cursor-pointer relative p-3`}
                                                            >
                                                                <span className="flex items-center space-x-3 truncate">
                                                                    <CurrencyLogo
                                                                        currency={
                                                                            token
                                                                        }
                                                                        squared
                                                                        size={
                                                                            48
                                                                        }
                                                                    />
                                                                    <span>
                                                                        <span className="text-lg">
                                                                            {
                                                                                token.symbol
                                                                            }
                                                                            &nbsp;
                                                                        </span>
                                                                        <span className="text-lg text-secondary">
                                                                            {
                                                                                token.name
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                )
                                            )}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                    <Listbox
                        as="div"
                        className="space-y-1 cursor-pointer"
                        value={selectedCollateral}
                        onChange={setSelectedCollateral}
                        disabled={false}
                    >
                        {({ open }) => (
                            <>
                                <Listbox.Label className="block pb-2 text-base font-medium leading-5 text-gray-700">
                                    SHORT
                                </Listbox.Label>
                                <div className="relative">
                                    <span className="inline-block w-full rounded-md shadow-sm">
                                        <Listbox.Button className="relative w-full p-3 text-left transition duration-150 ease-in-out border border-none rounded-md cursor-pointer bg-dark-700 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5">
                                            <span className="flex items-center space-x-3 truncate">
                                                <CurrencyLogo
                                                    currency={
                                                        selectedCollateral
                                                    }
                                                    squared
                                                    size={48}
                                                />
                                                <span>
                                                    <span className="text-lg">
                                                        {selectedCollateral &&
                                                            selectedCollateral.symbol}
                                                        &nbsp;
                                                    </span>
                                                    <span className="text-lg text-secondary">
                                                        {selectedCollateral &&
                                                            selectedCollateral.name}
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-secondary"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </Listbox.Button>
                                    </span>

                                    <Transition
                                        show={open}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        className="absolute z-10 w-full mt-1 rounded-md shadow-lg bg-dark-700"
                                    >
                                        <Listbox.Options
                                            static
                                            className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:border-none focus:outline-none sm:text-sm sm:leading-5"
                                        >
                                            {Object.values(tokens).map(
                                                (token: any) => (
                                                    <Listbox.Option
                                                        key={token.address}
                                                        value={token}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <div
                                                                className={`${
                                                                    selected ||
                                                                    active
                                                                        ? 'bg-dark-blue'
                                                                        : ''
                                                                } cursor-pointer relative p-3`}
                                                            >
                                                                <span className="flex items-center space-x-3 truncate">
                                                                    <CurrencyLogo
                                                                        currency={
                                                                            token
                                                                        }
                                                                        squared
                                                                        size={
                                                                            48
                                                                        }
                                                                    />
                                                                    <span>
                                                                        <span className="text-lg">
                                                                            {
                                                                                token.symbol
                                                                            }
                                                                            &nbsp;
                                                                        </span>
                                                                        <span className="text-lg text-secondary">
                                                                            {
                                                                                token.name
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                )
                                            )}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>

                    <Button
                        color="gradient"
                        className="w-full px-4 py-3 text-base rounded text-high-emphesis"
                        onClick={() => handleCreate()}
                        disabled={
                            !selectedCollateral ||
                            !selectedAsset ||
                            selectedCollateral === selectedAsset
                        }
                    >
                        Create Market
                    </Button>
                </div>
            </Card>
        </Layout>
    )
}
