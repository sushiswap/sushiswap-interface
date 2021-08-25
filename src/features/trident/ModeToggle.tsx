import { FC } from 'react'
import ToggleButtonGroup from '../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LiquidityMode } from './types'
import { useTridentContext, useTridentState } from './context'
import { ClassicPoolContext, ClassicPoolState } from './add/classic/context/types'
import { HybridPoolContext, HybridPoolState } from './add/hybrid/context/types'
import { WeightedPoolContext, WeightedPoolState } from './add/weighted/context/types'

interface ModeToggleProps {}

const ModeToggle: FC<ModeToggleProps> = <
  S extends ClassicPoolState | HybridPoolState | WeightedPoolState,
  C extends ClassicPoolContext | HybridPoolContext | WeightedPoolContext
>() => {
  const { i18n } = useLingui()
  const { liquidityMode } = useTridentState<S>()
  const { setLiquidityMode } = useTridentContext<C>()

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
