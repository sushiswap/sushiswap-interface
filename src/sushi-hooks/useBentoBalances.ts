import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import {
  useBentoBoxContract,
  useKashiPairContract,
  useKashiPairHelperContract
} from './useContract'
import ERC20_ABI from 'constants/abis/erc20.json'
import { isAddressString, getContract } from 'utils'
import { BigNumber } from '@ethersproject/bignumber'
import sushiData from '@sushiswap/sushi-data'
import { getMainnetAddress } from 'kashi/functions'
import useTransactionStatus from './useTransactionStatus'
import Fraction from 'constants/Fraction'
import { useDefaultTokens } from 'hooks/Tokens'
import _ from 'lodash'

import { useBoringHelperContract } from 'hooks/useContract'

const useBentoBalances = () => {
  const { chainId, library, account } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()
  const bentoBoxContract = useBentoBoxContract()
  const kashiPairContract = useKashiPairContract()
  const kashiPairHelperContract = useKashiPairHelperContract()

  const currentTransactionStatus = useTransactionStatus()

  const [balances, setBalances] = useState<any>()
  const tokens = Object.values(useDefaultTokens()).filter((token: any) => token.chainId === chainId)

  const fetchBentoBalances = useCallback(async () => {
    const balances = await boringHelperContract?.getBalances(account, tokens.map((token: any) => token.address))

    const balancesWithDetails = tokens.map((token, i) => {
      const amount = BigNumber.from(balances[i].bentoShare).isZero()
        ? BigNumber.from(0)
        : BigNumber.from(balances[i].bentoBalance)
            .mul(BigNumber.from(balances[i].bentoAmount))
            .div(BigNumber.from(balances[i].bentoShare))

      const amountUSD = "0"
      return {
        address: token.address,
        name: token.name || "AAA",
        symbol: token.symbol || "AAA",
        decimals: token.decimals || "AAA",
        balance: balances[i].balance,
        bentoBalance: balances[i].bentoBalance,
        amount: {
          value: amount,
          decimals: token.decimals
        },
        amountUSD: amountUSD
      }
    }).filter(token => token.balance.gt("0"))
    setBalances(_.orderBy(balancesWithDetails, ['name'], ['asc']))
  }, [account, bentoBoxContract, kashiPairContract?.address, kashiPairHelperContract, library])

  useEffect(() => {
    if (account && bentoBoxContract && library) {
      fetchBentoBalances()
    }
  }, [account, bentoBoxContract, fetchBentoBalances, currentTransactionStatus, library])

  return balances
}

export default useBentoBalances
