import { Currency, JSBI, Rebase } from '@sushiswap/core-sdk'
import { useMemo } from 'react'

import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { useBentoBoxContract } from './useContract'

type UseBentoRebases = (tokens: (Currency | undefined)[]) => {
  rebases: Record<string, Rebase | undefined>
  loading: boolean
}

const useBentoRebases: UseBentoRebases = (tokens) => {
  const addresses = useMemo(() => tokens.map((token) => [token?.wrapped.address]), [tokens])
  const bentoboxContract = useBentoBoxContract()
  const results = useSingleContractMultipleData(bentoboxContract, 'totals', addresses)
  const loading: boolean = useMemo(() => results.some((callState) => callState.loading), [results])

  return useMemo(
    () => ({
      rebases: tokens.reduce<Record<string, Rebase | undefined>>((previousValue, currentValue, index) => {
        const el = results[index]
        if (currentValue) {
          if (el?.result) {
            previousValue[currentValue.wrapped.address] = {
              base: JSBI.BigInt(el.result.base.toString()),
              elastic: JSBI.BigInt(el.result.elastic.toString()),
            }
          } else {
            previousValue[currentValue.wrapped.address] = undefined
          }
        }
        return previousValue
      }, {}),
      loading,
    }),
    [loading, results, tokens]
  )
}

export const useBentoRebase = (token: Currency | undefined) => {
  const tokens = useMemo(() => [token], [token])
  const { rebases, loading } = useBentoRebases(tokens)

  return useMemo(() => {
    if (token && !loading) {
      return { rebase: rebases[token?.wrapped.address], loading }
    }

    return { rebase: undefined, loading }
  }, [loading, rebases, token])
}

export default useBentoRebases
