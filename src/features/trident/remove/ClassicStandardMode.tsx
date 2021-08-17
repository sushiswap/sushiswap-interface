import React, { FC, useCallback } from 'react'
import { useLingui } from '@lingui/react'
import { useTridentRemoveLiquidityPageContext, useTridentRemoveLiquidityPageState } from './context'
import { ActionType } from '../add/context/types'

const ClassicStandardMode: FC = () => {
  const { i18n } = useLingui()
  const { inputAmounts } = useTridentRemoveLiquidityPageState()
  const { pool, dispatch, handleInput } = useTridentRemoveLiquidityPageContext()

  // We can use a local select state here as zap mode is only one input,
  // the modals check for each inputAmount if there's input entered
  // (note the { clear: true } option given to the handleInput)
  // const parsedInputAmount = tryParseAmount(inputAmounts[selected?.address], selected)
  // const usdcValue = useUSDCValue(parsedInputAmount)

  const handleClick = useCallback(() => {
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: true,
    })
  }, [dispatch])

  return <span />
}

export default ClassicStandardMode
