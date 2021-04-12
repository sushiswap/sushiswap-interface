import { useMemo } from 'react'
import { useSingleContractMultipleData, useSingleCallResult, NEVER_RELOAD } from '../../state/multicall/hooks'
import { useMasterChefContract } from '../useContract'
import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from 'ethers'

export function useAllPendingSushi() {
    const { account } = useActiveWeb3React()
    const masterChef = useMasterChefContract()
    const numberOfPools = useSingleCallResult(masterChef, 'poolLength', undefined, NEVER_RELOAD)

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
                    memo += result[0].div(BigNumber.from(10).pow(18)).toNumber()
                }
                return memo
            }, 0) ?? 0,
        [data]
    )
}
