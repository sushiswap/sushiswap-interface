import { ChainId } from '@sushiswap/core-sdk'
import { XSUSHI } from 'app/config/tokens/ethereum'
import { getBar, getBarHistory, getBlockDaysAgo, getNativePrice, getTokens } from 'app/services/graph'
import { addYears, getUnixTime } from 'date-fns'

export type AnalyticsXsushi = Awaited<ReturnType<typeof getAnalyticsXsushi>>

export default async function getAnalyticsXsushi() {
  const [block1m, block3m, block6m, block1y] = await Promise.all([
    getBlockDaysAgo(ChainId.ETHEREUM, 30),
    getBlockDaysAgo(ChainId.ETHEREUM, 90),
    getBlockDaysAgo(ChainId.ETHEREUM, 180),
    getBlockDaysAgo(ChainId.ETHEREUM, 365),
  ])

  const [ethPrice, [xSushi], bar, bar1m, bar3m, bar6m, bar1y, barHistory] = await Promise.all([
    getNativePrice(ChainId.ETHEREUM),
    getTokens(ChainId.ETHEREUM, { first: 1, where: { id: XSUSHI.address.toLowerCase() } }),
    getBar(),
    getBar({ block: block1m }),
    getBar({ block: block3m }),
    getBar({ block: block6m }),
    getBar({ block: block1y }),
    getBarHistory(),
  ])

  const apy1m = (bar.ratio / bar1m.ratio - 1) * 12 * 100

  const apy3m = (bar.ratio / bar3m.ratio - 1) * 4 * 100

  const apy6m = (bar.ratio / bar6m.ratio - 1) * 2 * 100

  const apy1y = (bar.ratio / bar1y.ratio - 1) * 100

  const [xSushiPrice, xSushiMarketcap] = [
    xSushi?.derivedETH * ethPrice,
    xSushi?.derivedETH * ethPrice * bar?.totalSupply,
  ]

  const chart = barHistory.map((barDay: any, i: number) => {
    const barDayPrevious = barHistory[i - 1] ?? undefined
    const apy =
      (((barDay.ratio / barDayPrevious?.ratio - 1) * getUnixTime(addYears(0, 1))) /
        (barDay.date - barDayPrevious?.date)) *
        100 ?? 0
    return {
      apy,
      xSushiSupply: barDay.xSushiSupply,
      date: barDay.date,
      sushiStaked: barDay.sushiStaked,
      sushiHarvested: barDay.sushiHarvested,
    }
  })

  return {
    bar,
    apy1m,
    apy3m,
    apy6m,
    apy1y,
    xSushiPrice,
    xSushiMarketcap,
    chart,
  }
}
