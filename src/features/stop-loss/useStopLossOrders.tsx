import { Token } from '@sushiswap/core-sdk'
import DEFAULT_TOKEN_LIST from '@sushiswap/default-token-list'
import { MORALIS_INFO, STOP_LIMIT_ORDER_WRAPPER_ADDRESSES } from 'app/constants/autonomy'
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

export interface StopLossOrder {
  id: string | number
  tokenIn: Token | undefined
  tokenOut: Token | undefined
  stopRate: string
  limitRate: string
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
    (callData: string, id: number): StopLossOrder | undefined => {
      if (!chainId) return

      const fillOrderArgs = limitOrderWrapperContract?.interface.decodeFunctionData('fillOrder', callData)
      const token0 = fillOrderArgs && tokens.find((token) => token.address === fillOrderArgs[2])
      const token1 = fillOrderArgs && tokens.find((token) => token.address === fillOrderArgs[3])
      const stopLossOrder: StopLossOrder = {
        id,
        tokenIn: token0 && new Token(chainId, token0.address, token0.decimals, token0.symbol, token0.name),
        tokenOut: token1 && new Token(chainId, token1.address, token1.decimals, token1.symbol, token1.name),
        stopRate: '',
        limitRate: '',
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
