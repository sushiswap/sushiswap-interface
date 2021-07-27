import React, { FC, ReactNode, useCallback } from 'react'
import Typography from '../../components/Typography'
import { useAppDispatch } from '../../state/hooks'
import { setZapInValue } from '../../state/inari/actions'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { useInariState } from '../../state/inari/hooks'

interface BalancePanelProps {
  label: string
  token: Token
  logo: ReactNode
  value: string
  balance: CurrencyAmount<Token> | null
  showMax?: boolean
  symbol?: string
}

const BalancePanel: FC<BalancePanelProps> = ({ label, logo, value, token, showMax = false, symbol, balance }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()

  const onMax = useCallback(() => {
    dispatch(setZapInValue(balance ? balance?.toExact() : '0'))
  }, [balance, dispatch])

  const handleInput = useCallback(
    (val) => {
      dispatch(setZapInValue(val))
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="inline">
        <Typography component="span">{label}</Typography>{' '}
        <Typography component="span" weight={700}>
          {symbol || token.symbol}
        </Typography>
      </div>
      <div className="flex flex-row bg-dark-800 p-4 rounded gap-4 items-center">
        <div className="rounded-full">{logo}</div>
        <NumericalInput value={value} onUserInput={handleInput} />
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
            {balance?.toSignificant(6) || '0'} {token.symbol}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default BalancePanel
