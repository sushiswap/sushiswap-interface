import { blockQuery, blocksQuery, massBlocksQuery } from '../queries'
import { getUnixTime, startOfHour, subDays, subHours } from 'date-fns'

import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

export const BLOCKS = {
  [ChainId.MAINNET]: 'blocklytics/ethereum-blocks',
  [ChainId.XDAI]: 'matthewlilley/xdai-blocks',
  [ChainId.MATIC]: 'matthewlilley/polygon-blocks',
  [ChainId.FANTOM]: 'matthewlilley/fantom-blocks',
  [ChainId.BSC]: 'matthewlilley/bsc-blocks',
  [ChainId.HARMONY]: 'sushiswap/harmony-blocks',
  [ChainId.AVALANCHE]: 'matthewlilley/avalanche-blocks',
  [ChainId.CELO]: 'sushiswap/celo-blocks',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-blocks',
}

export const fetcher = async (chainId = ChainId.MAINNET, query, variables = undefined) => {
  return request(`${GRAPH_HOST[chainId]}/subgraphs/name/${BLOCKS[chainId]}`, query, variables)
}

export const getBlock = async (chainId = ChainId.MAINNET, timestamp: number) => {
  const { blocks } = await fetcher(
    chainId,
    blockQuery,
    timestamp
      ? {
          where: {
            timestamp_gt: timestamp - 600,
            timestamp_lt: timestamp,
          },
        }
      : {}
  )

  return Number(blocks?.[0]?.number)
}

export const getBlocks = async (chainId = ChainId.MAINNET, start, end) => {
  const { blocks } = await fetcher(chainId, blocksQuery, {
    start,
    end,
  })
  return blocks
}

export const getMassBlocks = async (chainId = ChainId.MAINNET, timestamps) => {
  const data = await fetcher(chainId, massBlocksQuery(timestamps))
  return Object.values(data).map((entry) => ({
    number: Number(entry[0].number),
    timestamp: Number(entry[0].timestamp),
  }))
}

// Grabs the last 1000 (a sample statistical) blocks and averages
// the time difference between them
export const getAverageBlockTime = async (chainId = ChainId.MAINNET) => {
  // console.log('getAverageBlockTime')
  const now = startOfHour(Date.now())
  const start = getUnixTime(subHours(now, 6))
  const end = getUnixTime(now)
  const blocks = await getBlocks(chainId, start, end)
  const averageBlockTime = blocks?.reduce(
    (previousValue, currentValue, currentIndex) => {
      if (previousValue.timestamp) {
        const difference = previousValue.timestamp - currentValue.timestamp

        previousValue.averageBlockTime = previousValue.averageBlockTime + difference
      }

      previousValue.timestamp = currentValue.timestamp

      if (currentIndex === blocks.length - 1) {
        return previousValue.averageBlockTime / blocks.length
      }

      return previousValue
    },
    { timestamp: null, averageBlockTime: 0 }
  )

  return averageBlockTime
}
