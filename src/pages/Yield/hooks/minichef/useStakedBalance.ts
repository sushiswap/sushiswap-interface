import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useMiniChefV2Contract } from 'hooks/useContract'
import { useCallback, useEffect, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

const useStakedBalance = (pid: number, decimals = 18) => {
    // SLP is usually 18, KMP is 6
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 })

    const { account } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()
    const miniChefV2Contract = useMiniChefV2Contract()

    const fetchBalance = useCallback(async () => {
        const getStaked = async (pid: number, owner: string | null | undefined): Promise<BalanceProps> => {
            try {
                const { amount } = await miniChefV2Contract?.userInfo(pid, owner)
                return { value: BigNumber.from(amount), decimals: decimals }
            } catch (e) {
                return { value: BigNumber.from(0), decimals: decimals }
            }
        }
        const balance = await getStaked(pid, account)
        setBalance(balance)
    }, [account, decimals, miniChefV2Contract, pid])

    useEffect(() => {
        if (account && miniChefV2Contract) {
            fetchBalance()
        }
    }, [account, setBalance, currentBlockNumber, fetchBalance, miniChefV2Contract])

    return balance
}

export default useStakedBalance
