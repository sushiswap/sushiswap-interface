import { JSBI, LAMBDA_URL, LimitOrder, OrderStatus, Percent, Token } from '@sushiswap/sdk'
import { useActiveWeb3React, useLimitOrderContract } from '.'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'

import { BigNumber } from '@ethersproject/bignumber'
import { useAllTokens } from './Tokens'

interface State {
  pending: {
    page: number
    maxPages: null
    data: OpenOrder[]
    loading: boolean
    totalOrders: number
  }
  completed: {
    page: number
    maxPages: null
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

const denominator = (decimals: number = 18) => JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))

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
      totalOrders: 0,
    },
    completed: {
      page: 1,
      maxPages: null,
      data: [],
      loading: true,
      totalOrders: 0,
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
      !ordersData.pendingOrders ||
      !ordersData.otherOrders ||
      !Array.isArray(ordersData.pendingOrders.orders) ||
      !Array.isArray(ordersData.otherOrders.orders)
    )
      return

    const transform = async (order: any) => {
      const limitOrder = LimitOrder.getLimitOrder({
        ...order,
        chainId: +order.chainId,
        tokenInDecimals: +order.tokenInDecimals,
        tokenOutDecimals: +order.tokenOutDecimals,
      })

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
        filledPercent: order.filledAmount
          ? order.filledAmount.mul(BigNumber.from('100')).div(BigNumber.from(order.amountIn)).toString()
          : '0',
        status: order.status,
        rate: new Percent(limitOrder.amountOut.quotient, denominator(tokenOut.decimals))
          .divide(new Percent(limitOrder.amountIn.quotient, denominator(tokenIn.decimals)))
          .divide(denominator(2))
          .toSignificant(6),
      }

      return openOrder as OpenOrder
    }

    ;(async () => {
      const openOrders = await Promise.all<OpenOrder>(ordersData.pendingOrders.orders.map((el) => transform(el)))
      const completedOrders = await Promise.all<OpenOrder>(ordersData.otherOrders.orders.map((el) => transform(el)))

      setState((prevState) => ({
        pending: {
          ...prevState.pending,
          data: openOrders,
          maxPages: ordersData.pendingOrders.pendingOrderMaxPage,
          loading: false,
          totalOrders: ordersData.pendingOrders.totalPendingOrders,
        },
        completed: {
          ...prevState.completed,
          data: completedOrders,
          maxPages: ordersData.otherOrders.maxPage,
          loading: false,
          totalOrders: ordersData.otherOrders.totalOrders,
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
