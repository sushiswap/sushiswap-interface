import { Token } from '@sushiswap/core-sdk'
import DEFAULT_TOKEN_LIST from '@sushiswap/default-token-list'
import { STOP_LIMIT_ORDER_WRAPPER_ADDRESSES } from 'app/constants/autonomy'
import { useAutonomyLimitOrderWrapperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import Moralis from 'moralis'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

interface StopLossOrder {
  id: string | number
  tokenIn: Token | undefined
  tokenOut: Token | undefined
  stopRate: string
  limitRate: string
}

interface State {
  totalOrders: number
  loading: boolean
  data: Array<StopLossOrder | undefined>
}

const useStopLossOrders = () => {
  const { account, chainId } = useActiveWeb3React()
  const limitOrderWrapperContract = useAutonomyLimitOrderWrapperContract()

  const [state, setState] = useState<State>({
    totalOrders: 0,
    loading: true,
    data: [],
  })

  const tokens = useMemo(
    () => (DEFAULT_TOKEN_LIST as ITokenList).tokens.filter((token) => token.chainId === chainId),
    [chainId]
  )

  const fetchRegistryHistory = useCallback(async () => {
    console.log('Fetching registry history ...')
    try {
      Moralis.initialize(process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY || '')
      Moralis.serverURL = process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_SERVER_URL || ''

      const bscRequests = new Moralis.Query('RegistryRequests')
      bscRequests.equalTo('user', account?.toLowerCase())
      bscRequests.equalTo('target', chainId && STOP_LIMIT_ORDER_WRAPPER_ADDRESSES[chainId].toLowerCase())
      let registryRequests = await bscRequests.find()

      console.log('Requests: ', registryRequests)

      return await Promise.all(
        registryRequests.map(async (request) => {
          return request.get('callData')
        })
      )
    } catch (e) {
      return []
    }
  }, [account, chainId])

  const transform = (callData: string, id: number): StopLossOrder | undefined => {
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
  }

  useEffect(() => {
    const initializeOrdersData = async () => {
      const callDataHistory: string[] = await fetchRegistryHistory()

      const fillOrderData = callDataHistory.map((callData, index) => transform(callData, index))

      setState({
        totalOrders: fillOrderData.length,
        loading: false,
        data: fillOrderData,
      })
    }
    if (chainId) {
      initializeOrdersData()
    }
  }, [account, chainId])

  return state
}

export default useStopLossOrders
