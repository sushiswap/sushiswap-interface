import { BigNumber } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, JSBI, KASHI_ADDRESS, Rebase } from '@sushiswap/core-sdk'
import { ERC20_ABI } from 'app/constants/abis/erc20'
import KashiCooker from 'app/entities/KashiCooker'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import { getContract, minimum, toShare } from 'app/functions'
import { useBentoBoxContract, useMulticall2Contract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export interface WithdrawExecutePayload {
  withdrawAmount?: CurrencyAmount<Currency>
  receiveToWallet: boolean
  permit?: Signature
  removeMax: boolean
}

type UseWithdrawExecute = () => (x: WithdrawExecutePayload) => Promise<TransactionResponse | undefined>

export const useWithdrawExecute: UseWithdrawExecute = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const { account, library, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract()
  const masterContract = chainId && KASHI_ADDRESS[chainId]
  const multicall2Contract = useMulticall2Contract()

  return useCallback(
    async ({ withdrawAmount, receiveToWallet, permit, removeMax = false }) => {
      if (!account || !library || !chainId || !masterContract || !bentoBoxContract || !withdrawAmount) {
        console.error('Dependencies unavailable')
        return
      }

      const cooker = new KashiCooker(market, account, library, chainId)

      // Add permit if available
      if (permit) {
        cooker.approve({
          account,
          masterContract,
          v: permit.v,
          r: permit.r,
          s: permit.s,
        })
      }

      let fraction = removeMax
        ? minimum(market.userAssetFraction.toString(), market.maxAssetAvailableFraction.toString())
        : toShare(
            {
              base: market.currentTotalAsset.base,
              elastic: JSBI.BigInt(market.currentAllAssets.toString()),
            } as Rebase,
            BigNumber.from(withdrawAmount.quotient.toString())
          )

      if (multicall2Contract && receiveToWallet) {
        const erc20Contract = getContract(market.asset.token.wrapped.address, ERC20_ABI, library)
        const availableAmount = await erc20Contract.balanceOf(bentoBoxContract?.address)

        if (withdrawAmount.greaterThan(availableAmount.toString())) {
          const withdrawableFraction = toShare(
            {
              base: market.currentTotalAsset.base,
              elastic: JSBI.BigInt(market.currentAllAssets.toString()),
            } as Rebase,
            BigNumber.from(availableAmount)
          )

          cooker.removeAsset(withdrawableFraction, !receiveToWallet)

          // Harvest done through multicall, since direct BentoBox calls are forbidden
          cooker.action(
            multicall2Contract.address,
            0,
            `0x252dba42000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000${bentoBoxContract.address.slice(
              2
            )}0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006466c6bb0b000000000000000000000000${erc20Contract.address.slice(
              2
            )}0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`,
            false,
            false,
            0
          )

          fraction = withdrawableFraction.sub(fraction)
        }
      }

      cooker.removeAsset(fraction, !receiveToWallet)
      const result = await cooker.cook()

      if (result.success) {
        addTransaction(result.tx, {
          summary: i18n._(t`Withdraw ${withdrawAmount.toSignificant(6)} ${withdrawAmount.currency.symbol}`),
        })

        return result.tx
      }
    },
    [account, addTransaction, bentoBoxContract, chainId, i18n, library, market, masterContract, multicall2Contract]
  )
}
