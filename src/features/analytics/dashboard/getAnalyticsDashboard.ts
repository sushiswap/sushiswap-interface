import { ChainId } from '@figswap/core-sdk'
import { getBlockDaysAgo, getDayData, getFactory } from 'app/services/graph'

export type AnalyticsDashboard = Awaited<ReturnType<typeof getAnalyticsDashboard>>

interface getAnalyticsDashboardProps {
  chainId: ChainId
}

export default async function getAnalyticsDashboard({ chainId }: getAnalyticsDashboardProps) {
  const [block1d, block2d] = await Promise.all([getBlockDaysAgo(chainId, 1), getBlockDaysAgo(chainId, 2)])

  const [exchange, exchange1d, exchange2d, dayData] = await Promise.all([
    getFactory(chainId),
    getFactory(chainId, { block: block1d }),
    getFactory(chainId, { block: block2d }),
    getDayData(chainId),
  ])

  const liquidity = exchange.liquidityUSD
  const liquidity1dChange = (exchange.liquidityUSD / exchange1d.liquidityUSD) * 100 - 100
  const liquidityChart = dayData
    .sort((a: any, b: any) => a.date - b.date)
    .map((day: any) => ({ x: Number(day.date), y: Number(day.liquidityUSD) }))

  const volume1d = exchange.volumeUSD - exchange1d.volumeUSD
  const volume2d = exchange1d.volumeUSD - exchange2d.volumeUSD
  const volume1dChange = (volume1d / volume2d) * 100 - 100
  const volumeChart = dayData
    .sort((a: any, b: any) => a.date - b.date)
    .map((day: any) => ({ x: Number(day.date), y: Number(day.volumeUSD) }))

  return {
    liquidity: {
      value: liquidity,
      change: liquidity1dChange,
      chart: liquidityChart,
    },
    volume: {
      value: volume1d,
      change: volume1dChange,
      chart: volumeChart,
    },
  }
}
