import { ChainId } from '@sushiswap/core-sdk'
import { getBlockDaysAgo, getNativePrice, getPairDaySnapshots, getPairs } from 'app/services/graph'

export type AnalyticsPair = Awaited<ReturnType<typeof getAnalyticsPair>>

export default async function getAnalyticsPair(chainId: ChainId, id: string) {
  const [block1d, block2d] = await Promise.all([getBlockDaysAgo(chainId, 1), getBlockDaysAgo(chainId, 2)])

  const [[pair], [pair1d], [pair2d], pairDayData, nativePrice] = await Promise.all([
    getPairs(chainId, { where: { id: id.toLowerCase() } }),
    getPairs(chainId, { where: { id: id.toLowerCase() }, block: block1d }),
    getPairs(chainId, { where: { id: id.toLowerCase() }, block: block2d }),
    getPairDaySnapshots(chainId, { where: { pair: id.toLowerCase() } }),
    getNativePrice(chainId),
  ])

  const liquidityUSD = pair.liquidityUSD
  const liquidityUSD1dChange = (pair.liquidityUSD / pair1d.liquidityUSD) * 100 - 100

  const volumeUSD1d = pair.volumeUSD - pair1d.volumeUSD
  const volumeUSD2d = pair1d.volumeUSD - pair2d.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  const tx1d = pair.txCount - pair1d.txCount
  const tx2d = pair1d.txCount - pair2d.txCount
  const tx1dChange = (tx1d / tx2d) * 100 - 100

  const avgTrade1d = volumeUSD1d / tx1d
  const avgTrade2d = volumeUSD2d / tx2d
  const avgTrade1dChange = (avgTrade1d / avgTrade2d) * 100 - 100

  const utilisation1d = (volumeUSD1d / pair.liquidityUSD) * 100
  const utilisation2d = (volumeUSD2d / pair1d.liquidityUSD) * 100
  const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100

  const chartData = {
    liquidity: pairDayData
      .sort((a: any, b: any) => a.date - b.date)
      .map((day: any) => ({ x: Number(day.date), y: Number(day.liquidityUSD) })),
    volume: pairDayData
      .sort((a: any, b: any) => a.date - b.date)
      .map((day: any) => ({ x: Number(day.date), y: Number(day.volumeUSD) })),
  }

  return {
    token0: {
      ...pair.token0,
      price: pair.token1Price,
      reserve: pair.reserve0 / 10 ** pair.token0.decimals,
      derivedUSD: pair.token0.price.derivedNative * nativePrice,
    },
    token1: {
      ...pair.token1,
      price: pair.token0Price,
      reserve: pair.reserve1 / 10 ** pair.token1.decimals,
      derivedUSD: pair.token1.price.derivedNative * nativePrice,
    },
    liquidityUSD,
    liquidityUSD1dChange,
    volumeUSD1d,
    volumeUSD2d,
    volumeUSD1dChange,
    tx1d,
    tx2d,
    tx1dChange,
    avgTrade1d,
    avgTrade2d,
    avgTrade1dChange,
    utilisation1d,
    utilisation2d,
    utilisation1dChange,
    chartData,
  }
}
