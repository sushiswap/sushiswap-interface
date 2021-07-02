import React, { FC, useCallback } from 'react'
import CurrencyLogo from '../../components/CurrencyLogo'
import Typography from '../../components/Typography'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { maxAmountSpend } from '../../functions'
import { useAppDispatch } from '../../state/hooks'
import { setZapInValue } from '../../state/inari/actions'
import { useInariState } from '../../state/inari/hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { Token } from '@sushiswap/sdk'

interface BalancePanelProps {
  label: string
  token: Token
  showMax?: boolean
  symbol?: string
}

const BalancePanel: FC<BalancePanelProps> = ({ label, token, showMax = false, symbol }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { zapInValue } = useInariState()
  const dispatch = useAppDispatch()
  const balance = useTokenBalance(account, token)
  const tokens = useAllTokens()
  const maxAmountInput = maxAmountSpend(balance)

  const onMax = useCallback(() => {
    maxAmountInput && dispatch(setZapInValue(maxAmountInput?.toExact()))
  }, [dispatch, maxAmountInput])

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
        <div className="rounded-full overflow-hidden">
          <CurrencyLogo size={40} currency={tokens[token.address]} />
        </div>
        <NumericalInput value={zapInValue} onUserInput={handleInput} />
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
