import { exchange, masterchefv2 } from 'apollo/client'
import { getAverageBlockTime, getOneDayBlock } from 'apollo/getAverageBlockTime'
import {
    liquidityPositionSubsetQuery,
    masterchefv2PoolsQuery,
    pairSubsetQuery,
    pairTimeTravelQuery,
    tokenQuery
} from 'apollo/queries'
import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/sdk'
import orderBy from 'lodash/orderBy'
import sushiData from '@sushiswap/sushi-data'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useBoringHelperContract } from 'hooks/useContract'

//import Fraction from '../../../entities/Fraction'
//import { resetIdCounter } from 'react-tabs'
//import { apys } from '@lufycz/sushi-data/dist/sushi/queries/masterchef'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarms = () => {
    const [farms, setFarms] = useState<any | undefined>()
    const { account, chainId } = useActiveWeb3React()
    const boringHelperContract = useBoringHelperContract()

    const fetchAllFarms = useCallback(async () => {
        const results = await Promise.all([
            masterchefv2.query({
                query: masterchefv2PoolsQuery
            }),
            exchange.query({
                query: liquidityPositionSubsetQuery,
                variables: { user: String('0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d').toLowerCase() } //masterchefv2
            }),
            sushiData.sushi.priceUSD(),
            exchange.query({
                query: tokenQuery,
                variables: { id: String('0xdbdb4d16eda451d0503b854cf79d55697f90c8df').toLowerCase() } // alcx
            }),
            sushiData.exchange.ethPrice(),
            getAverageBlockTime()
        ])

        const pools = results[0]?.data.pools

        console.log('mcv2_pools:', pools)
        const pairAddresses = pools
            .map((pool: any) => {
                return pool.pair
            })
            .sort()
        const pairsQuery = await exchange.query({
            query: pairSubsetQuery,
            variables: { pairAddresses }
        })
        const oneDayBlock = await getOneDayBlock(chainId)
        const pairs24AgoQuery = await Promise.all(
            pairAddresses.map((address: string) => {
                //console.log(address, oneDayBlock)
                return exchange.query({
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
        const pairs = pairsQuery?.data.pairs
        const ethPrice = results[4]
        const alcxPrice = results[3].data.token.derivedETH * ethPrice
        const averageBlockTime = results[5]

        const farms = pools
            .filter((pool: any) => {
                //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
                //console.log(pool.id, Number(pool.miniChef.totalAllocPoint) > 0)
                return pairs.find((pair: any) => pair?.id === pool?.pair)
                // && Number(pool.miniChef.totalAllocPoint) > 0
                // &&!['4'].includes(pool?.id) // manual filter for now
            })
            .map((pool: any) => {
                const pair = pairs.find((pair: any) => pair.id === pool.pair)
                const pair24Ago = pairs24Ago.find((pair: any) => pair.id === pool.pair)
                const liquidityPosition = liquidityPositions.find(
                    (liquidityPosition: any) => liquidityPosition.pair.id === pair.id
                )

                const totalAllocPoint = 100 //pool.masterchefv2.totalAllocPoint

                const balance = Number(pool.slpBalance / 1e18)
                const balanceUSD = (balance / Number(pair.totalSupply)) * Number(pair.reserveUSD)

                const sushiPerBlock = 18.6

                const rewardPerBlock = (pool.allocPoint / 26480) * sushiPerBlock
                const secondaryRewardPerBlock = 0 / 1e18

                const blocksPerHour = 3600 / Number(averageBlockTime)
                const roiPerBlock =
                    (rewardPerBlock * sushiPrice) / balanceUSD + (secondaryRewardPerBlock * alcxPrice) / balanceUSD // TODO: include alcx pricing
                const roiPerHour = roiPerBlock * blocksPerHour
                const roiPerDay = roiPerHour * 24
                const roiPerMonth = roiPerDay * 30
                const roiPerYear = roiPerMonth * 12

                const rewardPerDay = rewardPerBlock * blocksPerHour * 24

                const secondaryRewardPerDay = secondaryRewardPerBlock * blocksPerHour * 24

                return {
                    ...pool,
                    type: 'SLP',
                    contract: 'masterchefv2',
                    symbol: pair.token0.symbol + '-' + pair.token1.symbol,
                    name: pair.token0.name + ' ' + pair.token1.name,
                    pid: Number(pool.id),
                    pairAddress: pair.id,
                    slpBalance: pool.slpBalance,
                    liquidityPair: pair,
                    rewardTokens: [
                        '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', //SUSHI on Mainnet
                        '0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF' // ALCX on Mainnet
                    ],
                    sushiRewardPerDay: rewardPerDay,
                    secondaryRewardPerDay: secondaryRewardPerDay,
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
            })

        //console.log('farms:', farms)
        const sorted = orderBy(farms, ['pid'], ['desc'])

        const pids = sorted.map(pool => {
            return pool.pid
        })
        setFarms(sorted)
    }, [chainId])

    useEffect(() => {
        if (chainId === ChainId.MAINNET) {
            fetchAllFarms()
        } else {
            setFarms([])
        }
    }, [chainId, fetchAllFarms])

    return farms
}

export default useFarms
