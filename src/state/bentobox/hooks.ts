import { JSBI, CurrencyAmount, Currency, WNATIVE_ADDRESS, NATIVE } from '@sushiswap/sdk'
import { useBentoBoxContract, useTokenContract } from '../../hooks/useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { toAmount } from '../../functions/bentobox'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../multicall/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import useTransactionStatus from '../../hooks/useTransactionStatus'
import ERC20_INTERFACE from '../../constants/abis/erc20'

export interface BentoBalance {
  token: any
  wallet: CurrencyAmount<Currency>
  bento: CurrencyAmount<Currency>
}

export function useBentoBalances(): BentoBalance[] {
  const { account, chainId } = useActiveWeb3React()

  const bentoBoxContract = useBentoBoxContract()

  const weth = WNATIVE_ADDRESS[chainId]

  const tokens = useAllTokens()

  const tokenAddresses = Object.keys(tokens)

  const balances = useMultipleContractSingleData(tokenAddresses, ERC20_INTERFACE, 'balanceOf', [account])

  const ethBalances = useCurrencyBalances(account, [NATIVE[chainId]])

  const bentoBalances = useSingleContractMultipleData(
    bentoBoxContract,
    'balanceOf',
    tokenAddresses.map((token) => [token, account])
  )

  const bentoTotals = useSingleContractMultipleData(
    bentoBoxContract,
    'totals',
    tokenAddresses.map((token) => [token])
  )

  return useMemo(() => {
    for (let i = 0; i < tokenAddresses.length; ++i) {
      if (
        balances[i]?.loading ||
        balances[i]?.error ||
        !balances[i]?.result ||
        bentoBalances[i]?.loading ||
        bentoBalances[i]?.error ||
        !bentoBalances[i]?.result ||
        bentoTotals[i]?.loading ||
        bentoTotals[i]?.error ||
        !bentoTotals[i]?.result
      ) {
        return []
      }
    }

    const ethBalance = BigNumber.from(ethBalances[0].quotient.toString())

    return tokenAddresses
      .map((key: string, i: number) => {
        const token = tokens[key]

        const bentoBalance = bentoBalances[i].result[0]
        const bentoAmount = bentoTotals[i].result[0]
        const bentoShare = bentoTotals[i].result[1]
        const bento = toAmount({ bentoAmount, bentoShare }, bentoBalance)
        const wallet = token.address === weth ? ethBalance : balances[i].result[0]

        return {
          token,
          wallet: CurrencyAmount.fromRawAmount(token, JSBI.BigInt(wallet)),
          bento: CurrencyAmount.fromRawAmount(token, JSBI.BigInt(bento)),
        }
      })
      .filter((token) => token.wallet.greaterThan('0') || token.bento.greaterThan('0'))
  }, [ethBalances, tokenAddresses, balances, bentoBalances, bentoTotals, tokens, weth])
}

export function useBentoBalance(tokenAddress: string): {
  value: BigNumber
  decimals: number
} {
  const { account } = useActiveWeb3React()

  const token = useToken(tokenAddress)

  const bentoBoxContract = useBentoBoxContract()

  const tokenContract = useTokenContract(token?.address)

  const currentTransactionStatus = useTransactionStatus()

  const [balance, setBalance] = useState<any>()

  const fetchBentoBalance = useCallback(async () => {
    const balance = await bentoBoxContract.balanceOf(token.address, account)
    const totals = await bentoBoxContract.totals(token.address)
    const decimals = await tokenContract.decimals()

    const amount = toAmount({ bentoAmount: totals[0], bentoShare: totals[1] }, balance)

    setBalance({
      value: amount,
      decimals: decimals,
    })
  }, [account, token, bentoBoxContract, tokenContract])

  useEffect(() => {
    if (account && token) {
      fetchBentoBalance()
    }
  }, [account, token, currentTransactionStatus, fetchBentoBalance])

  return balance
}

export function useBentoMasterContractAllowed(masterContract?: string, user?: string): boolean | undefined {
  const contract = useBentoBoxContract()

  const inputs = useMemo(() => [masterContract, user], [masterContract, user])

  const allowed = useSingleCallResult(contract, 'masterContractApproved', inputs).result

  return useMemo(() => (allowed ? allowed[0] : undefined), [allowed])
}
