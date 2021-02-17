import { useMemo } from 'react'
import { useSingleContractMultipleData, useSingleCallResult } from '../state/multicall/hooks'
import { useMasterChefContract } from './useContract'
import { useActiveWeb3React } from '../hooks'
import { BigNumber } from 'ethers'

export function useAllPendingSushi() {
  const { account } = useActiveWeb3React()
  const masterChef = useMasterChefContract()
  const numberOfPools = useSingleCallResult(masterChef, 'poolLength')

  const args = useMemo(
    () =>
      [...Array(!numberOfPools.loading ? numberOfPools?.result?.[0].toNumber() : 0).keys()].map(pid => [
        String(pid),
        String(account)
      ]),
    [numberOfPools, account]
  )

  const data = useSingleContractMultipleData(masterChef, 'pendingSushi', args)

  return useMemo(
    () =>
      data?.reduce<number>((memo, { result }) => {
        if (result?.[0] && result[0].gt(BigNumber.from(0))) {
          memo += result[0].toNumber()
        }
        return memo
      }, 0) ?? 0,
    [data]
  )
}
