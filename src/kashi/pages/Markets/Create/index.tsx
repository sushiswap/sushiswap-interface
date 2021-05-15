import {
    CHAINLINK_MAPPING,
    CHAINLINK_ORACLE_ADDRESS,
    CHAINLINK_TOKENS,
    ChainlinkToken,
    KASHI_ADDRESS,
    SUSHISWAP_TWAP_0_ORACLE_ADDRESS
} from 'kashi/constants'
import { Card, CardHeader, Layout, WarningsView } from 'kashi/components'
import { ChainId, JSBI, Pair, Token } from '@sushiswap/sdk'
import { PairState, usePair } from 'data/Reserves'
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
import { Warnings } from 'kashi/entities'
import { e10 } from 'kashi/functions/math'
import { ethers } from 'ethers'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useAllTokens } from 'hooks/Tokens'
import { useTotalSupply } from 'data/TotalSupply'
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

    const [pairState, pair] = usePair(selectedAsset, selectedCollateral)
    const totalSupply = useTotalSupply(pair?.liquidityToken)
    const noLiquidity: boolean =
        pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, JSBI.BigInt(0)))

    const addTransaction = useTransactionAdder()

    const tokens = useAllTokens()

    const chainlinkTokens = chainId && CHAINLINK_TOKENS[chainId]

    // TODO: Low liquidity warning
    const createWarnings = new Warnings().add(
        selectedOracle?.id === OracleId.SUSHISWAP && noLiquidity,
        'There is no SushiSwap pair or the pair has no liquidity!',
        true
    )

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

        const oracleData = ''

        if (selectedOracle && selectedOracle.id === OracleId.SUSHISWAP) {
            if (sushiSwapTWAP0OracleContract && selectedAsset?.address === pair?.token0.address) {
                return sushiSwapTWAP0OracleContract.getDataParameter(pair?.liquidityToken.address)
            } else if (sushiSwapTWAP1OracleContract && selectedAsset?.address === pair?.token1.address) {
                return sushiSwapTWAP1OracleContract.getDataParameter(pair?.liquidityToken.address)
            }
            return oracleData
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

            if (!selectedAsset || !selectedCollateral || !selectedOracle) return

            const oracleData = await getOracleData(selectedAsset, selectedCollateral)

            console.log({ oracleData })

            if (!oracleData) {
                console.log('No path')
                return
            }

            let oracleAddress

            if (selectedOracle && selectedOracle.id === OracleId.CHAINLINK) {
                oracleAddress = CHAINLINK_ORACLE_ADDRESS
            } else if (selectedOracle && selectedOracle.id === OracleId.SUSHISWAP) {
                if (selectedAsset?.address === pair?.token0.address) {
                    oracleAddress = SUSHISWAP_TWAP_0_ORACLE_ADDRESS
                } else if (selectedAsset?.address === pair?.token1.address) {
                    oracleAddress = SUSHISWAP_TWAP_1_ORACLE_ADDRESS
                }
            }

            const kashiData = ethers.utils.defaultAbiCoder.encode(
                ['address', 'address', 'address', 'bytes'],
                [selectedCollateral.address, selectedAsset.address, oracleAddress, oracleData]
            )

            console.log(kashiData)

            addTransaction(await bentoBoxContract?.deploy(chainId && KASHI_ADDRESS[chainId], kashiData, true), {
                summary: `Add Kashi market ${selectedAsset.symbol}/${selectedCollateral.symbol} ${selectedOracle.name}`
            })

            setSelectedAsset(undefined)
            setSelectedCollateral(undefined)
        } catch (e) {
            console.log(e)
        }
    }

    function oracleFilter(oracle: Oracle) {
        if (oracle.id === OracleId.CHAINLINK) {
            return (
                chainlinkTokens?.some(t => t.address === selectedAsset.address) &&
                chainlinkTokens?.some(t => t.address === selectedCollateral.address)
            )
        }

        if (oracle.id === OracleId.SUSHISWAP && !noLiquidity) {
            return true
        }

        return false
    }

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
                            oracles={oracles.filter(oracleFilter)}
                        />
                    )}

                    <WarningsView warnings={createWarnings} />

                    <Button
                        color="gradient"
                        className="w-full rounded text-base text-high-emphesis px-4 py-3"
                        onClick={() => handleCreate()}
                        disabled={
                            !selectedCollateral ||
                            !selectedAsset ||
                            selectedCollateral === selectedAsset ||
                            (selectedOracle?.id === OracleId.SUSHISWAP && noLiquidity)
                        }
                    >
                        Create Market
                    </Button>
                </div>
            </Card>
        </Layout>
    )
}

export default CreatePair
