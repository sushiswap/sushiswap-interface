import { ChainId } from '@sushiswap/core-sdk'
import BarGraph from 'app/components/BarGraph'
import Button from 'app/components/Button'
import LineGraph from 'app/components/LineGraph'
import Tabs from 'app/components/Tabs'
import Typography from 'app/components/Typography'
import { formatDate, formatNumber } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useTridentTokenDayBuckets, useTridentTokenHourBuckets } from 'app/services/graph'
import { FC, useEffect, useMemo, useState } from 'react'

interface TokenStatsChartProps {
  chainId: ChainId
  token?: any
}

enum ChartType {
  Volume = 'Volume',
  TVL = 'TVL',
  Price = 'Price',
}

enum ChartRange {
  '24H' = '24H',
  '1W' = '1W',
  '1M' = '1M',
  '1Y' = '1Y',
  'ALL' = 'ALL',
}

const chartTimespans: Record<ChartRange, number> = {
  [ChartRange['24H']]: 86400,
  [ChartRange['1W']]: 604800,
  [ChartRange['1M']]: 2629746,
  [ChartRange['1Y']]: 31556952,
  [ChartRange['ALL']]: Infinity,
}

const TokenStatsChart: FC<TokenStatsChartProps> = ({ token, chainId }) => {
  const isDesktop = useDesktopMediaQuery()
  const [chartType, setChartType] = useState<ChartType>(ChartType.Volume)
  const [chartRange, setChartRange] = useState<ChartRange>(ChartRange['1W'])

  const hourBuckets = useTridentTokenHourBuckets({
    chainId,
    variables: {
      first: 168,
      where: { token: token.id.toLowerCase() },
    },
    shouldFetch: !!token && chartTimespans[chartRange] < chartTimespans['1W'],
  })

  const dayBuckets = useTridentTokenDayBuckets({
    chainId,
    variables: {
      where: { token: token.id.toLowerCase() },
    },
    shouldFetch: !!token && chartTimespans[chartRange] >= chartTimespans['1W'],
  })

  const data = chartTimespans[chartRange] < chartTimespans['1W'] ? hourBuckets : dayBuckets

  const graphData = useMemo(() => {
    const currentDate = Math.round(Date.now() / 1000)
    return (
      data
        ?.reduce((acc, cur) => {
          const x = cur.date.getTime()
          if (Math.round(x / 1000) >= currentDate - chartTimespans[chartRange]) {
            acc.push({
              // @ts-ignore TYPE NEEDS FIXING
              x,
              // @ts-ignore TYPE NEEDS FIXING
              y: Number(
                chartType === ChartType.Volume
                  ? cur.volumeUSD
                  : chartType === ChartType.Price
                  ? cur.priceUSD
                  : cur.liquidityUSD
              ),
            })
          }

          return acc
        }, [])
        // @ts-ignore TYPE NEEDS FIXING
        .sort((a, b) => a.x - b.x)
    )
  }, [data, chartRange, chartType])

  useEffect(() => setSelectedIndex(graphData?.length - 1), [graphData])

  const [selectedIndex, setSelectedIndex] = useState(graphData?.length - 1)

  const chartButtons = (
    <div className="flex justify-between lg:justify-end lg:gap-1">
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {Object.keys(chartTimespans).map((text: ChartRange) => (
        <Button
          key={text}
          onClick={() => setChartRange(text)}
          variant={text === chartRange ? 'outlined' : 'empty'}
          size="xs"
          color={text === chartRange ? 'blue' : 'gray'}
          className="min-w-[40px]"
        >
          {text}
        </Button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col h-[280px]">
      <div className="flex flex-col lg:order-0 lg:justify-between lg:items-end lg:flex-row">
        <Tabs tabs={[ChartType.Volume, ChartType.TVL, ChartType.Price]} currentTab={chartType} setTab={setChartType} />
        <div className="hidden mb-2 lg:block">{chartButtons}</div>
      </div>
      <div className="w-full h-px bg-gray-700" />
      {graphData && graphData.length > 0 && (
        <div className="w-full">
          <div className="mt-6">
            <Typography variant="h3" className="text-high-emphesis" weight={700}>
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {formatNumber(graphData[selectedIndex]?.y, true, false, 2)}
            </Typography>
            <Typography variant="sm" className="text-gray-500 text-high-emphesis" weight={700}>
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {formatDate(new Date(graphData[selectedIndex]?.x))}
            </Typography>
          </div>
          <div className="h-40">
            {isDesktop ? (
              <LineGraph
                data={graphData}
                setSelectedIndex={setSelectedIndex}
                stroke={{ gradient: { from: '#27B0E6', to: '#FA52A0' } }}
              />
            ) : (
              <BarGraph data={graphData} setSelectedIndex={setSelectedIndex} />
            )}
          </div>
        </div>
      )}
      <div className="lg:hidden">{chartButtons}</div>
    </div>
  )
}

export default TokenStatsChart
