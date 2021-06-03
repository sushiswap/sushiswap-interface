import {
    exchange,
    exchange_matic,
    masterchef,
    minichefv2_matic,
} from './client'
import { getAverageBlockTime, getOneDayBlock } from './getAverageBlockTime'
import {
    liquidityPositionSubsetQuery,
    miniChefPoolQuery,
    pairSubsetQuery,
    pairTimeTravelQuery,
    poolsQuery,
    tokenQuery,
} from './queries'
import { useCallback, useEffect, useState } from 'react'

import { ChainId } from '@sushiswap/sdk'
import { POOL_DENY } from '../../constants'
import concat from 'lodash/concat'
import orderBy from 'lodash/orderBy'
//import range from 'lodash/range'
import sushiData from '@sushiswap/sushi-data'
import { useActiveWeb3React } from '../../hooks'

interface Reward {
    token: string
    rewardPerDay: string
}

interface Farm {
    rewards: Reward[]
    tvl: string
}

const useFarms = () => {
    const { chainId } = useActiveWeb3React()
    const [farms, setFarms] = useState<any | undefined>()

    const fetchAllFarms = useCallback(async () => {
        const results = await Promise.all([
            minichefv2_matic.query({
                query: miniChefPoolQuery,
            }),
            exchange_matic.query({
                query: liquidityPositionSubsetQuery,
                variables: {
                    user: String(
                        '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F'
                    ).toLowerCase(),
                }, //minichef
            }),
            sushiData.sushi.priceUSD(),
            exchange_matic.query({
                query: tokenQuery,
                variables: {
                    id: String(
                        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
                    ).toLowerCase(),
                }, //matic
            }),
            sushiData.exchange.ethPrice(),
            //getAverageBlockTime(chainId),
            //sushiData.exchange.token({ token_address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' }) // matic
        ])

        const pools = results[0]?.data.pools
        const pairAddresses = pools
            .map((pool: any) => {
                return pool.pair
            })
            .sort()
        const pairsQuery = await exchange_matic.query({
            query: pairSubsetQuery,
            variables: { pairAddresses },
        })
        const oneDayBlock = await getOneDayBlock(chainId)
        const pairs24AgoQuery = await Promise.all(
            pairAddresses.map((address: string) => {
                //console.log(address, oneDayBlock)
                return exchange_matic.query({
                    query: pairTimeTravelQuery,
                    variables: { id: address, block: oneDayBlock },
                })
            })
        )
        const pairs24Ago = pairs24AgoQuery.map((query: any) => {
            return {
                ...query?.data?.pair,
            }
        })
        const liquidityPositions = results[1]?.data.liquidityPositions
        const sushiPrice = results[2]
        //const averageBlockTime = results[3]
        const pairs = pairsQuery?.data.pairs
        const maticPrice = results[3].data.token.derivedETH * results[4]

        const farms = pools
            .filter((pool: any) => {
                //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
                //console.log(pool.id, Number(pool.miniChef.totalAllocPoint) > 0)
                return (
                    pairs.find((pair: any) => pair?.id === pool?.pair) &&
                    Number(pool.miniChef.totalAllocPoint) > 0 &&
                    !['4'].includes(pool?.id) // manual filter for now
                )
            })
            .map((pool: any) => {
                const pair = pairs.find((pair: any) => pair.id === pool.pair)
                const pair24Ago = pairs24Ago.find(
                    (pair: any) => pair.id === pool.pair
                )
                const liquidityPosition = liquidityPositions.find(
                    (liquidityPosition: any) =>
                        liquidityPosition.pair.id === pair.id
                )

                const totalAllocPoint = 1000 //pool.miniChef.totalAllocPoint

                const balance = Number(pool.slpBalance / 1e18)
                const balanceUSD =
                    (balance / Number(pair.totalSupply)) *
                    Number(pair.reserveUSD)

                const rewardPerSecond =
                    ((pool.allocPoint / totalAllocPoint) *
                        pool.miniChef.sushiPerSecond) /
                    1e18
                const rewardPerDay = rewardPerSecond * 86400

                //console.log('pool:', pool.allocPoint, totalAllocPoint, pool.miniChef.sushiPerSecond)

                const secondaryRewardPerSecond =
                    ((pool.allocPoint / totalAllocPoint) *
                        pool.rewarder.rewardPerSecond) /
                    1e18
                const secondaryRewardPerDay = secondaryRewardPerSecond * 86400

                // const secondaryRewardPerSecond = pool.rewarder.rewardPerSecond / 1e18
                //console.log('rewardsPerDay:', rewardPerDay * 10, secondaryRewardPerDay * 10)

                // const roiPerSecond = (rewardPerSecond * 2 * sushiPrice) / balanceUSD // *2 with matic rewards
                // console.log('rewardPerSecond:', rewardPerSecond)
                // console.log('secondaryRewardPerSecond:', secondaryRewardPerSecond)
                const roiPerSecond =
                    (rewardPerSecond * sushiPrice +
                        secondaryRewardPerSecond * maticPrice) /
                    balanceUSD // *2 with matic rewards
                const roiPerHour = roiPerSecond * 3600
                const roiPerDay = roiPerHour * 24
                const roiPerMonth = roiPerDay * 30
                //const oneYearFees = 0.05
                const oneDayVolume = pair.volumeUSD
                    ? pair.volumeUSD - pair24Ago?.volumeUSD
                    : 10000
                const oneYearFees =
                    (oneDayVolume * 0.003 * 365) / pair.reserveUSD
                const oneMonthFees = oneYearFees ? oneYearFees / 12 : 0.05
                const rewardAPR = roiPerMonth * 12
                //const roiPerYear = rewardAPR
                //where (1 + r/n )** n – 1
                const roiPerYear =
                    (1 + ((roiPerMonth + oneMonthFees) * 12) / 120) ** 120 - 1
                // let roiPerYear
                // if (rewardAPR < 0.35) {
                //     roiPerYear = (1 + ((roiPerMonth + oneMonthFees) * 12) / 120) ** 120 - 1 // compounding 3 days APY
                // } else {
                //     roiPerYear = (1 + ((roiPerMonth + oneMonthFees) * 12) / 24) ** 24 - 1 // compounding 2 weeks APY
                // }
                //const roiPerYear = (1 + ((roiPerDay + feeFactorAnnualized / 365) * 365) / 365) ** 365 - 1 // compounding daily APY
                //const roiPerYear = roiPerMonth * 12
                //console.log('pool:', pool.slpBalance)
                //console.log(pair.token0.symbol + '-' + pair.token1.symbol, roiPerYear)

                return {
                    ...pool,
                    type: 'SLP',
                    symbol: pair.token0.symbol + '-' + pair.token1.symbol,
                    name: pair.token0.name + ' ' + pair.token1.name,
                    pid: Number(pool.id),
                    pairAddress: pair.id,
                    slpBalance: pool.slpBalance / 1e18,
                    liquidityPair: pair,
                    rewardTokens: [
                        '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', //SUSHI on Matic
                        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // MATIC on Matic
                    ],
                    rewards: [
                        { token: 'SUSHI', rewardPerDay },
                        { token: 'MATIC', rewardPerDay: secondaryRewardPerDay },
                    ],
                    // sushiRewardPerDay: rewardPerDay,
                    // secondaryRewardPerDay: secondaryRewardPerDay,
                    roiPerSecond,
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

                const rewardPerDay = rewardPerBlock * blocksPerHour * 24

                return {
                    ...pool,
                    contract: 'masterchefv1',
                    type: 'SLP',
                    symbol: pair.token0.symbol + '-' + pair.token1.symbol,
                    name: pair.token0.name + ' ' + pair.token1.name,
                    pid: Number(pool.id),
                    pairAddress: pair.id,
                    slpBalance: pool.balance / 1e18,
                    rewards: [{ token: 'SUSHI', rewardPerDay: rewardPerDay }],
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
            getAverageBlockTime(),
        ])
        const pools = results[0]?.data.pools
        const kashiPairs = results[1].filter((result) => result !== undefined) // filter out undefined (not in onsen) from all kashiPairs
        const averageBlockTime = results[2]
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
                const pair = kashiPairs.find((pair) => pair?.id === pool?.pair)
                const blocksPerHour = 3600 / Number(averageBlockTime)
                const rewardPerBlock = pair?.rewardPerBlock
                const rewardPerDay = rewardPerBlock
                    ? rewardPerBlock * blocksPerHour * 24
                    : 0
                return {
                    ...pool,
                    ...pair,
                    contract: 'masterchefv1',
                    type: 'KMP',
                    pid: Number(pool.id),
                    pairAddress: pair?.id,
                    pairSymbol: pair?.symbol,
                    liquidityPair: {
                        token0: {
                            id: pair?.collateral,
                            symbol: pair?.collateralSymbol,
                            decimals: pair?.collateralDecimals,
                        },
                        token1: {
                            id: pair?.asset,
                            symbol: pair?.assetSymbol,
                            decimals: pair?.assetDecimals,
                        },
                    },
                    rewards: [{ token: 'SUSHI', rewardPerDay }],
                    roiPerYear: pair?.roiPerYear,
                    slpBalance: pair?.totalAssetStaked
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
            if (chainId === ChainId.MAINNET) {
                const results = await Promise.all([
                    fetchSLPFarms(),
                    fetchKMPFarms(),
                ])
                const combined = concat(results[0], results[1])
                const sorted = orderBy(combined, ['pid'], ['desc'])
                setFarms(sorted)
            } else if (chainId === ChainId.MATIC) {
                setFarms(await fetchAllFarms())
            }
        }
        fetchData()
    }, [fetchKMPFarms, fetchSLPFarms])

    return farms
}

export default useFarms
