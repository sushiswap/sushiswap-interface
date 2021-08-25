import { FC } from 'react'
import ToggleButtonGroup from '../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LiquidityMode, PoolContextType, PoolStateType } from './types'

interface ModeToggleProps {
  state: PoolStateType
  context: PoolContextType
}

const ModeToggle: FC<ModeToggleProps> = ({ state, context }) => {
  const { i18n } = useLingui()
  const { liquidityMode } = state
  const { setLiquidityMode } = context

  return (
    <div className="px-5 -mt-6 relative z-10">
      <ToggleButtonGroup value={liquidityMode} onChange={setLiquidityMode} className="bg-dark-900 shadow">
        <ToggleButtonGroup.Button value={LiquidityMode.STANDARD} className="py-2.5">
          {i18n._(t`Standard Mode`)}
        </ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button value={LiquidityMode.ZAP} className="py-2.5">
          {i18n._(t`Zap Mode`)}
        </ToggleButtonGroup.Button>
      </ToggleButtonGroup>
    </div>
  )
}

export default ModeToggle
