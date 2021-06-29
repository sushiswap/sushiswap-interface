import { useActiveWeb3React, useLimitOrderContract } from '.'
import useSWR, { SWRResponse } from 'swr'
import { LAMBDA_URL, LimitOrder, OrderStatus } from 'limitorderv2-sdk'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Token } from '@sushiswap/sdk'
import { useAllTokens } from './Tokens'

interface State {
  pending: {
    page: number
    maxPages: null
    data: OpenOrder[]
    loading: boolean
  }
  completed: {
    page: number
    maxPages: null
    data: OpenOrder[]
    loading: boolean
  }
}

interface OpenOrder {
  tokenIn: Token
  tokenOut: Token
  filled: boolean
  filledPercent: string
  inRaw: string
  isCanceled: boolean
  isExpired: boolean
  limitOrder: LimitOrder
  minOutRaw: string
}

const viewUrl = `${LAMBDA_URL}/orders/view`
const viewFetcher = (url, account, chainId, pendingPage, page) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ address: account, chainId, page, pendingPage }),
  })
    .then((r) => r.json())
    .then((j) => j.data)
}

const useLimitOrders = () => {
  const { account, chainId } = useActiveWeb3React()
  const limitOrderContract = useLimitOrderContract()
  const tokens = useAllTokens()

  const [state, setState] = useState<State>({
    pending: {
      page: 1,
      maxPages: null,
      data: [],
      loading: true,
    },
    completed: {
      page: 1,
      maxPages: null,
      data: [],
      loading: true,
    },
  })

  const shouldFetch = useMemo(
    () =>
      viewUrl && account && chainId ? [viewUrl, account, chainId, state.pending.page, state.completed.page] : null,
    [account, chainId, state.completed.page, state.pending.page]
  )

  const { data: ordersData, mutate }: SWRResponse<any, Error> = useSWR(shouldFetch, viewFetcher)

  const setPendingPage = useCallback((page: number) => {
    setState((prevState) => ({
      ...prevState,
      pending: {
        ...prevState.pending,
        page,
        loading: true,
      },
    }))
  }, [])

  const setCompletedPage = useCallback((page: number) => {
    setState((prevState) => ({
      ...prevState,
      completed: {
        ...prevState.completed,
        page,
        loading: true,
      },
    }))
  }, [])

  useEffect(() => {
    if (
      !account ||
      !chainId ||
      !ordersData ||
      !Array.isArray(ordersData.pendingOrders.orders) ||
      !Array.isArray(ordersData.otherOrders.orders)
    )
      return

    const transform = async (order: any) => {
      const limitOrder = LimitOrder.getLimitOrder({
        ...order,
        chainId: +order.chainId,
        tokenInDecimals: +order.tokenInDecimals || 18,
        tokenOutDecimals: +order.tokenOutDecimals || 18,
      })

      let filledPercent = '0'
      let isCanceled
      if (order.status === OrderStatus.FILLED) {
        isCanceled = false
      } else if (order.status === OrderStatus.PENDING) {
        const filledAmount = await limitOrderContract.orderStatus(order.orderTypeHash)
        filledPercent = filledAmount.mul(BigNumber.from('100')).div(BigNumber.from(order.amountIn)).toString()
        isCanceled = await limitOrderContract.cancelledOrder(account, order.orderTypeHash)
      } else {
        isCanceled = true
      }

      const tokenIn = limitOrder.amountIn.currency
      const tokenOut = limitOrder.amountOut.currency

      const openOrder = {
        tokenIn:
          tokens[tokenIn.address] ||
          new Token(chainId, tokenIn.address.toLowerCase(), tokenIn.decimals, tokenIn.symbol),
        tokenOut:
          tokens[tokenOut.address] ||
          new Token(chainId, tokenOut.address.toLowerCase(), tokenOut.decimals, tokenOut.symbol),
        limitOrder,
        filledPercent,
        isCanceled,
        isExpired: Number(limitOrder.endTime) < Math.floor(Date.now() / 1000),
        filled: order.status === OrderStatus.FILLED,
        inRaw: limitOrder.amountInRaw,
        minOutRaw: limitOrder.amountOutRaw,
      }

      return openOrder as OpenOrder
    }

    ;(async () => {
      const orders = await Promise.all<OpenOrder>(
        [...ordersData.pendingOrders.orders, ...ordersData.otherOrders.orders].map((el) => transform(el))
      )

      const [openOrders, completedOrders] = orders.reduce(
        (acc, cur) => {
          if (cur.filled || cur.isCanceled || cur.isExpired) {
            acc[1].push(cur)
          } else {
            acc[0].push(cur)
          }

          return acc
        },
        [[], []]
      )

      setState((prevState) => ({
        pending: {
          ...prevState.pending,
          data: openOrders,
          maxPages: ordersData.pendingOrders.pendingOrderMaxPage,
          loading: false,
        },
        completed: {
          ...prevState.completed,
          data: completedOrders,
          maxPages: ordersData.otherOrders.maxPage,
          loading: false,
        },
      }))
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, ordersData, limitOrderContract, setPendingPage, setCompletedPage])

  return useMemo(
    () => ({
      ...state,
      pending: {
        ...state.pending,
        setPage: setPendingPage,
      },
      completed: {
        ...state.completed,
        setPage: setCompletedPage,
      },
      mutate,
    }),
    [mutate, setCompletedPage, setPendingPage, state]
  )
}

export default useLimitOrders
