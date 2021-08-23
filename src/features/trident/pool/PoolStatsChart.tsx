import { useState } from 'react'
import ToggleButtonGroup from '../../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const PoolStatsChart = () => {
  const { i18n } = useLingui()
  const [chartType, setChartType] = useState('Volume')

  return (
    <div className="mx-5 mt-5">
      <ToggleButtonGroup value={chartType} onChange={setChartType}>
        <ToggleButtonGroup.Button value="Volume">{i18n._(t`Volume`)}</ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button value="TVL">{i18n._(t`TVL`)}</ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button value="Liquidity Distribution">
          {i18n._(t`Liquidity Distribution`)}
        </ToggleButtonGroup.Button>
      </ToggleButtonGroup>
    </div>
  )
}

export default PoolStatsChart
