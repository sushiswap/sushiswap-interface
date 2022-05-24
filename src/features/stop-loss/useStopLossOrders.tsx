import { Price, Token } from '@sushiswap/core-sdk'
import DEFAULT_TOKEN_LIST from '@sushiswap/default-token-list'
import { LimitOrder, OrderStatus } from '@sushiswap/limit-order-sdk'
import { MORALIS_INFO, STOP_LIMIT_ORDER_WRAPPER_ADDRESSES } from 'app/constants/autonomy'
import { DerivedOrder } from 'app/features/legacy/limit-order/types'
import { useAutonomyLimitOrderWrapperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import Moralis from 'moralis'
import { useCallback, useMemo } from 'react'

interface IToken {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoUrl?: string
}

interface ITokenList {
  name: string
  logoURL?: string
  keywords: any
  timestamp: any
  tokens: IToken[]
  version: any
}

const useStopLossOrders = () => {
  const { account, chainId } = useActiveWeb3React()
  const limitOrderWrapperContract = useAutonomyLimitOrderWrapperContract()

  const tokens = useMemo(
    () => (DEFAULT_TOKEN_LIST as ITokenList).tokens.filter((token) => token.chainId === chainId),
    [chainId]
  )

  const fetchRegistryHistory = useCallback(async () => {
    try {
      Moralis.initialize((chainId && MORALIS_INFO[chainId].key) || '')
      Moralis.serverURL = (chainId && MORALIS_INFO[chainId].serverURL) || ''

      const bscRequests = new Moralis.Query('RegistryRequests')
      bscRequests.equalTo('user', account?.toLowerCase())
      bscRequests.equalTo('target', chainId && STOP_LIMIT_ORDER_WRAPPER_ADDRESSES[chainId].toLowerCase())
      let registryRequests = await bscRequests.find()

      return await Promise.all(
        registryRequests.map(async (request) => {
          return request.get('callData')
        })
      )
    } catch (e) {
      console.log('Error while fetching history from Moralis')
      return []
    }
  }, [account, chainId])

  const fetchExecutedRegistryHistory = useCallback(async () => {
    try {
      Moralis.initialize((chainId && MORALIS_INFO[chainId].key) || '')
      Moralis.serverURL = (chainId && MORALIS_INFO[chainId].serverURL) || ''

      const bscRequests = new Moralis.Query('RegistryExecutedRequests')
      bscRequests.equalTo('user', account?.toLowerCase())
      bscRequests.equalTo('target', chainId && STOP_LIMIT_ORDER_WRAPPER_ADDRESSES[chainId].toLowerCase())
      let registryRequests = await bscRequests.find()

      return await Promise.all(
        registryRequests.map(async (request) => {
          return request.get('callData')
        })
      )
    } catch (e) {
      console.log('Error while fetching history from Moralis')
      return []
    }
  }, [account, chainId])

  const transform = useCallback(
    (callData: string, id: number, status: OrderStatus = OrderStatus.PENDING): DerivedOrder | undefined => {
      if (!chainId) return

      const fillOrderArgs = limitOrderWrapperContract?.interface.decodeFunctionData('fillOrder', callData)
      const token0 = fillOrderArgs && tokens.find((token) => token.address === fillOrderArgs[2])
      const token1 = fillOrderArgs && tokens.find((token) => token.address === fillOrderArgs[3])
      if (!token0 || !token1) return

      const limitOrder: LimitOrder = LimitOrder.getLimitOrder({
        maker: fillOrderArgs[1][0] as string,
        tokenIn: fillOrderArgs[2] as string,
        tokenOut: fillOrderArgs[3] as string,
        tokenInDecimals: token0.decimals,
        tokenOutDecimals: token1.decimals,
        tokenInSymbol: token0.symbol,
        tokenOutSymbol: token1.symbol,
        amountIn: fillOrderArgs[1][1] as string,
        amountOut: fillOrderArgs[1][2] as string,
        recipient: fillOrderArgs[1][3] as string,
        startTime: fillOrderArgs[1][4] as string,
        endTime: fillOrderArgs[1][5] as string,
        stopPrice: fillOrderArgs[1][6] as string,
        oracleAddress: fillOrderArgs[1][7] as string,
        oracleData: fillOrderArgs[1][8] as string,
        v: Number(fillOrderArgs[1][10]),
        r: fillOrderArgs[1][11] as string,
        s: fillOrderArgs[1][12] as string,
        chainId: chainId,
      })

      const stopLossOrder: DerivedOrder = {
        id: `${id}`, // [TODO]
        tokenIn: new Token(chainId, token0.address, token0.decimals, token0.symbol, token0.name),
        tokenOut: new Token(chainId, token1.address, token1.decimals, token1.symbol, token1.name),
        limitOrder,
        filledPercent: '100', // [TODO]
        status,
        rate: new Price({ baseAmount: limitOrder.amountIn, quoteAmount: limitOrder.amountOut }),
      }

      return stopLossOrder
    },
    [limitOrderWrapperContract, tokens]
  )

  return {
    fetchRegistryHistory,
    fetchExecutedRegistryHistory,
    transform,
  }
}

export default useStopLossOrders
