import {
    NEVER_RELOAD,
    Result,
    useSingleCallResult,
    useSingleContractMultipleData,
} from '../../state/multicall/hooks'

import { Contract } from '@ethersproject/contracts'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useMemo } from 'react'

export function useStaked(contract: Contract | null | undefined) {
    const { account } = useActiveWeb3React()
    const numberOfPools = useSingleCallResult(
        contract,
        'poolLength',
        undefined,
        NEVER_RELOAD
    )
    const args = useMemo(() => {
        if (!account || numberOfPools.loading) {
            return []
        }
        return [...Array(numberOfPools?.result?.[0].toNumber()).keys()].map(
            (pid) => [String(pid), String(account)]
        )
    }, [numberOfPools, account])

    const pendingSushi = useSingleContractMultipleData(
        contract,
        'pendingSushi',
        args
    )
    const userInfo = useSingleContractMultipleData(contract, 'userInfo', args)

    return useMemo(() => [pendingSushi, userInfo], [pendingSushi, userInfo])
}

export default useStaked
