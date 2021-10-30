import { Currency, JSBI, Rebase } from '@sushiswap/core-sdk'
import { useMemo } from 'react'

import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { useBentoBoxContract } from './useContract'

const useBentoRebases = (tokens: (Currency | undefined)[]): [Record<string, Rebase>, boolean] => {
  const bentoboxContract = useBentoBoxContract()
  const results = useSingleContractMultipleData(
    bentoboxContract,
    'totals',
    tokens.map((token) => [token?.wrapped.address])
  )

  const anyLoading: boolean = useMemo(() => results.some((callState) => callState.loading), [results])
  return [
    useMemo(
      () =>
        tokens.reduce<Record<string, Rebase>>((acc, cur, index) => {
          const el = results[index]
          if (cur && el?.result) {
            acc[cur.wrapped.address] = {
              base: JSBI.BigInt(el.result.base.toString()),
              elastic: JSBI.BigInt(el.result.elastic.toString()),
            }
          }
          return acc
        }, {}),
      [results, tokens]
    ),
    anyLoading,
  ]
}

export default useBentoRebases
