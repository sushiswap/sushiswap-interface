import { t } from '@lingui/macro'
import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import { ActionType } from './context/types'
import { useLingui } from '@lingui/react'
import AssetInput from '../../../components/AssetInput'
import { useTokenBalances } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import React, { useCallback } from 'react'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'

const ClassicStandardMode = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { currencies, inputAmounts } = useTridentAddLiquidityPageState()
  const { pool, dispatch } = useTridentAddLiquidityPageContext()
  const balances = useTokenBalances(account, currencies)

  const handleInput = useCallback(
    (amount: string, position: number) => {
      dispatch({
        type: ActionType.SET_INPUT_AMOUNT,
        payload: {
          position,
          amount,
        },
      })
    },
    [dispatch]
  )

  const handleClick = useCallback(() => {
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: true,
    })
  }, [dispatch])

  const validInputs = inputAmounts.every((el) => +el > 0)

  return (
    <div className="flex flex-col mt-10 gap-3">
      <div className="flex flex-col gap-4 px-5">
        {pool.tokens.map((token, index) => (
          <AssetInput
            key={index}
            value={inputAmounts[index]}
            currency={currencies[index]}
            onChange={(val) => handleInput(val, index)}
            onMax={() => handleInput(balances[currencies[index].address]?.toExact(), index)}
            showMax={true}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 px-5">
        <Button color="gradient">
          <Typography variant="sm" weight={700} className="text-high-emphesis">
            {i18n._(t`Max Deposit`)}
          </Typography>
        </Button>
        <Button color="gradient" disabled={!validInputs}>
          <Typography variant="sm" weight={700} className={validInputs ? 'text-high-emphesis' : 'text-low-emphasis'}>
            {i18n._(t`Enter Amounts`)}
          </Typography>
        </Button>
      </div>
    </div>
  )
}

export default ClassicStandardMode
