import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useBentoBoxContract } from './useContract'
import { BigNumber } from '@ethersproject/bignumber'
import useTransactionStatus from './useTransactionStatus'
import { useDefaultTokens } from 'hooks/Tokens'
import orderBy from 'lodash/orderBy'
import { Token } from '@sushiswap/sdk'

import { useBoringHelperContract } from 'hooks/useContract'

export interface BentoBalance {
  address: string
  name: string
  symbol: string
  decimals: number | string
  balance: BigNumber
  bentoBalance: BigNumber
  amount: {
    value: BigNumber
    decimals: number
  }
  amountUSD: string
}

function useBentoBalances(): BentoBalance[] {
  const { chainId, library, account } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()
  const bentoBoxContract = useBentoBoxContract()
  const currentTransactionStatus = useTransactionStatus()

  const [balances, setBalances] = useState<any>()
  const tokens = Object.values(useDefaultTokens()).filter((token: Token) => token.chainId === chainId)

  const fetchBentoBalances = useCallback(async () => {
    const balances = await boringHelperContract?.getBalances(
      account,
      tokens.map((token: any) => token.address)
    )

    const balancesWithDetails = tokens
      .map((token, i) => {
        const amount = BigNumber.from(balances[i].bentoShare).isZero()
          ? BigNumber.from(0)
          : BigNumber.from(balances[i].bentoBalance)
              .mul(BigNumber.from(balances[i].bentoAmount))
              .div(BigNumber.from(balances[i].bentoShare))

        const amountUSD = '0'
        return {
          address: token.address,
          name: token.name || 'AAA',
          symbol: token.symbol || 'AAA',
          decimals: token.decimals || 'AAA',
          balance: balances[i].balance,
          bentoBalance: balances[i].bentoBalance,
          amount: {
            value: amount,
            decimals: token.decimals
          },
          amountUSD: amountUSD
        }
      })
      .filter(token => token.balance.gt('0') || token.bentoBalance.gt('0'))
    setBalances(orderBy(balancesWithDetails, ['name'], ['asc']))
  }, [account, tokens, boringHelperContract])

  useEffect(() => {
    if (account && bentoBoxContract && library) {
      fetchBentoBalances()
    }
  }, [account, bentoBoxContract, fetchBentoBalances, currentTransactionStatus, library])

  return balances
}

export default useBentoBalances
