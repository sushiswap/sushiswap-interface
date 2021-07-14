import { BigNumber } from '@ethersproject/bignumber'
import sushiData from '@sushiswap/sushi-data'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useBoringHelperContract } from 'hooks/useContract'
import orderBy from 'lodash/orderBy'
import { useCallback, useEffect, useState } from 'react'
import { exchange_matic, minichefv2_matic } from 'apollo/client'
import { getOneDayBlock } from 'apollo/getAverageBlockTime'
import {
    tokenQuery,
    liquidityPositionSubsetQuery,
    pairSubsetQuery,
    pairTimeTravelQuery,
    miniChefPoolQuery
} from 'apollo/queries'
import { POOL_DENY } from '../../constants'
import Fraction from '../../entities/Fraction'
import { resetIdCounter } from 'react-tabs'
import { apys } from '@lufycz/sushi-data/dist/sushi/queries/masterchef'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarms = () => {
    const [farms, setFarms] = useState<any | undefined>()
    const { account, chainId } = useActiveWeb3React()
    const boringHelperContract = useBoringHelperContract()

    const fetchAllFarms = useCallback(async () => {
        const results = await Promise.all([
            minichefv2_matic.query({
                query: miniChefPoolQuery
            }),
            exchange_matic.query({
                query: liquidityPositionSubsetQuery,
                variables: { user: String('0x0769fd68dFb93167989C6f7254cd0D766Fb2841F').toLowerCase() } //minichef
            }),
            sushiData.sushi.priceUSD(),
            exchange_matic.query({
                query: tokenQuery,
                variables: { id: String('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270').toLowerCase() } //matic
            }),
            sushiData.exchange.ethPrice()
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
            variables: { pairAddresses }
        })
        const oneDayBlock = await getOneDayBlock(chainId)
        const pairs24AgoQuery = await Promise.all(
            pairAddresses.map((address: string) => {
                //console.log(address, oneDayBlock)
                return exchange_matic.query({
                    query: pairTimeTravelQuery,
                    variables: { id: address, block: oneDayBlock }
                })
            })
        )
        const pairs24Ago = pairs24AgoQuery.map((query: any) => {
            return {
                ...query?.data?.pair
            }
        })

        const liquidityPositions = results[1]?.data.liquidityPositions
        const sushiPrice = results[2]
        //const averageBlockTime = results[3]
        const pairs = pairsQuery?.data.pairs
        const maticPrice = results[3].data.token.derivedETH * results[4]
        //console.log('maticPrice:', maticPrice)

        //const maticPrice = results[3]
        //console.log('maticPrice:', maticPrice)

        //console.log('pools:', pools)
        const farms = pools
            .filter((pool: any) => {
                //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
                //console.log(pool.id, Number(pool.miniChef.totalAllocPoint) > 0)
                return (
                    //!POOL_DENY.includes(pool?.id) &&
                    pairs.find((pair: any) => pair?.id === pool?.pair) &&
                    Number(pool.miniChef.totalAllocPoint) > 0 &&
                    !['4'].includes(pool?.id) // manual filter for now
                )
            })
            .map((pool: any) => {
                const pair = pairs.find((pair: any) => pair.id === pool.pair)
                const pair24Ago = pairs24Ago.find((pair: any) => pair.id === pool.pair)
                const liquidityPosition = liquidityPositions.find(
                    (liquidityPosition: any) => liquidityPosition.pair.id === pair.id
                )

                const totalAllocPoint = 1000 //pool.miniChef.totalAllocPoint

                const balance = Number(pool.slpBalance / 1e18)
                const balanceUSD = (balance / Number(pair.totalSupply)) * Number(pair.reserveUSD)

                const rewardPerSecond = ((pool.allocPoint / totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
                const rewardPerDay = rewardPerSecond * 86400

                //console.log('pool:', pool.allocPoint, totalAllocPoint, pool.miniChef.sushiPerSecond)

                const secondaryRewardPerSecond =
                    ((pool.allocPoint / totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18
                const secondaryRewardPerDay = secondaryRewardPerSecond * 86400

                // const secondaryRewardPerSecond = pool.rewarder.rewardPerSecond / 1e18
                //console.log('rewardsPerDay:', rewardPerDay * 10, secondaryRewardPerDay * 10)

                // const roiPerSecond = (rewardPerSecond * 2 * sushiPrice) / balanceUSD // *2 with matic rewards
                // console.log('rewardPerSecond:', rewardPerSecond)
                // console.log('secondaryRewardPerSecond:', secondaryRewardPerSecond)
                const roiPerSecond = (rewardPerSecond * sushiPrice + secondaryRewardPerSecond * maticPrice) / balanceUSD // *2 with matic rewards
                const roiPerHour = roiPerSecond * 3600
                const roiPerDay = roiPerHour * 24
                const roiPerMonth = roiPerDay * 30
                //const oneYearFees = 0.05
                const oneDayVolume = pair.volumeUSD ? pair.volumeUSD - pair24Ago?.volumeUSD : 10000
                const oneYearFees = (oneDayVolume * 0.003 * 365) / pair.reserveUSD
                const oneMonthFees = oneYearFees ? oneYearFees / 12 : 0.05
                const rewardAPR = roiPerMonth * 12
                //const roiPerYear = rewardAPR
                //where (1 + r/n )** n – 1
                const roiPerYear = (1 + ((roiPerMonth + oneMonthFees) * 12) / 120) ** 120 - 1
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
                    slpBalance: pool.slpBalance,
                    liquidityPair: pair,
                    rewardTokens: [
                        '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', //SUSHI on Matic
                        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' // MATIC on Matic
                    ],
                    sushiRewardPerDay: rewardPerDay,
                    secondaryRewardPerDay: secondaryRewardPerDay,
                    roiPerSecond,
                    roiPerHour,
                    roiPerDay,
                    roiPerMonth,
                    roiPerYear,
                    rewardPerThousand: 1 * roiPerDay * (1000 / sushiPrice),
                    tvl: liquidityPosition?.liquidityTokenBalance
                        ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
                        : 0.1
                }
            })

        //console.log('farms:', farms)
        const sorted = orderBy(farms, ['pid'], ['desc'])

        const pids = sorted.map(pool => {
            return pool.pid
        })
        setFarms({ farms: sorted, userFarms: [] })
        // if (account) {
        //     const userFarmDetails = await boringHelperContract?.pollPools(account, pids)
        //     //console.log('userFarmDetails:', userFarmDetails)
        //     const userFarms = userFarmDetails
        //         .filter((farm: any) => {
        //             return farm.balance.gt(BigNumber.from(0)) || farm.pending.gt(BigNumber.from(0))
        //         })
        //         .map((farm: any) => {
        //             //console.log('userFarm:', farm.pid.toNumber(), farm)

        //             const pid = farm.pid.toNumber()
        //             const farmDetails = sorted.find((pair: any) => pair.pid === pid)
        //             const deposited = Fraction.from(farm.balance, BigNumber.from(10).pow(18)).toString(18)
        //             const depositedUSD =
        //                 farmDetails.slpBalance && Number(farmDetails.slpBalance / 1e18) > 0
        //                     ? (Number(deposited) * Number(farmDetails.tvl)) / (farmDetails.slpBalance / 1e18)
        //                     : 0
        //             const pending = Fraction.from(farm.pending, BigNumber.from(10).pow(18)).toString(18)

        //             return {
        //                 ...farmDetails,
        //                 type: farmDetails.type, // KMP or SLP
        //                 depositedLP: deposited,
        //                 depositedUSD: depositedUSD,
        //                 pendingSushi: pending
        //             }
        //         })
        //     setFarms({ farms: sorted, userFarms: userFarms })
        //     //console.log('userFarms:', userFarms)
        // } else {
        //     setFarms({ farms: sorted, userFarms: [] })
        // }
    }, [])

    useEffect(() => {
        fetchAllFarms()
    }, [fetchAllFarms])

    return farms
}

export default useFarms
