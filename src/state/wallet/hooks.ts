import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useTokenBalances, useTokenBalancesSequentialWithLoadingIndicator } from 'lib/hooks/useCurrencyBalance'
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
  const tokens = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, tokens)
  return balances ?? {}
}

export function useAllTokenBalancesWithLoadingIndicator(account: string) {
  const allTokens = useAllTokens()
  const tokens = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  // Note (amiller68) - #Multicall changing this unitl we implement multicalls on Wallaby
  // return useTokenBalancesWithLoadingIndicator(account, tokens)
  return useTokenBalancesSequentialWithLoadingIndicator(account, tokens)
}
