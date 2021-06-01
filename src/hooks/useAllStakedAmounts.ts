import {
    NEVER_RELOAD,
    Result,
    useSingleCallResult,
    useSingleContractMultipleData,
} from '../state/multicall/hooks'

import { useActiveWeb3React } from './useActiveWeb3React'
import { useMemo } from 'react'

export function useStaked(contract) {
    const { account } = useActiveWeb3React()
    const numberOfPools = useSingleCallResult(
        contract,
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

    const pendingSushi = useSingleContractMultipleData(
        contract,
        'pendingSushi',
        args
    )

    const userInfo = useSingleContractMultipleData(contract, 'userInfo', args)

    return useMemo(() => [pendingSushi, userInfo], [pendingSushi, userInfo])
}

export default useStaked
