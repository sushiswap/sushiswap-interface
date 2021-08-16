import React, { FC, useCallback } from 'react'
import { PoolType } from '../pool/context/types'
import { ActionType, LiquidityMode } from './context/types'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import { useLingui } from '@lingui/react'
import BalancedModeExplanationModal from './BalancedModeExplanationModal'

const BalancedModeHeader: FC = () => {
  const { i18n } = useLingui()
  const { balancedMode, liquidityMode } = useTridentAddLiquidityPageState()
  const { dispatch, pool } = useTridentAddLiquidityPageContext()

  const disableBalancedMode = useCallback(() => {
    dispatch({
      type: ActionType.SET_BALANCED_MODE,
      payload: false,
    })
  }, [dispatch])

  if (pool.type !== PoolType.CLASSIC || liquidityMode !== LiquidityMode.STANDARD || !balancedMode)
    return <div className="pt-6" />

  return (
    <div className="-top-6 pt-10 pb-5 relative z-0">
      <div className="top-0 pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-40" />
      <div className="flex justify-between px-5">
        <div className="flex flex-row gap-1">
          <Typography variant="sm">{i18n._(t`1:1 Ratio: `)}</Typography>
          <Typography variant="sm" weight={700} className="text-blue">
            {balancedMode ? i18n._(t`On`) : i18n._(t`Off`)}
          </Typography>
          <BalancedModeExplanationModal />
        </div>

        <Typography variant="sm" className="text-blue cursor-pointer" onClick={disableBalancedMode}>
          Turn off
        </Typography>
      </div>
    </div>
  )
}

export default BalancedModeHeader
