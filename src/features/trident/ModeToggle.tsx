import { FC } from 'react'
import ToggleButtonGroup from '../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LiquidityMode } from './types'

interface ModeToggleProps {
  value: LiquidityMode
  onChange: (x: LiquidityMode) => void
}

const ModeToggle: FC<ModeToggleProps> = ({ value, onChange }) => {
  const { i18n } = useLingui()

  return (
    <div className="px-5 -mt-6 relative z-10">
      <ToggleButtonGroup value={value} onChange={onChange} className="bg-dark-900 shadow">
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
