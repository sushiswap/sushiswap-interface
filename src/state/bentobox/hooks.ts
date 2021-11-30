import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { KASHI_ADDRESS, USDC_ADDRESS, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import ERC20_ABI from 'app/constants/abis/erc20.json'
import { toAmount } from 'app/functions/bentobox'
import { easyAmount } from 'app/functions/kashi'
import { e10 } from 'app/functions/math'
import { useAllTokens } from 'app/hooks/Tokens'
import { useBentoBoxContract, useBoringHelperContract, useContract } from 'app/hooks/useContract'
import useTransactionStatus from 'app/hooks/useTransactionStatus'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface BentoBalance {
  address: string
  name: string
  symbol: string
  decimals: number
  balance: any
  bentoBalance: any
  wallet: any
  bento: any
}

export function useBentoBalances(): BentoBalance[] {
  const { chainId, account } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()

  const tokens = useAllTokens()

  const weth = WNATIVE_ADDRESS[chainId]

  const tokenAddresses = Object.keys(tokens).filter(
    (token) =>
      ![
        '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
        '0x72B886d09C117654aB7dA13A14d603001dE0B777',
        '0x21413c119b0C11C5d96aE1bD328917bC5C8ED67E',
      ].includes(token)
  )

  const balanceData = useSingleCallResult(boringHelperContract, 'getBalances', [account, tokenAddresses])

  const uiData = useSingleCallResult(boringHelperContract, 'getUIInfo', [
    account,
    [],
    USDC_ADDRESS[chainId],
    [KASHI_ADDRESS[chainId]],
  ])

  // IERC20 token = addresses[i];
  // balances[i].totalSupply = token.totalSupply();
  // balances[i].token = token;
  // balances[i].balance = token.balanceOf(who);
  // balances[i].bentoAllowance = token.allowance(who, address(bentoBox));
  // balances[i].nonce = token.nonces(who);
  // balances[i].bentoBalance = bentoBox.balanceOf(token, who);
  // (balances[i].bentoAmount, balances[i].bentoShare) = bentoBox.totals(token);
  // balances[i].rate = getETHRate(token);

  return useMemo(() => {
    if (
      uiData.loading ||
      balanceData.loading ||
      uiData.error ||
      balanceData.error ||
      !uiData.result ||
      !balanceData.result
    )
      return []
    return tokenAddresses
      .map((key: string, i: number) => {
        const token = tokens[key]

        const usd = e10(token.decimals).mulDiv(uiData.result[0].ethRate, balanceData.result[0][i].rate)

        const full = {
          ...token,
          ...balanceData.result[0][i],
          elastic: balanceData.result[0][i].bentoAmount,
          base: balanceData.result[0][i].bentoShare,
          usd,
        }
        return {
          ...token,
          usd,
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          balance: token.address === weth ? uiData.result[0].ethBalance : balanceData.result[0][i].balance,
          bentoBalance: balanceData.result[0][i].bentoBalance,
          wallet: easyAmount(
            token.address === weth ? uiData.result[0].ethBalance : balanceData.result[0][i].balance,
            full
          ),
          bento: easyAmount(toAmount(full, balanceData.result[0][i].bentoBalance), full),
        }
      })
      .filter((token) => token.balance.gt('0') || token.bentoBalance.gt('0'))
  }, [
    uiData.loading,
    uiData.error,
    uiData.result,
    balanceData.loading,
    balanceData.error,
    balanceData.result,
    tokenAddresses,
    tokens,
    weth,
  ])
}

export function useBentoBalance(tokenAddress: string): {
  value: BigNumber
  decimals: number
} {
  const { account } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()
  const bentoBoxContract = useBentoBoxContract()
  const tokenAddressChecksum = getAddress(tokenAddress)
  const tokenContract = useContract(tokenAddressChecksum ? tokenAddressChecksum : undefined, ERC20_ABI)

  const currentTransactionStatus = useTransactionStatus()

  const [balance, setBalance] = useState<any>()

  // const balanceData = useSingleCallResult(boringHelperContract, 'getBalances', [account, tokenAddresses])

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
      decimals: decimals,
    })
  }, [account, tokenAddressChecksum, tokenContract, boringHelperContract])

  useEffect(() => {
    if (account && bentoBoxContract && boringHelperContract && tokenContract) {
      fetchBentoBalance()
    }
  }, [account, bentoBoxContract, currentTransactionStatus, fetchBentoBalance, tokenContract, boringHelperContract])

  return balance
}

export function useBentoMasterContractAllowed(masterContract?: string, user?: string): boolean | undefined {
  const contract = useBentoBoxContract()

  const inputs = useMemo(() => [masterContract, user], [masterContract, user])

  const allowed = useSingleCallResult(contract, 'masterContractApproved', inputs).result

  return useMemo(() => (allowed ? allowed[0] : undefined), [allowed])
}
