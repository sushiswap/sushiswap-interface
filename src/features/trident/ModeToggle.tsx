import { FC, useCallback } from 'react'
import ToggleButtonGroup from '../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LiquidityMode } from './types'
import { useRecoilState } from 'recoil'
import { liquidityModeAtom } from './context/atoms'

interface ModeToggleProps {
  onChange?: () => void
}

const ModeToggle: FC<ModeToggleProps> = ({ onChange }) => {
  const { i18n } = useLingui()
  const [liquidityMode, setLiquidityMode] = useRecoilState(liquidityModeAtom)

  const handleChange = useCallback(
    (val: LiquidityMode) => {
      onChange && onChange()
      setLiquidityMode(val)
    },
    [onChange, setLiquidityMode]
  )

  return (
    <div className="-mt-10 relative z-10">
      <ToggleButtonGroup value={liquidityMode} onChange={handleChange} className="bg-dark-900 shadow">
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
