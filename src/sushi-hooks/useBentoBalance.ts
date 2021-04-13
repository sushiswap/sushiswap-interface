import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useBentoBoxContract, useBoringHelperContract, useContract } from '../hooks'
import ERC20_ABI from '../constants/abis/erc20.json'
import { isAddress } from '../utils'
import { BigNumber } from '@ethersproject/bignumber'
import useTransactionStatus from './useTransactionStatus'

function useBentoBalance(tokenAddress: string): { value: BigNumber; decimals: number } {
    const { account } = useActiveWeb3React()

    const boringHelperContract = useBoringHelperContract()
    const bentoBoxContract = useBentoBoxContract()
    const tokenAddressChecksum = isAddress(tokenAddress)
    const tokenContract = useContract(tokenAddressChecksum ? tokenAddressChecksum : undefined, ERC20_ABI)

    const currentTransactionStatus = useTransactionStatus()

    const [balance, setBalance] = useState<any>()

    const fetchBentoBalance = useCallback(async () => {
        const balances = await boringHelperContract?.getBalances(account, [tokenAddressChecksum])
        const decimals = await tokenContract?.decimals()

        const amount = BigNumber.from(balances[0].bentoShare).isZero()
            ? BigNumber.from(0)
            : BigNumber.from(balances[0].bentoBalance)
                  .mul(BigNumber.from(balances[0].bentoAmount))
                  .div(BigNumber.from(balances[0].bentoShare))

        setBalance({
            value: amount,
            decimals: decimals
        })
    }, [account, tokenAddressChecksum, tokenContract, boringHelperContract])

    useEffect(() => {
        if (account && bentoBoxContract && boringHelperContract && tokenContract) {
            fetchBentoBalance()
        }
    }, [account, bentoBoxContract, currentTransactionStatus, fetchBentoBalance, tokenContract, boringHelperContract])

    return balance
}

export default useBentoBalance
