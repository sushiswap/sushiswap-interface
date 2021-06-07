import { useCallback, useEffect, useState } from 'react'

import ALCX_REWARDER_ABI from '../../constants/abis/alcx-rewarder.json'
import { BigNumber } from '@ethersproject/bignumber'
import { ChefId } from './enum'
import Fraction from '../../entities/Fraction'
import { getContract } from '../../functions'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useBlockNumber } from '../../state/application/hooks'
import { useMasterChefV2Contract } from '../../hooks/useContract'

const usePending = (pid: number, chefId) => {
    const [balance, setBalance] = useState<string>('0')
    const { account, library } = useActiveWeb3React()

    const masterChefV2Contract = useMasterChefV2Contract()
    const currentBlockNumber = useBlockNumber()

    const fetchPending = useCallback(async () => {
        const rewarderAddress = await masterChefV2Contract?.rewarder('0')
        const rewarderContract = await getContract(
            rewarderAddress ? rewarderAddress : undefined,
            ALCX_REWARDER_ABI,
            library!,
            undefined
        )
        const pending = await rewarderContract?.pendingTokens(pid, account, '0')
        // todo: do not assume [0] or that rewardToken has 18 decimals
        const formatted = Fraction.from(
            BigNumber.from(pending?.rewardAmounts[0]),
            BigNumber.from(10).pow(18)
        ).toString(18)
        //console.log('pending:', pending)
        setBalance(formatted)
    }, [masterChefV2Contract, library, pid, account])

    useEffect(() => {
        if (
            account &&
            masterChefV2Contract &&
            String(pid) &&
            library &&
            chefId === ChefId.MASTERCHEF_V2
        ) {
            // pid = 0 is evaluated as false
            fetchPending()
        }
    }, [
        account,
        currentBlockNumber,
        fetchPending,
        masterChefV2Contract,
        pid,
        library,
    ])

    return balance
}

export default usePending
