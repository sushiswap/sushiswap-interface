import React, { FC, useCallback } from 'react'
import Typography from '../../components/Typography'
import { useAppDispatch } from '../../state/hooks'
import { setValues } from '../../state/inari/actions'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useDerivedInariState, useInariState, useSelectedInariStrategy } from '../../state/inari/hooks'
import { Field } from '../../state/inari/types'

interface BalancePanelProps {
  label: string
  token: Token
  value: string
  symbol: string
  balance: CurrencyAmount<Token> | null
  field: Field
  showMax?: boolean
}

const BalancePanel: FC<BalancePanelProps> = ({ label, value, token, showMax = false, symbol, balance, field }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { zapIn } = useInariState()
  const { tokens } = useDerivedInariState()
  const { calculateOutputFromInput } = useSelectedInariStrategy()

  const dispatchValue = useCallback(
    async (val: string) => {
      dispatch(
        setValues({
          inputValue:
            field === Field.INPUT
              ? val
              : await calculateOutputFromInput(!zapIn, val, tokens.outputToken, tokens.inputToken),
          outputValue:
            field === Field.INPUT
              ? await calculateOutputFromInput(zapIn, val, tokens.inputToken, tokens.outputToken)
              : val,
        })
      )
    },
    [calculateOutputFromInput, dispatch, field, tokens.inputToken, tokens.outputToken, zapIn]
  )

  const onMax = useCallback(async () => {
    const val = balance ? balance?.toExact() : '0'
    await dispatchValue(val)
  }, [balance, dispatchValue])

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="inline">
        <Typography component="span">{label}</Typography>{' '}
        <Typography component="span" weight={700}>
          {symbol}
        </Typography>
      </div>
      <div className="flex flex-row bg-dark-800 p-4 rounded gap-4 items-center">
        <div className="rounded-full">
          <CurrencyLogo currency={token} size={40} />
        </div>
        <NumericalInput value={value} onUserInput={dispatchValue} />
        {showMax && (
          <span
            onClick={onMax}
            className="cursor-pointer flex items-center rounded-full h-[30px] bg-blue bg-opacity-30 hover:border-opacity-100 border border-blue border-opacity-50 text-xs font-medium text-blue px-3"
          >
            {i18n._(t`Max`)}
          </span>
        )}
      </div>
      <div className="flex flex-row">
        <div className="flex gap-2 cursor-pointer" onClick={onMax}>
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Balance:`)}
          </Typography>
          <Typography variant="sm">
            {balance?.toSignificant(6) || '0'} {symbol}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default BalancePanel
