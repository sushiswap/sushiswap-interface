import { useState } from 'react'
import ToggleButtonGroup from '../../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BarGraph } from '../../../components/BarGraph'
import Button from '../../../components/Button'
import { tvlData, volumeData } from './mockData'
import Typography from '../../../components/Typography'

const PoolStatsChart = () => {
  const { i18n } = useLingui()
  const [chartType, setChartType] = useState('Volume')
  const [chartRange, setChartRange] = useState('ALL')
  const graphData = chartType === 'Volume' ? volumeData : tvlData
  const [selectedDatum, setSelectedDatum] = useState(graphData[graphData.length - 1])

  return (
    <>
      <div className="mx-5 mt-5">
        <ToggleButtonGroup value={chartType} onChange={setChartType}>
          <ToggleButtonGroup.Button value="Volume">{i18n._(t`Volume`)}</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value="TVL">{i18n._(t`TVL`)}</ToggleButtonGroup.Button>
        </ToggleButtonGroup>
      </div>
      <div className="w-full h-40 px-5 mt-5 mb-5">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          ${selectedDatum.price}
        </Typography>
        <Typography variant="sm" className="text-gray-500 text-high-emphesis" weight={700}>
          {selectedDatum.time}
        </Typography>
        {/* @ts-ignore */}
        <BarGraph data={graphData} setSelectedDatum={setSelectedDatum} />
      </div>
      <div className="flex justify-between mx-5 mt-5">
        {['24H', '1W', '1M', '1Y', 'ALL'].map((e) => (
          <Button
            key={e}
            onClick={() => setChartRange(e)}
            variant={e === chartRange ? 'outlined' : 'empty'}
            size="xs"
            color={e === chartRange ? 'blue' : 'gray'}
            className={e === chartRange ? 'w-10 py-1 text-sm bg-blue-400' : 'w-10 py-1 text-sm'}
          >
            {e}
          </Button>
        ))}
      </div>
    </>
  )
}

export default PoolStatsChart
