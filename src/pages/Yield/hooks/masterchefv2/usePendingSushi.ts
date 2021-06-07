import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import Fraction from '../../../../entities/Fraction'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useBlockNumber } from 'state/application/hooks'
import { useMasterChefV2Contract } from 'hooks/useContract'

const usePending = (pid: number) => {
    const [balance, setBalance] = useState<string>('0')
    const { account } = useActiveWeb3React()
    const masterChefV2Contract = useMasterChefV2Contract()
    const currentBlockNumber = useBlockNumber()

    const fetchPending = useCallback(async () => {
        const pending = await masterChefV2Contract?.pendingSushi(pid, account)
        const formatted = Fraction.from(BigNumber.from(pending), BigNumber.from(10).pow(18)).toString(18)
        setBalance(formatted)
    }, [account, masterChefV2Contract, pid])

    useEffect(() => {
        if (account && masterChefV2Contract && String(pid)) {
            // pid = 0 is evaluated as false
            fetchPending()
        }
    }, [account, currentBlockNumber, fetchPending, masterChefV2Contract, pid])

    return balance
}

export default usePending
