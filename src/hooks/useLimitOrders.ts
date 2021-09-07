import { useActiveWeb3React, useLimitOrderContract } from '.'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { JSBI, LimitOrder, Percent, Token } from '@sushiswap/sdk'
import { useAllTokens } from './Tokens'
import { useGun } from '../components/Gun'
import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { OrderStatus } from 'limitorderv2-sdk'

interface State {
  pending: {
    page: number
    pageSize: number
    maxPages: number
    data: OpenOrder[]
    loading: boolean
    totalOrders: number
  }
  completed: {
    page: number
    pageSize: number
    maxPages: number
    data: OpenOrder[]
    loading: boolean
    totalOrders: number
  }
}

interface OpenOrder {
  tokenIn: Token
  tokenOut: Token
  filledPercent: string
  limitOrder: LimitOrder
  status: OrderStatus
  rate: string
}

const initialState = {
  page: 1,
  pageSize: 5,
  maxPages: null,
  data: [],
  loading: true,
  totalOrders: 0,
}

const denominator = (decimals: number = 18) => JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))

const useLimitOrders = () => {
  const { account, chainId } = useActiveWeb3React()
  const limitOrderContract = useLimitOrderContract()
  const tokens = useAllTokens()
  const { broadcast, data } = useGun()

  // Split orders into active and expired orders as we don't have to check status and filledAmount for expired orders
  const orders = useMemo(() => Object.values(data), [data])
  const [active, expired] = useMemo(
    () =>
      orders.reduce<[LimitOrder[], LimitOrder[]]>(
        ([p, f], e: LimitOrder) =>
          +e.endTime >= Math.floor(new Date().getTime() / 1000) ? [[...p, e], f] : [p, [...f, e]],
        [[], []]
      ),
    [orders]
  )

  // Get type hashes of active orders
  const hashes = useMemo(() => active.map((order: LimitOrder) => [order.getTypeHash()]), [active])
  const hashesWithAcc = useMemo(
    () => active.map((order: LimitOrder) => [account, order.getTypeHash()]),
    [account, active]
  )

  // Get status of every active order using typeHashes
  const orderFilledAmount = useSingleContractMultipleData(limitOrderContract, 'orderStatus', hashes)

  // Get status of every active order using hashes and account
  const orderCancelled = useSingleContractMultipleData(limitOrderContract, 'cancelledOrder', hashesWithAcc)

  // Pagination state
  const [state, setState] = useState<State>({
    pending: { ...initialState },
    completed: { ...initialState },
  })

  // Handle page change
  const setPage = useCallback(
    (type) => (page: number) => {
      setState((prevState) => ({
        ...prevState,
        [type]: {
          ...prevState[type],
          page,
        },
      }))
    },
    []
  )

  // Transform order data by giving it some derived attributes
  const transform = useCallback(
    (order: LimitOrder, filledAmount: BigNumber, cancelled: boolean) => {
      const { address: inputAddress } = order.amountIn.currency
      const { address: outputAddress } = order.amountOut.currency
      const filledPercent = filledAmount
        ? filledAmount
            .mul(BigNumber.from('100'))
            .div(order.amountIn.numerator.toString().toBigNumber(order.tokenInDecimals))
            .toString()
        : '0'

      const orderStatus =
        filledAmount === order.amountIn.numerator.toString().toBigNumber(order.tokenInDecimals)
          ? OrderStatus.FILLED
          : cancelled
          ? OrderStatus.CANCELLED
          : +order.endTime < Math.floor(new Date().getTime() / 1000)
          ? OrderStatus.EXPIRED
          : OrderStatus.PENDING

      const rate = new Percent(order.amountOut.quotient, denominator(order.tokenOutDecimals))
        .divide(new Percent(order.amountIn.quotient, denominator(order.tokenInDecimals)))
        .divide(denominator(2))
        .toSignificant(6)

      return {
        rate,
        status: orderStatus,
        filledPercent,
        limitOrder: order,
        tokenIn: tokens[inputAddress] || new Token(chainId, inputAddress, order.tokenInDecimals, order.tokenInSymbol),
        tokenOut:
          tokens[outputAddress] || new Token(chainId, outputAddress, order.tokenOutDecimals, order.tokenOutSymbol),
      }
    },
    [chainId]
  )

  const setData = useCallback(() => {
    let pending = []
    let completed = []

    completed = expired.map((raw: LimitOrder) => transform(raw, null, null))
    active.forEach((raw: LimitOrder, index) => {
      const order = transform(raw, orderFilledAmount[index].result[0], orderCancelled[index].result[0])
      if (order.status === OrderStatus.PENDING) pending.push(order)
      else completed.push(order)
    })

    // Sort on startTime
    completed.sort((a, b) => b.limitOrder.startTime - a.limitOrder.startTime)
    pending.sort((a, b) => b.limitOrder.startTime - a.limitOrder.startTime)

    setState((prevState) => ({
      pending: {
        ...prevState.pending,
        data: pending,
        maxPages: Math.ceil(pending.length / 5),
        loading: false,
        totalOrders: pending.length,
      },
      completed: {
        ...prevState.completed,
        data: completed,
        maxPages: Math.ceil(completed.length / 5),
        loading: false,
        totalOrders: completed.length,
      },
    }))
  }, [orderFilledAmount, orderCancelled, transform, active, expired])

  useEffect(() => {
    if (
      !orderFilledAmount ||
      !orderCancelled ||
      orderFilledAmount.length < active.length ||
      orderCancelled.length < active.length ||
      !orderFilledAmount.every((el) => el.result) ||
      !orderCancelled.every((el) => el.result)
    )
      return

    setData()
  }, [orderFilledAmount, orderCancelled, transform, active, expired])

  // Broadcast data to GUN when an order has been successfully placed
  const save = useCallback(
    async (order: LimitOrder) => {
      const orderData = order.getTypedData()
      const data = {
        ...orderData.message,
        chainId: orderData.domain.chainId,
        tokenInDecimals: order.tokenInDecimals,
        tokenOutDecimals: order.tokenOutDecimals,
        tokenInSymbol: order.tokenInSymbol,
        tokenOutSymbol: order.tokenOutSymbol,
      }

      broadcast(data)
    },
    [broadcast]
  )

  return useMemo(
    () => ({
      ...state,
      setPage,
      save,
    }),
    [save, setPage, state]
  )
}

export default useLimitOrders
