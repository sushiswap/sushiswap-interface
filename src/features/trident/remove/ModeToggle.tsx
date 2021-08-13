import { FC, useCallback } from 'react'
import ToggleButtonGroup from '../../../components/ToggleButton'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ActionType, LiquidityMode } from './context/types'
import { useTridentRemoveLiquidityPageDispatch, useTridentRemoveLiquidityPageState } from './context'

const ModeToggle: FC = () => {
  const { i18n } = useLingui()
  const { liquidityMode } = useTridentRemoveLiquidityPageState()
  const dispatch = useTridentRemoveLiquidityPageDispatch()

  const handleMode = useCallback(
    (mode) => {
      dispatch({
        type: ActionType.SET_LIQUIDITY_MODE,
        payload: mode,
      })
    },
    [dispatch]
  )

  return (
    <div className="px-5 -mt-6">
      <ToggleButtonGroup value={liquidityMode} onChange={handleMode} className="bg-dark-900 shadow z-10">
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
