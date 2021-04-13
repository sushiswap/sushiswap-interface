import { blocksQuery } from './queries'
import { blockClient } from './client'
import { getUnixTime, startOfHour, startOfMinute, startOfSecond, subHours } from 'date-fns'

export async function getAverageBlockTime() {
    // Course timestamps used to make better use of the cache (startOfHour + startOfMinuite + startOfSecond)
    const now = startOfSecond(startOfMinute(startOfHour(Date.now())))
    const start = getUnixTime(subHours(now, 6))
    const end = getUnixTime(now)

    const query = await blockClient.query({
        query: blocksQuery,
        variables: {
            start,
            end
        }
    })
    const blocks = query?.data.blocks

    const averageBlockTime = blocks.reduce(
        (previousValue: any, currentValue: any, currentIndex: any) => {
            if (previousValue.timestamp) {
                const difference = previousValue.timestamp - currentValue.timestamp
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
