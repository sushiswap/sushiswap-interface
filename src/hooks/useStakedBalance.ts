import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { PairType } from '../features/farm/enum'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useBlockNumber } from '../state/application/hooks'
import { useMasterChefContract } from '../hooks/useContract'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

const useStakedBalance = (farm) => {
    const decimals =
        farm?.pair?.type === PairType.LENDING ? farm.pair.token0.decimals : 18
    const [balance, setBalance] = useState<BalanceProps>({
        value: BigNumber.from(0),
        decimals,
    })

    const { account } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()
    const masterChefContract = useMasterChefContract()

    const fetchBalance = useCallback(async () => {}, [
        account,
        masterChefContract,
        farm,
    ])

    useEffect(() => {
        const fetchBalance = async (
            pid: number,
            account: string | null | undefined
        ) => {
            try {
                const { amount } = await masterChefContract?.userInfo(
                    pid,
                    account
                )
                setBalance({
                    value: BigNumber.from(amount),
                    decimals: decimals,
                })
            } catch (error) {
                console.error(error)
                setBalance({ value: BigNumber.from(0), decimals: decimals })
            }
        }

        if (farm && account && masterChefContract) {
            fetchBalance(farm.id, account)
        }
    }, [
        account,
        setBalance,
        currentBlockNumber,
        fetchBalance,
        masterChefContract,
    ])

    return balance
}

export default useStakedBalance
