import { useBentoBalances2 } from '../state/bentobox/hooks'
import { useTokenBalances } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { Currency, CurrencyAmount, Token } from '@sushiswap/sdk'
import { useMemo } from 'react'

const useSufficientBalances = (amounts: Record<string, CurrencyAmount<Currency> | undefined>, wallet = true) => {
  const { account } = useActiveWeb3React()

  const tokens = useMemo(() => Object.values(amounts).map((el) => el?.currency.wrapped), [amounts])
  const walletBalances = useTokenBalances(account, tokens)
  const bentoBalances = useBentoBalances2(account, tokens)

  if (!walletBalances || !bentoBalances) return false

  if (wallet) {
    return (
      Object.keys(walletBalances).length === Object.keys(amounts).length &&
      !Object.entries(walletBalances).some(([k, v]) => amounts[k]?.greaterThan(v))
    )
  } else {
    return (
      Object.keys(bentoBalances).length === Object.keys(amounts).length &&
      !Object.entries(bentoBalances).some(([k, v]) => amounts[k]?.greaterThan(v))
    )
  }
}

export default useSufficientBalances
