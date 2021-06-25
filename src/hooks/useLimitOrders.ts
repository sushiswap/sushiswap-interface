import { useActiveWeb3React, useLimitOrderContract } from '.'
import useSWR, { SWRResponse } from 'swr'
import { LAMBDA_URL, LimitOrder, OrderStatus } from 'limitorderv2-sdk'
import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { Token } from '@sushiswap/sdk'
import { useAllTokens } from './Tokens'

interface State {
  pending: OpenOrder[]
  completed: OpenOrder[]
  loading: boolean
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
const viewFetcher = (url, account, chainId) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({ address: account, chainId }),
  })
    .then((r) => r.json())
    .then((j) => j.data)

const useLimitOrders = () => {
  const [openOrders, setOpenOrders] = useState<State>({
    pending: [],
    completed: [],
    loading: true,
  })

  const tokens = useAllTokens()
  const { account, chainId } = useActiveWeb3React()
  const limitOrderContract = useLimitOrderContract()

  const shouldFetch = useMemo(() => viewUrl && account && chainId, [account, chainId])
  const { data: ordersData, mutate }: SWRResponse<any, Error> = useSWR(
    shouldFetch ? [viewUrl, account, chainId] : null,
    viewFetcher
  )

  useEffect(() => {
    if (!ordersData || !Array.isArray(ordersData.orders)) return

    const transform = async () =>
      Promise.all(
        ordersData.orders.map(async (order: any) => {
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
            isCanceled = false
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
        }, [])
      ).then((data: any) =>
        data.reduce(
          (acc, cur) => {
            if (cur.filled || cur.isCanceled || cur.isExpired) {
              acc.completed.push(cur)
            } else {
              acc.pending.push(cur)
            }

            return acc
          },
          {
            completed: [],
            pending: [],
          }
        )
      )

    transform().then((state) =>
      setOpenOrders({
        ...state,
        loading: false,
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, ordersData, limitOrderContract])

  return {
    ...openOrders,
    mutate,
  }
}

export default useLimitOrders
