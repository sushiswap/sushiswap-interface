import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import { useContract, useBentoBoxContract } from './useContract'
import { useBoringHelperContract } from 'hooks/useContract'
import ERC20_ABI from '../constants/abis/erc20.json'
import { isAddress } from '../utils'
import { BigNumber } from '@ethersproject/bignumber'
import useTransactionStatus from './useTransactionStatus'

const useBentoBalance = (tokenAddress: string) => {
    const { account } = useActiveWeb3React()

    const boringHelperContract = useBoringHelperContract()
    const bentoBoxContract = useBentoBoxContract()
    const tokenAddressChecksum = isAddress(tokenAddress)
    const tokenContract = useContract(tokenAddressChecksum, ERC20_ABI, true) // withSigner

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
    }, [account, tokenAddressChecksum, tokenContract])

    useEffect(() => {
        if (account && bentoBoxContract && boringHelperContract && tokenContract) {
            fetchBentoBalance()
        }
    }, [account, bentoBoxContract, currentTransactionStatus, fetchBentoBalance, tokenContract])

    return balance
}

export default useBentoBalance
