import { Signature } from '@ethersproject/bytes'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount } from '@figswap/core-sdk'
import { LimitOrder, STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import { calculateGasMargin } from 'app/functions'
import { useBentoBox, useBentoBoxContract, useLimitOrderHelperContract } from 'app/hooks'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { clear, setLimitOrderAttemptingTxn, setLimitOrderBentoPermit } from 'app/state/limit-order/actions'
import { useLimitOrderDerivedCurrencies } from 'app/state/limit-order/hooks'
import { OrderExpiration } from 'app/state/limit-order/reducer'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'

const getEndTime = (orderExpiration: OrderExpiration | string): number => {
  switch (orderExpiration) {
    case OrderExpiration.hour:
      return Math.floor(new Date().getTime() / 1000) + 3600
    case OrderExpiration.day:
      return Math.floor(new Date().getTime() / 1000) + 86400
    case OrderExpiration.week:
      return Math.floor(new Date().getTime() / 1000) + 604800
    case OrderExpiration.never:
    default:
      return Number.MAX_SAFE_INTEGER
  }
}

export type DepositAndApprovePayload = { inputAmount: CurrencyAmount<Currency>; bentoPermit: Signature }
export type DepositPayload = {
  inputAmount?: CurrencyAmount<Currency>
  bentoPermit?: Signature
  fromBentoBalance: boolean
}
export type ExecutePayload = {
  orderExpiration: OrderExpiration | string
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  recipient?: string
}

export type UseLimitOrderExecuteDeposit = (x: DepositPayload) => Promise<TransactionResponse | undefined>
export type UseLimitOrderExecuteExecute = (x: ExecutePayload) => void
export type UseLimitOrderExecute = () => {
  deposit: UseLimitOrderExecuteDeposit
  execute: UseLimitOrderExecuteExecute
}

const useLimitOrderExecute: UseLimitOrderExecute = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const { inputCurrency } = useLimitOrderDerivedCurrencies()
  const { rebase } = useBentoRebase(inputCurrency)
  const dispatch = useAppDispatch()
  const bentoBoxContract = useBentoBoxContract()
  const limitOrderHelperContract = useLimitOrderHelperContract()
  const addTransaction = useTransactionAdder()
  const limitOrderContractAddress = chainId ? STOP_LIMIT_ORDER_ADDRESS[chainId] : undefined
  const addPopup = useAddPopup()
  const { mutate } = useLimitOrders()
  const { deposit: _deposit } = useBentoBox(limitOrderContractAddress)

  // Deposit to BentoBox and approve BentoBox in one transaction
  const depositAndApprove = useCallback(
    async ({ inputAmount, bentoPermit }: DepositAndApprovePayload) => {
      const { v, r, s } = bentoPermit
      const amount = inputAmount.quotient.toString()

      try {
        const estimatedGas = await limitOrderHelperContract?.estimateGas.depositAndApprove(
          account,
          limitOrderContractAddress,
          true,
          v,
          r,
          s,
          {
            value: amount,
          }
        )

        if (estimatedGas) {
          dispatch(setLimitOrderAttemptingTxn(true))
          const tx = await limitOrderHelperContract?.depositAndApprove(
            account,
            limitOrderContractAddress,
            true,
            v,
            r,
            s,
            {
              value: amount,
              gasLimit: calculateGasMargin(estimatedGas),
            }
          )

          await tx.wait()
          addTransaction(tx, {
            summary: `Approve limit orders and Deposit ${inputAmount.currency.symbol} into BentoBox`,
          })
          dispatch(setLimitOrderAttemptingTxn(false))
          dispatch(setLimitOrderBentoPermit(undefined))

          return tx
        }
      } catch (error) {
        dispatch(setLimitOrderAttemptingTxn(false))
        console.error(error)
      }
    },
    [account, addTransaction, dispatch, limitOrderContractAddress, limitOrderHelperContract]
  )

  // Deposit to BentoBox
  const deposit = useCallback<UseLimitOrderExecuteDeposit>(
    async ({ inputAmount, bentoPermit, fromBentoBalance }) => {
      if (!bentoBoxContract || !limitOrderContractAddress || !inputAmount) throw new Error('Dependencies unavailable')

      const amount = BigNumber.from(inputAmount.quotient.toString())

      // Since the setMasterContractApproval is not payable, we can't batch native deposit and approve
      // For this case, we setup a helper contract
      if (inputAmount.currency.isNative && bentoPermit) {
        return depositAndApprove({ inputAmount, bentoPermit })
      }

      if (!fromBentoBalance) {
        try {
          if (!rebase) {
            console.error('Dependencies unavailable')
            return
          }

          dispatch(setLimitOrderAttemptingTxn(true))
          const tx = await _deposit(inputAmount.currency, rebase, amount, bentoPermit)

          dispatch(setLimitOrderAttemptingTxn(false))
          dispatch(setLimitOrderBentoPermit(undefined))
          return tx
        } catch (e) {
          dispatch(setLimitOrderAttemptingTxn(false))
        }
      }
    },
    [_deposit, bentoBoxContract, depositAndApprove, dispatch, limitOrderContractAddress, rebase]
  )

  const execute = useCallback<UseLimitOrderExecuteExecute>(
    async ({ orderExpiration, inputAmount, outputAmount, recipient }) => {
      if (!inputAmount || !outputAmount || !account || !library) throw new Error('Dependencies unavailable')

      const endTime = getEndTime(orderExpiration)
      const order = new LimitOrder(
        account,
        inputAmount.wrapped,
        outputAmount.wrapped,
        recipient ? recipient : account,
        Math.floor(new Date().getTime() / 1000).toString(),
        endTime.toString()
      )

      try {
        dispatch(setLimitOrderAttemptingTxn(true))
        await order?.signOrderWithProvider(chainId || 1, library)

        const resp = await order?.send()
        if (resp.success) {
          addPopup({
            txn: { hash: '', summary: 'Limit order created', success: true },
          })

          await mutate()
          dispatch(clear())
        }

        dispatch(setLimitOrderAttemptingTxn(false))
      } catch (e) {
        dispatch(setLimitOrderAttemptingTxn(false))
        addPopup({
          txn: {
            hash: '',
            // @ts-ignore TYPE NEEDS FIXING
            summary: `Error: ${e?.response?.data?.data}`,
            success: false,
          },
        })
      }
    },
    [account, addPopup, chainId, dispatch, library, mutate]
  )

  return {
    deposit,
    execute,
  }
}

export default useLimitOrderExecute
