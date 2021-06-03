import { exchange, masterchef } from '../../client'
import {
    liquidityPositionSubsetQuery,
    pairSubsetQuery,
    poolsQuery,
} from '../../queries'
import { useCallback, useEffect, useState } from 'react'

import { POOL_DENY } from '../../../../constants'
import { getAverageBlockTime } from '../../getAverageBlockTime'
import orderBy from 'lodash/orderBy'
//import range from 'lodash/range'
import sushiData from '@sushiswap/sushi-data'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarms = () => {
    const [farms, setFarms] = useState<any | undefined>()

    const fetchSLPFarms = useCallback(async () => {
        const results = await Promise.all([
            masterchef.query({
                query: poolsQuery,
            }),
            exchange.query({
                query: liquidityPositionSubsetQuery,
                variables: {
                    user: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
                },
            }),
            getAverageBlockTime(),
            sushiData.sushi.priceUSD(),
        ])
        const pools = results[0]?.data.pools
        const pairAddresses = pools
            .map((pool: any) => {
                return pool.pair
            })
            .sort()
        const pairsQuery = await exchange.query({
            query: pairSubsetQuery,
            variables: { pairAddresses },
        })

        const liquidityPositions = results[1]?.data.liquidityPositions
        const averageBlockTime = results[2]
        const sushiPrice = results[3]

        const pairs = pairsQuery?.data.pairs

        const farms = pools
            .filter((pool: any) => {
                return (
                    !POOL_DENY.includes(pool?.id) &&
                    pairs.find((pair: any) => pair?.id === pool?.pair)
                )
            })
            .map((pool: any) => {
                const pair = pairs.find((pair: any) => pair.id === pool.pair)
                const liquidityPosition = liquidityPositions.find(
                    (liquidityPosition: any) =>
                        liquidityPosition.pair.id === pair.id
                )
                const blocksPerHour = 3600 / Number(averageBlockTime)
                const balance = Number(pool.balance / 1e18)
                const totalSupply =
                    pair.totalSupply > 0 ? pair.totalSupply : 0.1
                const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
                const balanceUSD =
                    (balance / Number(totalSupply)) * Number(reserveUSD)
                const rewardPerBlock =
                    ((pool.allocPoint / pool.owner.totalAllocPoint) *
                        pool.owner.sushiPerBlock) /
                    1e18
                const roiPerBlock = (rewardPerBlock * sushiPrice) / balanceUSD
                const roiPerHour = roiPerBlock * blocksPerHour
                const roiPerDay = roiPerHour * 24
                const roiPerMonth = roiPerDay * 30
                const roiPerYear = roiPerMonth * 12

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
                        ? (pair.reserveUSD / pair.totalSupply) *
                          liquidityPosition.liquidityTokenBalance
                        : 0.1,
                }
            })

        const sorted = orderBy(farms, ['pid'], ['desc'])
        return sorted
    }, [])

    const fetchKMPFarms = useCallback(async () => {
        const results = await Promise.all([
            masterchef.query({
                query: poolsQuery,
            }),
            sushiData.bentobox.kashiStakedInfo(),
        ])
        const pools = results[0]?.data.pools
        const kashiPairs = results[1].filter((result) => result !== undefined) // filter out undefined (not in onsen) from all kashiPairs

        const KASHI_PAIRS = pools
            .filter((pool: any) => {
                const hasPair = kashiPairs.find(
                    (kashiPair: any) => kashiPair?.id === pool?.pair
                )
                return hasPair
            })
            .map((pool: any) => {
                return Number(pool.id)
            })
        //const KASHI_PAIRS = concat(range(190, 230, 1), range(245, 250, 1), range(264, 268, 1)) // kashiPair pids 190-229, 245-249
        const farms = pools
            .filter((pool: any) => {
                return (
                    !POOL_DENY.includes(pool?.id) &&
                    KASHI_PAIRS.includes(Number(pool?.id))
                )
            })
            .map((pool: any) => {
                const pair = kashiPairs.find(
                    (pair: any) => pair?.id === pool?.pair
                )
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
                            decimals: pair?.collateralDecimals,
                        },
                        asset: {
                            id: pair?.asset,
                            symbol: pair?.assetSymbol,
                            decimals: pair?.assetDecimals,
                        },
                    },
                    roiPerYear: pair?.roiPerYear,
                    totalAssetStaked: pair?.totalAssetStaked
                        ? pair?.totalAssetStaked /
                          Math.pow(10, pair?.assetDecimals)
                        : 0,
                    tvl: pair?.balanceUSD ? pair?.balanceUSD : 0,
                }
            })

        const sorted = orderBy(farms, ['pid'], ['desc'])
        return sorted
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const results = await Promise.all([
                fetchSLPFarms(),
                fetchKMPFarms(),
            ])
            console.log('farm results:', results)
        }
        fetchData()
    }, [fetchKMPFarms, fetchSLPFarms])

    return farms
}

export default useFarms
