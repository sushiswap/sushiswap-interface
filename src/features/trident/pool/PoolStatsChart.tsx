import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { usePoolBuckets } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import { BarGraph } from 'components/BarGraph'
import Button from 'components/Button'
import LineGraph from 'components/LineGraph'
import ToggleButtonGroup from 'components/ToggleButton'
import Typography from 'components/Typography'
import { formatDate } from 'functions'
import useDesktopMediaQuery from 'hooks/useDesktopMediaQuery'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { poolAtom } from '../context/atoms'

enum ChartType {
  Volume = 'Volume',
  TVL = 'TVL',
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

const PoolStatsChart = () => {
  const isDesktop = useDesktopMediaQuery()
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [chartType, setChartType] = useState<ChartType>(ChartType.Volume)
  const [chartRange, setChartRange] = useState<ChartRange>(ChartRange.ALL)
  const { pool } = useRecoilValue(poolAtom)
  const data = usePoolBuckets({
    chainId,
    fine: chartTimespans[chartRange] <= chartTimespans['1W'],
    variables: {
      first: chartTimespans[chartRange] <= chartTimespans['1W'] ? 168 : undefined,
      where: { pool: pool?.liquidityToken?.address?.toLowerCase() },
    },
    shouldFetch: !!pool,
  })
  const graphData = useMemo(() => {
    const currentDate = Math.round(Date.now() / 1000)
    return data
      ?.reduce((acc, cur) => {
        const x = cur.date.getTime()
        if (Math.round(x / 1000) >= currentDate - chartTimespans[chartRange]) {
          acc.push({
            x,
            y: Number(chartType === ChartType.Volume ? cur.volumeUSD : cur.totalValueLockedUSD),
          })
        }

        return acc
      }, [])
      .sort((a, b) => a.x - b.x)
  }, [data, chartRange, chartType])
  const [selectedIndex, setSelectedIndex] = useState(graphData?.length - 1)

  const chartButtons = (
    <div className="flex justify-between lg:justify-end lg:gap-1">
      {Object.keys(chartTimespans).map((text: ChartRange) => (
        <Button
          key={text}
          onClick={() => setChartRange(text)}
          variant={text === chartRange ? 'outlined' : 'empty'}
          size="xs"
          color={text === chartRange ? 'blue' : 'gray'}
          className={
            text === chartRange
              ? 'w-10 py-1 text-sm bg-blue-400 border-blue border rounded-full'
              : 'w-10 py-1 text-sm text-secondary'
          }
        >
          {text}
        </Button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-5 h-[280px]">
      <div className="flex flex-col lg:order-0 lg:justify-between lg:items-center lg:flex-row">
        <ToggleButtonGroup value={chartType} onChange={setChartType}>
          <ToggleButtonGroup.Button value={ChartType.Volume} className="h-12 w-full lg:h-10 lg:w-[106px]">
            {i18n._(t`Volume`)}
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={ChartType.TVL} className="h-12 w-full lg:h-10 lg:w-[106px]">
            {i18n._(t`TVL`)}
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup>
        <div className="hidden lg:block">{chartButtons}</div>
      </div>
      {graphData && graphData.length > 0 && (
        <div className="w-full h-40 lg:order-2">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            ${graphData[selectedIndex]?.y}
          </Typography>
          <Typography variant="sm" className="text-gray-500 text-high-emphesis" weight={700}>
            {formatDate(new Date(graphData[selectedIndex]?.x))}
          </Typography>
          {isDesktop ? (
            <LineGraph
              data={graphData}
              setSelectedIndex={setSelectedIndex}
              stroke={{ gradient: { from: '#27B0E6', to: '#FA52A0' } }}
            />
          ) : (
            <BarGraph data={graphData} setSelectedDatum={setSelectedIndex} />
          )}
        </div>
      )}
      <div className="lg:hidden">{chartButtons}</div>
    </div>
  )
}

export default PoolStatsChart
