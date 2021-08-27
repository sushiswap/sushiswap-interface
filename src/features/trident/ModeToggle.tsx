import { FC, useCallback } from 'react'
import ToggleButtonGroup from '../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LiquidityMode } from './types'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { liquidityModeAtom, mainInputAtom, secondaryInputSelector, zapInputAtom } from './add/classic/context/atoms'

const ModeToggle: FC = () => {
  const { i18n } = useLingui()
  const [liquidityMode, setLiquidityMode] = useRecoilState(liquidityModeAtom)
  const mainInputReset = useResetRecoilState(mainInputAtom)
  const secondaryInputReset = useResetRecoilState(secondaryInputSelector)
  const zapInputReset = useResetRecoilState(zapInputAtom)

  const onChange = useCallback(
    (val: LiquidityMode) => {
      mainInputReset()
      secondaryInputReset()
      zapInputReset()
      setLiquidityMode(val)
    },
    [mainInputReset, secondaryInputReset, setLiquidityMode, zapInputReset]
  )

  return (
    <div className="px-5 -mt-6 relative z-10">
      <ToggleButtonGroup value={liquidityMode} onChange={onChange} className="bg-dark-900 shadow">
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
