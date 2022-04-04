import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useTokenBalances, useTokenBalancesWithLoadingIndicator } from 'lib/hooks/useCurrencyBalance'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'services/web3'

import { useAllTokens } from '../../hooks/Tokens'

export {
  default as useCurrencyBalance,
  useCurrencyBalances,
  useNativeCurrencyBalances,
  useTokenBalance,
  useTokenBalances,
  useTokenBalancesWithLoadingIndicator,
} from 'lib/hooks/useCurrencyBalance'

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const balances = useTokenBalances(
    account ?? undefined,
    useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  )
  return balances ?? {}
}

export function useAllTokenBalancesWithLoadingIndicator(account?: string) {
  const { account: fallback } = useActiveWeb3React()
  const allTokens = useAllTokens()
  return useTokenBalancesWithLoadingIndicator(
    (account || fallback) ?? undefined,
    useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  )
}
