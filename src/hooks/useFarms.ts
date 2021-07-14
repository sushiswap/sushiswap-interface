import { exchange, masterchef } from 'apollo/client'
import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from 'apollo/queries'
import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import Fraction from '../entities/Fraction'
import { POOL_DENY } from '../constants'
import concat from 'lodash/concat'
import { getAverageBlockTime } from 'apollo/getAverageBlockTime'
import orderBy from 'lodash/orderBy'
import range from 'lodash/range'
import sushiData from '@sushiswap/sushi-data'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useBoringHelperContract } from 'hooks/useContract'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarms = () => {
    const [farms, setFarms] = useState<any | undefined>()
    const { account } = useActiveWeb3React()
    const boringHelperContract = useBoringHelperContract()

    const fetchAllFarms = useCallback(async () => {
        const results = await Promise.all([
            masterchef.query({
                // results[0]
                query: poolsQuery
            }),
            exchange.query({
                // results[1]
                query: liquidityPositionSubsetQuery,
                variables: { user: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd' }
            }),
            getAverageBlockTime(), // results[2]
            sushiData.sushi.priceUSD(), // results[3]
            sushiData.bentobox.kashiStakedInfo() //results[4]
        ])
        const pools = results[0]?.data.pools
        const pairAddresses = pools
            .map((pool: any) => {
                return pool.pair
            })
            .sort()
        const pairsQuery = await exchange.query({
            query: pairSubsetQuery,
            variables: { pairAddresses }
        })

        const liquidityPositions = results[1]?.data.liquidityPositions
        const averageBlockTime = results[2]
        const sushiPrice = results[3]
        const kashiPairs = results[4].filter(result => result !== undefined) // filter out undefined (not in onsen) from all kashiPairs

        const pairs = pairsQuery?.data.pairs
        const KASHI_PAIRS = pools
            .filter((pool: any) => {
                const hasPair = kashiPairs.find((kashiPair: any) => kashiPair?.id === pool?.pair)
                console.log('pool.pair:', pool.pair, pool.id, hasPair)

                return hasPair
            })
            .map((pool: any) => {
                return Number(pool.id)
            })
        //const KASHI_PAIRS = concat(range(190, 230, 1), range(245, 250, 1), range(264, 268, 1)) // kashiPair pids 190-229, 245-249
        //console.log('kashiPairs:', KASHI_PAIRS.length, kashiPairs.length, kashiPairs, KASHI_PAIRS)

        const farms = pools
            .filter((pool: any) => {
                //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
                return (
                    !POOL_DENY.includes(pool?.id) &&
                    (pairs.find((pair: any) => pair?.id === pool?.pair) || KASHI_PAIRS.includes(Number(pool?.id)))
                )
            })
            .map((pool: any) => {
                if (KASHI_PAIRS.includes(Number(pool?.id))) {
                    const pair = kashiPairs.find((pair: any) => pair?.id === pool?.pair)
                    //console.log('kpair:', pair, pool)
                    return {
                        ...pool,
                        ...pair,
                        type: 'KMP',
                        pid: Number(pool.id),
                        pairAddress: pair?.id,
                        pairSymbol: pair?.symbol,
                        liquidityPair: {
                            collateral: {
                                id: pair?.collateral,
                                symbol: pair?.collateralSymbol,
                                decimals: pair?.collateralDecimals
                            },
                            asset: { id: pair?.asset, symbol: pair?.assetSymbol, decimals: pair?.assetDecimals }
                        },
                        roiPerYear: pair?.roiPerYear,
                        totalAssetStaked: pair?.totalAssetStaked
                            ? pair?.totalAssetStaked / Math.pow(10, pair?.assetDecimals)
                            : 0,
                        tvl: pair?.balanceUSD ? pair?.balanceUSD : 0
                    }
                } else {
                    const pair = pairs.find((pair: any) => pair.id === pool.pair)
                    const liquidityPosition = liquidityPositions.find(
                        (liquidityPosition: any) => liquidityPosition.pair.id === pair.id
                    )
                    const blocksPerHour = 3600 / Number(averageBlockTime)
                    const balance = Number(pool.balance / 1e18)
                    const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
                    const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
                    const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
                    const rewardPerBlock =
                        ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.sushiPerBlock) / 1e18
                    const roiPerBlock = (rewardPerBlock * sushiPrice) / balanceUSD
                    const roiPerHour = roiPerBlock * blocksPerHour
                    const roiPerDay = roiPerHour * 24
                    const roiPerMonth = roiPerDay * 30
                    const roiPerYear = roiPerMonth * 12

                    // // Logging:
                    // const tempSymbol = pair.token0.symbol + '-' + pair.token1.symbol
                    // if (tempSymbol === 'WBTC-ibBTC' || tempSymbol === 'BTC2x-FLI-WBTC' || tempSymbol === 'BASK-WETH') {
                    //     console.log(pair.token0.symbol + '-' + pair.token1.symbol, {
                    //         totalSupply: totalSupply,
                    //         reserveUSD: reserveUSD,
                    //         balance: balance,
                    //         poolBalance: pool.balance,
                    //         roiPerBlock: roiPerBlock,
                    //         rewardPerBlock: rewardPerBlock,
                    //         sushiPrice: sushiPrice,
                    //         balanceUSD: balanceUSD
                    //     })
                    // }

                    return {
                        ...pool,
                        type: 'SLP',
                        symbol: pair.token0.symbol + '-' + pair.token1.symbol,
                        name: pair.token0.name + ' ' + pair.token1.name,
                        pid: Number(pool.id),
                        pairAddress: pair.id,
                        slpBalance: pool.balance,
                        liquidityPair: pair,
                        roiPerBlock,
                        roiPerHour,
                        roiPerDay,
                        roiPerMonth,
                        roiPerYear,
                        rewardPerThousand: 1 * roiPerDay * (1000 / sushiPrice),
                        tvl: liquidityPosition?.liquidityTokenBalance
                            ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
                            : 0.1
                    }
                }
            })

        //console.log('farms:', farms)
        const sorted = orderBy(farms, ['pid'], ['desc'])

        const pids = sorted.map(pool => {
            return pool.pid
        })

        if (account) {
            const userFarmDetails = await boringHelperContract?.pollPools(account, pids)
            //console.log('userFarmDetails:', userFarmDetails)
            const userFarms = userFarmDetails
                .filter((farm: any) => {
                    return farm.balance.gt(BigNumber.from(0)) || farm.pending.gt(BigNumber.from(0))
                })
                .map((farm: any) => {
                    //console.log('userFarm:', farm.pid.toNumber(), farm)

                    const pid = farm.pid.toNumber()
                    const farmDetails = sorted.find((pair: any) => pair.pid === pid)

                    console.log('farmDetails:', farmDetails)
                    let deposited
                    let depositedUSD
                    if (farmDetails && farmDetails.type === 'KMP') {
                        deposited = Fraction.from(
                            farm.balance,
                            BigNumber.from(10).pow(farmDetails.liquidityPair.asset.decimals)
                        ).toString()
                        depositedUSD =
                            farmDetails.totalAssetStaked && farmDetails.totalAssetStaked > 0
                                ? (Number(deposited) * Number(farmDetails.tvl)) / farmDetails.totalAssetStaked
                                : 0
                    } else {
                        deposited = Fraction.from(farm.balance, BigNumber.from(10).pow(18)).toString(18)
                        depositedUSD =
                            farmDetails.slpBalance && Number(farmDetails.slpBalance / 1e18) > 0
                                ? (Number(deposited) * Number(farmDetails.tvl)) / (farmDetails.slpBalance / 1e18)
                                : 0
                    }
                    const pending = Fraction.from(farm.pending, BigNumber.from(10).pow(18)).toString(18)

                    return {
                        ...farmDetails,
                        type: farmDetails.type, // KMP or SLP
                        depositedLP: deposited,
                        depositedUSD: depositedUSD,
                        pendingSushi: pending
                    }
                })
            setFarms({ farms: sorted, userFarms: userFarms })
            //console.log('userFarms:', userFarms)
        } else {
            setFarms({ farms: sorted, userFarms: [] })
        }
    }, [account, boringHelperContract])

    useEffect(() => {
        fetchAllFarms()
    }, [fetchAllFarms])

    return farms
}

export default useFarms
