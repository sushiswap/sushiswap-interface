import { useMemo } from 'react'

import { useTokenContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useTokenAllowance(tokenAddress?: string, owner?: string, spender?: string): any | undefined {
    const contract = useTokenContract(tokenAddress, false)

    const inputs = useMemo(() => [owner, spender], [owner, spender])
    const allowance = useSingleCallResult(contract, 'allowance', inputs).result

    // todo: refactor from toString(), since precision will be lost
    return useMemo(() => (tokenAddress && allowance ? allowance.toString() : undefined), [tokenAddress, allowance])
}
