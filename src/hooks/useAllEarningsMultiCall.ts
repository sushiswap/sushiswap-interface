import {
    NEVER_RELOAD,
    useSingleCallResult,
    useSingleContractMultipleData,
} from '../state/multicall/hooks'

import { BigNumber } from 'ethers'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useMasterChefContract } from './useContract'
import { useMemo } from 'react'

export function useAllPendingSushi(): number {
    // const { account } = useActiveWeb3React()
    const account = '0xb4A3f907ec1611F22543219AE9Bb33ec5E96e116'
    const masterChef = useMasterChefContract()
    const numberOfPools = useSingleCallResult(
        masterChef,
        'poolLength',
        undefined,
        NEVER_RELOAD
    )

    const args = useMemo(
        () =>
            [
                ...Array(
                    !numberOfPools.loading
                        ? numberOfPools?.result?.[0].toNumber()
                        : 0
                ).keys(),
            ].map((pid) => [String(pid), String(account)]),
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

export default useAllPendingSushi
