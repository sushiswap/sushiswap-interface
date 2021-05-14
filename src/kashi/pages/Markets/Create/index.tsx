import {
    CHAINLINK_MAPPING,
    CHAINLINK_ORACLE_ADDRESS,
    CHAINLINK_TOKENS,
    ChainlinkToken,
    KASHI_ADDRESS
} from 'kashi/constants'
import { Card, CardHeader, Layout } from 'kashi/components'
import { ChainId, Pair, Token } from '@sushiswap/sdk'
import React, { useEffect, useState } from 'react'
import {
    useBentoBoxContract,
    usePairContract,
    useSushiSwapTWAP0Oracle,
    useSushiSwapTWAP1Oracle
} from 'hooks/useContract'

import { Button } from 'components'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Helmet } from 'react-helmet'
import OracleListBox from './OracleListBox'
import { SUSHISWAP_TWAP_1_ORACLE_ADDRESS } from 'kashi/constants'
import TokenListBox from './TokenListBox'
import { e10 } from 'kashi/functions/math'
import { ethers } from 'ethers'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useAllTokens } from 'hooks/Tokens'
import { useTransactionAdder } from 'state/transactions/hooks'

enum OracleId {
    CHAINLINK = 1,
    SUSHISWAP = 2,
    PEGGED = 3
}

interface Oracle {
    id: number
    name: string
    unavailable: boolean
}

const oracles = [
    { id: OracleId.CHAINLINK, name: 'Chainlink', unavailable: false },
    { id: OracleId.SUSHISWAP, name: 'SushiSwap', unavailable: false },
    { id: OracleId.PEGGED, name: 'Pegged', unavailable: true }
]

const CreatePair = () => {
    const { chainId } = useActiveWeb3React()
    const bentoBoxContract = useBentoBoxContract()

    const sushiSwapTWAP0OracleContract = useSushiSwapTWAP0Oracle()
    const sushiSwapTWAP1OracleContract = useSushiSwapTWAP1Oracle()

    const [selectedOracle, setSelectedOracle] = useState<Oracle | undefined>(undefined)

    const [selectedAsset, setSelectedAsset] = useState<any>(undefined)
    const [selectedCollateral, setSelectedCollateral] = useState<any>(undefined)

    const pair = usePairContract(
        selectedAsset && selectedCollateral ? Pair.getAddress(selectedAsset, selectedCollateral) : undefined
    )

    const addTransaction = useTransactionAdder()

    const tokens = useAllTokens()

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

    const getOracleData = async (asset: any, collateral: any) => {
        console.log({ selectedOracle })

        if (selectedOracle && selectedOracle.id === OracleId.SUSHISWAP) {
            const token0 = await pair?.token0()
            const token1 = await pair?.token1()

            console.log({ token0, token1 }, selectedAsset?.address === token0, selectedAsset?.address === token1)

            if (sushiSwapTWAP0OracleContract && selectedAsset?.address === token0) {
                return sushiSwapTWAP0OracleContract.getDataParameter(pair?.address)
            } else if (sushiSwapTWAP1OracleContract && selectedAsset?.address === token1) {
                return sushiSwapTWAP1OracleContract.getDataParameter(pair?.address)
            }
        }

        const mapping = CHAINLINK_MAPPING[chainId || 1] || {}
        for (const address in mapping) {
            mapping[address].address = address
        }

        let multiply = ethers.constants.AddressZero
        let divide = ethers.constants.AddressZero
        const multiplyMatches = Object.values(mapping).filter(
            m => m.from === asset.address && m.to === collateral.address
        )
        const oracleData = ''
        let decimals = 0
        if (multiplyMatches.length) {
            const match = multiplyMatches[0]
            multiply = match.address!
            decimals = 18 + match.decimals - match.toDecimals + match.fromDecimals
        } else {
            const divideMatches = Object.values(mapping).filter(
                m => m.from === collateral.address && m.to === asset.address
            )
            if (divideMatches.length) {
                const match = divideMatches[0]
                divide = match.address!
                decimals = 36 - match.decimals - match.toDecimals + match.fromDecimals
            } else {
                const mapFrom = Object.values(mapping).filter(m => m.from === asset.address)
                const mapTo = Object.values(mapping).filter(m => m.from === collateral.address)
                const match = mapFrom
                    .map(mfrom => ({ mfrom: mfrom, mto: mapTo.filter(mto => mfrom.to === mto.to) }))
                    .filter(path => path.mto.length)
                if (match.length) {
                    multiply = match[0].mfrom.address!
                    divide = match[0].mto[0].address!
                    decimals =
                        18 + match[0].mfrom.decimals - match[0].mto[0].decimals - collateral.decimals + asset.decimals
                } else {
                    return ''
                }
            }
        }
        return ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256'], [multiply, divide, e10(decimals)])
    }

    // const assetTokens = Object.values(tokens).filter((token: Token) => {
    //     return true
    // })

    // const collateralTokens = Object.values(tokens).filter((token: Token) => {
    //     return token !== selectedAsset && (!selectedAsset.symbol || getOracleData(selectedAsset, token))
    // })

    const handleCreate = async () => {
        try {
            console.log('handleCreate')

            console.log({ selectedOracle, selectedAsset, selectedCollateral })

            const oracleData = await getOracleData(selectedAsset, selectedCollateral)

            console.log({ oracleData })

            if (!oracleData) {
                console.log('No path')
                return
            }

            // console.log([selectedCollateral.address, selectedAsset.address, CHAINLINK_ORACLE_ADDRESS, oracleData])

            const kashiData = ethers.utils.defaultAbiCoder.encode(
                ['address', 'address', 'address', 'bytes'],
                [selectedCollateral.address, selectedAsset.address, SUSHISWAP_TWAP_1_ORACLE_ADDRESS, oracleData]
            )

            console.log(kashiData)

            addTransaction(await bentoBoxContract?.deploy(chainId && KASHI_ADDRESS[chainId], kashiData, true), {
                summary: `Add Kashi market ${selectedAsset.symbol}/${selectedCollateral.symbol} Chainlink`
            })

            setSelectedAsset(undefined)
            setSelectedCollateral(undefined)
        } catch (e) {
            console.log(e)
        }
    }

    console.log({ tokens })

    return (
        <Layout
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage={DepositGraphic}
                    title={'Create a new Kashi Market'}
                    description={
                        'If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.'
                    }
                />
            }
        >
            <Helmet>
                <title>Create Market | Sushi</title>
            </Helmet>
            <Card
                className="h-full bg-dark-900"
                header={
                    <CardHeader className="bg-dark-800">
                        <div className="text-3xl text-high-emphesis leading-48px">Create a Market</div>
                    </CardHeader>
                }
            >
                <div className="space-y-6">
                    <TokenListBox
                        label={'Asset to Borrow (SHORT)'}
                        tokens={Object.values(tokens)}
                        selectedToken={selectedAsset}
                        setSelectedToken={setSelectedAsset}
                    />

                    <TokenListBox
                        label={'Collateral (LONG)'}
                        tokens={Object.values(tokens)}
                        selectedToken={selectedCollateral}
                        setSelectedToken={setSelectedCollateral}
                        disabled={!selectedAsset}
                    />

                    {chainId && selectedAsset && selectedCollateral && (
                        <OracleListBox
                            selectedOracle={selectedOracle}
                            setSelectedOracle={setSelectedOracle}
                            oracles={oracles.filter(oracle =>
                                oracle.id === 1
                                    ? !(
                                          chainlinkTokens?.some(t => t.address === selectedAsset) &&
                                          chainlinkTokens?.some(t => t.address === selectedCollateral)
                                      )
                                    : true
                            )}
                        />
                    )}

                    <Button
                        color="gradient"
                        className="w-full rounded text-base text-high-emphesis px-4 py-3"
                        onClick={() => handleCreate()}
                        // disabled={!selectedCollateral || !selectedAsset || selectedCollateral === selectedAsset}
                    >
                        Create Market
                    </Button>
                </div>
            </Card>
        </Layout>
    )
}

export default CreatePair
