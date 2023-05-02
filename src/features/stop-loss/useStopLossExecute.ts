import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { formatUnits } from '@ethersproject/units'
import { ChainId, Currency, CurrencyAmount, Price, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { LimitOrder, ROUND_UP_RECEIVER_ADDRESS } from '@sushiswap/limit-order-sdk'
import {
  CHAINLINK_ORACLE_ADDRESS,
  MORALIS_INFO,
  STOP_LIMIT_ORDER_WRAPPER_ADDRESSES,
  STOP_LIMIT_ORDER_WRAPPER_FEE_MINIMUM,
} from 'app/constants/autonomy'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import { ZERO } from 'app/functions'
import { useAutonomyLimitOrderWrapperContract, useAutonomyRegistryContract, useRouterContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { clear, setLimitOrderAttemptingTxn } from 'app/state/limit-order/actions'
import { useLimitOrderDerivedLimitPrice, useStopLossDerivedLimitPrice } from 'app/state/limit-order/hooks'
import { OrderExpiration } from 'app/state/limit-order/reducer'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Moralis from 'moralis'
import { useEffect, useMemo, useState } from 'react'
import { useCallback } from 'react'

import { prepareStopPriceOracleData, ZERO_ORACLE_ADDRESS, ZERO_ORACLE_DATA } from './utils'

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
  amountExternal?: CurrencyAmount<Currency>
  recipient?: string
  stopPrice?: Price<Currency, Currency> | undefined
}

export type UseLimitOrderExecuteDeposit = (x: DepositPayload) => Promise<TransactionResponse | undefined>
export type UseLimitOrderExecuteExecute = (x: ExecutePayload) => void
export type UseLimitOrderExecute = () => {
  execute: UseLimitOrderExecuteExecute
  cancelRequest: (id: string) => void
}

// estimate equivalent ETH amount from any input token amount
export function useEstimateEquivalentEthAmount(token: CurrencyAmount<Currency> | undefined): string {
  const { chainId } = useActiveWeb3React()
  const router = useRouterContract()
  const [equivalentEthAmount, setEquivalentEthAmount] = useState('0')

  useEffect(() => {
    const updateEquivalentEthAmount = async () => {
      if (!router || !chainId || !token) {
        setEquivalentEthAmount('0')
        return
      }
      if (token.wrapped.currency.address === WNATIVE_ADDRESS[chainId]) {
        setEquivalentEthAmount(formatUnits(token.quotient.toString(), 18))
        return
      }

      // estimate output amount with uniV2 router
      const amountsOut = await router.getAmountsOut(token.quotient.toString(), [
        token.wrapped.currency.address,
        WNATIVE_ADDRESS[chainId],
      ])
      setEquivalentEthAmount(formatUnits(amountsOut[amountsOut.length - 1], 18))
    }

    updateEquivalentEthAmount()
  }, [token])

  return equivalentEthAmount
}

interface DifferenceOfStopAndMinimumRateResult {
  diffOfStopAndMinRate: CurrencyAmount<Currency> | undefined
  diffValueOfEth: string
  tooNarrowMarginOfRates: boolean
  externalAmountForFee: string
}

// check if difference between stopRate and minimum rate is enough to cover autonomy fee
export function useDiffOfStopAndMinimumRate({
  inputAmount,
}: {
  inputAmount: CurrencyAmount<Currency> | undefined
}): DifferenceOfStopAndMinimumRateResult {
  const { chainId } = useActiveWeb3React()
  const rate = useLimitOrderDerivedLimitPrice()
  const stopRate = useStopLossDerivedLimitPrice()

  // get difference of output amounts between stop and minimum rate
  const diffOfStopAndMinRate = useMemo(() => {
    if (!stopRate || !rate || !inputAmount || stopRate.equalTo(rate) || stopRate.lessThan(rate)) return undefined
    return stopRate?.quote(inputAmount).subtract(rate?.quote(inputAmount))
  }, [rate, stopRate, inputAmount])
  // get equivalent ETH amount of difference
  const diffValueOfEth = useEstimateEquivalentEthAmount(diffOfStopAndMinRate)
  // compare with minimum fee amount
  const tooNarrowMarginOfRates = useMemo(
    () => (!!chainId ? parseFloat(diffValueOfEth) < parseFloat(STOP_LIMIT_ORDER_WRAPPER_FEE_MINIMUM[chainId]) : false),
    [diffValueOfEth]
  )

  const convertIntWithMultiply = (s: string) => Math.floor(parseFloat(s) * 1000000) // 1000,000 aims to mitigate loss while in math operation
  const getBigNumberFromTinyFloat = (s: string) => BigNumber.from(`${convertIntWithMultiply(s)}`)
  // calculate amount for autonomy fee:  (stopRate - minimumRate) * MIN_FEE_ETH_AMOUNT / equivalentEthAmountOf[stopRate - minimumRate]
  // this will be cumulated to minimum output amount
  const externalAmountForFee =
    !!chainId && !!diffOfStopAndMinRate && convertIntWithMultiply(diffValueOfEth) > 0
      ? BigNumber.from(diffOfStopAndMinRate?.quotient.toString())
          .mul(getBigNumberFromTinyFloat(STOP_LIMIT_ORDER_WRAPPER_FEE_MINIMUM[chainId]))
          .div(getBigNumberFromTinyFloat(diffValueOfEth))
      : 0

  return {
    diffOfStopAndMinRate,
    diffValueOfEth,
    tooNarrowMarginOfRates,
    externalAmountForFee: externalAmountForFee.toString(),
  }
}

// register stop-limit order into autonomy registry
const useStopLossExecute: UseLimitOrderExecute = () => {
  const { account, chainId, library } = useActiveWeb3React()

  const autonomyRegistryContract = useAutonomyRegistryContract()
  const limitOrderWrapperContract = useAutonomyLimitOrderWrapperContract()
  const addTransaction = useTransactionAdder()

  const dispatch = useAppDispatch()
  const addPopup = useAddPopup()
  const { mutate } = useLimitOrders()

  const execute = useCallback<UseLimitOrderExecuteExecute>(
    async ({ orderExpiration, inputAmount, outputAmount, amountExternal, recipient, stopPrice }) => {
      if (!inputAmount || !outputAmount || !account || !library || !chainId) throw new Error('Dependencies unavailable')

      let oracleData
      if (stopPrice) {
        oracleData = prepareStopPriceOracleData(inputAmount.wrapped, outputAmount.wrapped, stopPrice, chainId)
        // console.log('oracleData: ', JSON.stringify(oracleData))
      }

      const endTime = getEndTime(orderExpiration)
      const order = new LimitOrder(
        account,
        inputAmount.wrapped,
        outputAmount.wrapped,
        recipient ? recipient : account,
        Math.floor(new Date().getTime() / 1000).toString(),
        endTime.toString(),
        oracleData && oracleData.stopPrice ? oracleData.stopPrice : '0',
        oracleData && oracleData.stopPrice ? CHAINLINK_ORACLE_ADDRESS[chainId] : ZERO_ORACLE_ADDRESS,
        oracleData && oracleData.stopPrice ? oracleData.oracleData : ZERO_ORACLE_DATA
      )

      try {
        dispatch(setLimitOrderAttemptingTxn(true))
        await order?.signOrderWithProvider(chainId || 1, library)

        if (autonomyRegistryContract && limitOrderWrapperContract && chainId) {
          if (stopPrice && oracleData?.stopPrice == ZERO_ORACLE_DATA) {
            throw new Error('Unsupported pair')
          }
          const data = defaultAbiCoder.encode(
            ['address[]', 'uint256', 'address', 'bool'],
            [
              [order.tokenInAddress, order.tokenOutAddress], // path
              amountExternal?.wrapped.quotient.toString(),
              chainId && STOP_LIMIT_ORDER_WRAPPER_ADDRESSES[chainId], // profit receiver
              false, // keepTokenIn, charge fee, by outputToken always
            ]
          )

          const encodedFillOrderData = limitOrderWrapperContract.interface.encodeFunctionData('fillOrder', [
            0, // fee amount, that will be filled later
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
            chainId &&
              (chainId == ChainId.AVALANCHE
                ? '0x802290173908ed30A9642D6872e252Ef4f6e59A2'
                : ROUND_UP_RECEIVER_ADDRESS[chainId]),
            data,
          ])
          // console.log('encoded fillOrder() data: ', JSON.stringify(encodedFillOrderData))

          await autonomyRegistryContract.newReq(
            chainId && STOP_LIMIT_ORDER_WRAPPER_ADDRESSES[chainId], // target
            AddressZero, // referer
            encodedFillOrderData, // callData
            ZERO, // ethForCall
            false, // verifyUser
            true, // insertFeeAmount
            false // isAlive
          )
        }

        addPopup({
          txn: { hash: '', summary: 'Stop loss order created', success: true },
        })

        await mutate()
        dispatch(clear())

        dispatch(setLimitOrderAttemptingTxn(false))
      } catch (e: any) {
        dispatch(setLimitOrderAttemptingTxn(false))
        addPopup({
          txn: {
            hash: '',
            // @ts-ignore TYPE NEEDS FIXING
            summary: `Error: ${e?.message}`,
            success: false,
          },
        })
      }
    },
    [account, addPopup, chainId, dispatch, library, autonomyRegistryContract, limitOrderWrapperContract]
  )

  const cancelRequest = useCallback(
    async (requestId: string) => {
      if (!account || !chainId || !library || !limitOrderWrapperContract || !autonomyRegistryContract)
        throw new Error('Dependencies unavailable')

      try {
        Moralis.initialize((chainId && MORALIS_INFO[chainId].key) || '')
        Moralis.serverURL = (chainId && MORALIS_INFO[chainId].serverURL) || ''
        const queryRequest = new Moralis.Query('RegistryRequests')
        queryRequest.equalTo('uid', requestId)
        let requests = await queryRequest.find()

        const callData = await requests[0].get('callData')

        const tx = await autonomyRegistryContract.cancelHashedReq(requestId, [
          account,
          chainId && STOP_LIMIT_ORDER_WRAPPER_ADDRESSES[chainId], // target
          AddressZero, // referer
          callData, // callData
          ZERO, // initEthSent
          ZERO, // ethForCall
          false, // verifyUser
          true, // insertFeeAmount
          false, // payWithAuto
          false, // isAlive
        ])

        addTransaction(tx, {
          summary: 'Stop loss order canceled',
        })
        await tx.wait()
      } catch (e) {
        console.log('Error while fetching history from Moralis')
      }
    },
    [account, chainId, dispatch, library, limitOrderWrapperContract, autonomyRegistryContract]
  )

  return {
    cancelRequest,
    execute,
  }
}

export default useStopLossExecute
