import { Currency } from '@sushiswap/core-sdk'
import { selectBalancesCurrency } from 'app/features/trident/balances/balancesSlice'
import { useCurrency } from 'app/hooks/Tokens'
import { useSelector } from 'react-redux'

type UseBalancesSelectedCurrency = () => Currency | undefined
export const useBalancesSelectedCurrency: UseBalancesSelectedCurrency = () => {
  const currency = useSelector(selectBalancesCurrency)
  return useCurrency(currency) ?? undefined
}
