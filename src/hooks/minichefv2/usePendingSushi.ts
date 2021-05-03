import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks'
import { useMiniChefV2Contract } from 'hooks/useContract'
import { useCallback, useEffect, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import Fraction from '../../entities/Fraction'

const usePending = (pid: number) => {
    const [balance, setBalance] = useState<string>('0')
    const { account } = useActiveWeb3React()

    const miniChefV2Contract = useMiniChefV2Contract()
    const currentBlockNumber = useBlockNumber()

    const fetchPending = useCallback(async () => {
        const pending = await miniChefV2Contract?.pendingSushi(pid, account)
        const formatted = Fraction.from(BigNumber.from(pending), BigNumber.from(10).pow(18)).toString(18)
        setBalance(formatted)
    }, [account, miniChefV2Contract, pid])

    useEffect(() => {
        if (account && miniChefV2Contract && String(pid)) {
            // pid = 0 is evaluated as false
            fetchPending()
        }
    }, [account, currentBlockNumber, fetchPending, miniChefV2Contract, pid])

    return balance
}

export default usePending
