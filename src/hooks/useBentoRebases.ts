import { Currency, JSBI, Rebase } from '@sushiswap/core-sdk'
import { useMemo } from 'react'

import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { useBentoBoxContract } from './useContract'

const useBentoRebases = (tokens: (Currency | undefined)[]) => {
  const addresses = useMemo(() => tokens.map((token) => [token?.wrapped.address]), [tokens])
  const bentoboxContract = useBentoBoxContract()
  const results = useSingleContractMultipleData(bentoboxContract, 'totals', addresses)

  const loading: boolean = useMemo(() => results.some((callState) => callState.loading), [results])
  return useMemo(
    () => ({
      rebases: tokens.reduce<Record<string, Rebase>>((acc, cur, index) => {
        const el = results[index]
        if (cur && el?.result) {
          acc[cur.wrapped.address] = {
            base: JSBI.BigInt(el.result.base.toString()),
            elastic: JSBI.BigInt(el.result.elastic.toString()),
          }
        }
        return acc
      }, {}),
      loading,
    }),
    [loading, results, tokens]
  )
}

export const useBentoRebase = (token: Currency | undefined) => {
  const { rebases, loading } = useBentoRebases([token])
  if (token && !loading) {
    return { rebase: rebases[token?.wrapped.address], loading }
  }

  return { rebase: undefined, loading }
}

export default useBentoRebases
