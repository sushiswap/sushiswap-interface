import { blockClient, blockClient_matic } from './client'
import { blockQuery, blocksQuery } from './queries'
import {
    getUnixTime,
    startOfHour,
    startOfMinute,
    startOfSecond,
    subDays,
    subHours,
} from 'date-fns'

import { ChainId } from '@sushiswap/sdk'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

export async function getOneDayBlock(
    chainId: ChainId = 1
): Promise<{ number: number }> {
    const date = startOfMinute(subDays(Date.now(), 1))
    const start = Math.floor(Number(date) / 1000)
    const end = Math.floor(Number(date) / 1000) + 600

    let blocksData
    if (chainId === ChainId.MATIC) {
        blocksData = await blockClient_matic.query({
            query: blockQuery,
            variables: {
                start,
                end,
            },
            context: {
                clientName: 'blocklytics',
            },
            fetchPolicy: 'network-only',
        })
    } else {
        blocksData = await blockClient.query({
            query: blockQuery,
            variables: {
                start,
                end,
            },
            context: {
                clientName: 'blocklytics',
            },
            fetchPolicy: 'network-only',
        })
    }

    return { number: Number(blocksData?.data?.blocks[0].number) }
}

export async function getAverageBlockTime(
    chainId: ChainId = 1
): Promise<{ timestamp: null; difference: number }> {
    // Course timestamps used to make better use of the cache (startOfHour + startOfMinuite + startOfSecond)
    const now = startOfSecond(startOfMinute(startOfHour(Date.now())))
    const start = getUnixTime(subHours(now, 6))
    const end = getUnixTime(now)

    let query
    if (chainId === ChainId.MATIC) {
        query = await blockClient_matic.query({
            query: blocksQuery,
            variables: {
                start,
                end,
            },
        })
    } else {
        query = await blockClient.query({
            query: blocksQuery,
            variables: {
                start,
                end,
            },
        })
    }
    const blocks = query?.data.blocks

    const averageBlockTime = blocks.reduce(
        (previousValue: any, currentValue: any, currentIndex: any) => {
            if (previousValue.timestamp) {
                const difference =
                    previousValue.timestamp - currentValue.timestamp
                previousValue.difference = previousValue.difference + difference
            }
            previousValue.timestamp = currentValue.timestamp
            if (currentIndex === blocks.length - 1) {
                return previousValue.difference / blocks.length
            }
            return previousValue
        },
        { timestamp: null, difference: 0 }
    )
    return averageBlockTime
}
