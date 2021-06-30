import React, { FC, useCallback } from 'react'
import CurrencyLogo from '../../components/CurrencyLogo'
import { SUSHI_ADDRESS } from '@sushiswap/sdk'
import Typography from '../../components/Typography'
import CurrencyInput from '../limit-order/CurrencyInput'
import CurrencyInputPanel from '../limit-order/CurrencyInputPanel'
import { useTokenBalance } from '../../state/wallet/hooks'
import { SUSHI } from '../../constants'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { maxAmountSpend } from '../../functions'

interface InputBalancePanelProps {
  value: string
  onUserInput: (x: string) => void
}

const InputBalancePanel: FC<InputBalancePanelProps> = ({ value, onUserInput }) => {
  const { account, chainId } = useActiveWeb3React()
  const balance = useTokenBalance(account, SUSHI[chainId])
  const balanceUSDCValue = useUSDCValue(balance)
  const tokens = useAllTokens()

  const maxAmountInput = maxAmountSpend(balance)

  const onMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  return (
    <CurrencyInputPanel
      id="token-input"
      className="rounded-t"
      selectComponent={
        <div>
          <div className="flex gap-4 items-center">
            <div className="rounded-full overflow-hidden">
              <CurrencyLogo size={54} currency={tokens[SUSHI_ADDRESS[chainId]]} />
            </div>
            <Typography variant="h3" className="text-high-emphesis" weight={700}>
              SUSHI
            </Typography>
          </div>
        </div>
      }
      bottomAdornment={
        <div className="bg-dark-700 rounded-b py-1 px-5 flex justify-end">
          <div className="flex gap-2 cursor-pointer" onClick={onMax}>
            <Typography variant="xs">Balance: {balance?.toSignificant(6)} SUSHI</Typography>
            <Typography variant="xs" className="text-secondary">
              ≈
            </Typography>
            <Typography variant="xs" className="text-secondary">
              {balanceUSDCValue?.toSignificant(6)} USDC
            </Typography>
          </div>
        </div>
      }
      inputComponent={
        <CurrencyInput
          id="currency-input"
          showMaxButton={value !== maxAmountInput?.toExact()}
          onMax={onMax}
          onUserInput={onUserInput}
          value={value}
        />
      }
    />
  )
}

export default InputBalancePanel
