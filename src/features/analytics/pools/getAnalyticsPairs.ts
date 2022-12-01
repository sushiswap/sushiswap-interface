import { ChainId } from '@figswap/core-sdk'
import { getApy } from 'app/functions'
import { getBlockDaysAgo, getPairs } from 'app/services/graph'

interface getAnalyticsPairsProps {
  chainId: ChainId
  first?: number
}

export default async function getAnalyticsPairs({ chainId, first }: getAnalyticsPairsProps) {
  const [block1d, block2d, block1w] = await Promise.all([
    getBlockDaysAgo(chainId, 1),
    getBlockDaysAgo(chainId, 2),
    getBlockDaysAgo(chainId, 7),
  ])

  const [pairs, pairs1d, pairs2d, pairs1w] = await Promise.all([
    getPairs(chainId, { first }),
    getPairs(chainId, { first, block: block1d }),
    getPairs(chainId, { first, block: block2d }),
    getPairs(chainId, { first, block: block1w }),
  ])

  return (
    pairs
      // @ts-ignore TYPE NEEDS FIXING
      .map((pair) => {
        // @ts-ignore TYPE NEEDS FIXING
        const pair1d = pairs1d.find((p) => pair.id === p.id) ?? pair
        // @ts-ignore TYPE NEEDS FIXING
        const pair2d = pairs2d.find((p) => pair.id === p.id) ?? pair
        // @ts-ignore TYPE NEEDS FIXING
        const pair1w = pairs1w.find((p) => pair.id === p.id) ?? pair1d

        const volume1d = pair.volumeUSD - pair1d.volumeUSD
        const volume1w = pair.volumeUSD - pair1w.volumeUSD

        const volume1dChange = pair.volumeUSD - pair1d.volumeUSD - (pair1d.volumeUSD - pair2d.volumeUSD)
        const volume1dChangePercent =
          ((pair.volumeUSD - pair1d.volumeUSD) / (pair1d.volumeUSD - pair2d.volumeUSD)) * 100 - 100 ?? 0

        const fees1d = volume1d * 0.003
        const fees1w = volume1w * 0.003

        const liquidity = pair.reserveUSD
        const liquidity1d = pair1d.reserveUSD

        const liquidity1dChange = pair.reserveUSD - pair1d.reserveUSD
        const liquidity1dChangePercent = (pair.reserveUSD / pair1d.reserveUSD) * 100 - 100 ?? 0

        const utilisation1d = ((pair.volumeUSD - pair1d.volumeUSD) / pair?.reserveUSD) * 100 ?? 0
        const utilisation2d = ((pair1d.volumeUSD - pair2d.volumeUSD) / pair1d?.reserveUSD) * 100 ?? 0
        const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100 ?? 0

        const tx1d = pair.txCount - pair1d.txCount
        const tx2d = pair1d.txCount - pair2d.txCount
        const tx1dChange = (tx1d / tx2d) * 100 - 100 ?? 0

        const apy = getApy({ volume: volume1d, liquidity, days: 1 })

        return {
          pair: {
            token0: pair.token0,
            token1: pair.token1,
            id: pair.id,
          },
          liquidity,
          liquidity1d,
          liquidity1dChange,
          liquidity1dChangePercent,
          volume1d,
          volume1dChange,
          volume1dChangePercent,
          volume1w,
          fees1d,
          fees1w,
          utilisation1d,
          utilisation2d,
          utilisation1dChange,
          tx1d,
          tx2d,
          tx1dChange,
          apy,
        }
      })
      // @ts-ignore TYPE NEEDS FIXING
      .sort((a, b) => b.liquidityChangeNumber1d - a.liquidityChangeNumber1d)
  )
}
