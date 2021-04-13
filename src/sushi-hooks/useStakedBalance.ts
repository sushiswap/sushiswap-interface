import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks'
import { useMasterChefContract } from './useContract'
import { useBlockNumber } from 'state/application/hooks'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

const useStakedBalance = (pid: number) => {
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 })
    const { account } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()
    const masterChefContract = useMasterChefContract()

    const fetchBalance = useCallback(async () => {
        const getStaked = async (pid: number, owner: string | null | undefined): Promise<BalanceProps> => {
            try {
                const { amount } = await masterChefContract?.userInfo(pid, owner)
                return { value: BigNumber.from(amount), decimals: 18 }
            } catch (e) {
                return { value: BigNumber.from(0), decimals: 18 }
            }
        }
        const balance = await getStaked(pid, account)
        setBalance(balance)
    }, [account, masterChefContract, pid])

    useEffect(() => {
        if (account && masterChefContract) {
            fetchBalance()
        }
    }, [account, setBalance, currentBlockNumber, fetchBalance, masterChefContract])

    return balance
}

export default useStakedBalance
