import { Currency } from '@sushiswap/core-sdk'
import { selectBalancesCurrency } from 'app/features/account/portfolioSlice'
import { useCurrency } from 'app/hooks/Tokens'
import { useSelector } from 'react-redux'

type UseBalancesSelectedCurrency = () => Currency | undefined
export const useBalancesSelectedCurrency: UseBalancesSelectedCurrency = () => {
  const currency = useSelector(selectBalancesCurrency)
  return useCurrency(currency) ?? undefined
}
