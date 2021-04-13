import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useMasterChefContract, usePendingContract } from '.'
import { useBlockNumber } from '../state/application/hooks'

const useAllPending = () => {
    const [balance, setBalance] = useState<number | undefined>()
    const { account } = useActiveWeb3React()

    const masterChefContract = useMasterChefContract()
    const pendingContract = usePendingContract()
    const currentBlockNumber = useBlockNumber()

    const fetchAllPending = useCallback(async () => {
        const numberOfPools = await masterChefContract?.poolLength()
        const pids = [...Array(parseInt(numberOfPools)).keys()]
        const results = await pendingContract?.functions.getPendingSushi(account, pids)
        const allPending = results[1]
            .map((p: any) => p.pendingSushi)
            .reduce((a: any, b: any) => BigNumber.from(a).add(BigNumber.from(b)), BigNumber.from(0))

        setBalance(
            BigNumber.from(allPending)
                .div(BigNumber.from(10).pow(18))
                .toNumber()
        )
    }, [account, masterChefContract, pendingContract])

    useEffect(() => {
        if (account && masterChefContract && pendingContract) {
            fetchAllPending()
        }
    }, [account, currentBlockNumber, fetchAllPending, masterChefContract, pendingContract])

    return balance
}

export default useAllPending
