import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { ADVANCED_RECEIVER_ADDRESS, LimitOrder } from '@sushiswap/limit-order-sdk'
import { AUTONOMY_REGISTRY_ADDRESSES } from 'app/constants'
import AUTONOMY_REGISTRY_ABI from 'app/constants/abis/autonomy-registry.json'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import { ZERO } from 'app/functions'
import { useContract, useLimitOrderContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { setLimitOrderAttemptingTxn } from 'app/state/limit-order/actions'
import { OrderExpiration } from 'app/state/limit-order/reducer'
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
  execute: UseLimitOrderExecuteExecute
}

const useStopLossExecute: UseLimitOrderExecute = () => {
  const { account, chainId, library } = useActiveWeb3React()

  const autonomyRegistryContract = useContract(
    chainId ? AUTONOMY_REGISTRY_ADDRESSES[chainId] : undefined,
    AUTONOMY_REGISTRY_ABI,
    true
  )
  const limitOrderContract = useLimitOrderContract()

  const dispatch = useAppDispatch()
  const addPopup = useAddPopup()
  const { mutate } = useLimitOrders()

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

        if (limitOrderContract) {
          const encodedFillOrderData = limitOrderContract.interface.encodeFunctionData('fillOrder', [
            [
              order.maker,
              order.amountInRaw,
              order.amountOutRaw,
              order.recipient,
              order.startTime,
              order.endTime,
              order.stopPrice,
              order.oracleAddress,
              order.oracleData,
              order.amountInRaw,
              order.v,
              order.r,
              order.s,
            ],
            order.tokenInAddress,
            order.tokenOutAddress,
            chainId && ADVANCED_RECEIVER_ADDRESS[chainId],
            [],
          ])
          console.log('encoded fillOrder() data: ', JSON.stringify(encodedFillOrderData))

          await autonomyRegistryContract.newReq(
            limitOrderContract.address,
            AddressZero,
            encodedFillOrderData,
            ZERO,
            false,
            false,
            false
          )
        }

        // const resp = await order?.send()
        // if (resp.success) {
        //   addPopup({
        //     txn: { hash: '', summary: 'Limit order created', success: true },
        //   })

        //   await mutate()
        //   dispatch(clear())
        // }

        dispatch(setLimitOrderAttemptingTxn(false))
      } catch (e) {
        console.log('Error: ', e)
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
    [account, addPopup, chainId, dispatch, library, autonomyRegistryContract, limitOrderContract]
  )

  return {
    execute,
  }
}

export default useStopLossExecute
