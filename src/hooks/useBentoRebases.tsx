import { useBentoBoxContract } from './useContract'
import { Currency, JSBI, Rebase } from '@sushiswap/core-sdk'
import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { useMemo } from 'react'

const useBentoRebases = (tokens: Currency[]): [Rebase[], boolean] => {
  const bentoboxContract = useBentoBoxContract()
  const results = useSingleContractMultipleData(
    bentoboxContract,
    'totals',
    tokens.map((token) => [token.wrapped.address])
  )

  const anyLoading: boolean = useMemo(() => results.some((callState) => callState.loading), [results])

  return [
    useMemo(
      () =>
        results.map<Rebase>((el) => {
          if (el.result) {
            return {
              base: JSBI.BigInt(el.result.base.toString()),
              elastic: JSBI.BigInt(el.result.elastic.toString()),
            }
          }
          return null
        }),
      [results]
    ),
    anyLoading,
  ]
}

export default useBentoRebases
