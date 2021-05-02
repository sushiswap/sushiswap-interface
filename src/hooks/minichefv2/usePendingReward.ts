import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks'
import { useMiniChefV2Contract } from 'hooks/useContract'
import { useCallback, useEffect, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { getContract } from '../../utils'
import COMPLEX_REWARDER_ABI from '../../constants/abis/complex-rewarder.json'
import Fraction from '../../entities/Fraction'

const usePending = (pid: number) => {
    const [balance, setBalance] = useState<string>('0')
    const { account, library } = useActiveWeb3React()

    const miniChefV2Contract = useMiniChefV2Contract()
    const currentBlockNumber = useBlockNumber()

    const fetchPending = useCallback(async () => {
        const rewarderAddress = await miniChefV2Contract?.rewarder('0')
        const rewarderContract = await getContract(
            rewarderAddress ? rewarderAddress : undefined,
            COMPLEX_REWARDER_ABI,
            library!,
            undefined
        )
        const pending = await rewarderContract?.pendingTokens(pid, account, '0')
        // todo: do not assume [0] or that rewardToken has 18 decimals
        const formatted = Fraction.from(BigNumber.from(pending?.rewardAmounts[0]), BigNumber.from(10).pow(18)).toString(
            18
        )
        setBalance(formatted)
    }, [miniChefV2Contract, library, pid, account])

    useEffect(() => {
        if (account && miniChefV2Contract && String(pid) && library) {
            // pid = 0 is evaluated as false
            fetchPending()
        }
    }, [account, currentBlockNumber, fetchPending, miniChefV2Contract, pid, library])

    return balance
}

export default usePending
