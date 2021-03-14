import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useContract, useBentoBoxContract, useBentoHelperContract } from '../useContract'
import ERC20_ABI from '../../constants/abis/erc20.json'
import { isAddress } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import useTransactionStatus from '../useTransactionStatus'

const useBentoBalance = (tokenAddress: string) => {
  const { account } = useActiveWeb3React()

  const bentoHelperContract = useBentoHelperContract()
  const bentoBoxContract = useBentoBoxContract()
  const tokenAddressChecksum = isAddress(tokenAddress)
  const tokenContract = useContract(tokenAddressChecksum, ERC20_ABI, true) // withSigner

  const currentTransactionStatus = useTransactionStatus()

  const [balance, setBalance] = useState<any>()
  const fetchBentoBalance = useCallback(async () => {
    const balances = await bentoHelperContract?.getBalances(account, [tokenAddressChecksum])
    const decimals = await tokenContract?.decimals()

    // console.log('balances***:', {
    //   balance: BigNumber.from(balance[0].balance)
    //     .div(BigNumber.from(10).pow(18))
    //     .toString(),
    //   bentoAllowance: BigNumber.from(balance[0].bentoAllowance)
    //     .div(BigNumber.from(10).pow(18))
    //     .toString(),
    //   bentoBalance: BigNumber.from(balance[0].bentoBalance)
    //     .div(BigNumber.from(10).pow(18))
    //     .toString(),
    //   bentoAmount: BigNumber.from(balance[0].bentoAmount)
    //     .div(BigNumber.from(10).pow(18))
    //     .toString(),
    //   bentoShare: BigNumber.from(balance[0].bentoShare)
    //     .div(BigNumber.from(10).pow(18))
    //     .toString()
    // })
    const amount = BigNumber.from(balances[0].bentoShare).isZero()
      ? BigNumber.from(0)
      : BigNumber.from(balances[0].bentoBalance)
          .mul(BigNumber.from(balances[0].bentoAmount))
          .div(BigNumber.from(balances[0].bentoShare))

    setBalance({
      value: amount,
      decimals: decimals
    })
  }, [bentoHelperContract, account, tokenAddressChecksum, tokenContract])

  useEffect(() => {
    if (account && bentoBoxContract && bentoHelperContract && tokenContract) {
      fetchBentoBalance()
    }
  }, [account, bentoBoxContract, bentoHelperContract, currentTransactionStatus, fetchBentoBalance, tokenContract])

  return balance
}

export default useBentoBalance
