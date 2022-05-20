import { STOP_LIMIT_ORDER_WRAPPER_ADDRESSES } from 'app/constants/autonomy'
import { useAutonomyLimitOrderWrapperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import Moralis from 'moralis'
import { useCallback, useEffect, useState } from 'react'

interface StopLossOrder {
  id: string | number
  tokenIn: string
  tokenOut: string
  stopRate: string
  limitRate: string
}

interface State {
  totalOrders: number
  loading: boolean
  data: StopLossOrder[]
}

const useStopLossOrders = () => {
  const { account, chainId } = useActiveWeb3React()
  const limitOrderWrapperContract = useAutonomyLimitOrderWrapperContract()

  const [state, setState] = useState<State>({
    totalOrders: 0,
    loading: true,
    data: [],
  })

  const fetchRegistryHistory = useCallback(async () => {
    console.log('Fetching registry history ...')

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
  }, [account, chainId])

  const transform = (callData: string, id: number) => {
    const fillOrderArgs = limitOrderWrapperContract?.interface.decodeFunctionData('fillOrder', callData)

    const stopLossOrder: StopLossOrder = {
      id,
      tokenIn: fillOrderArgs && fillOrderArgs[2],
      tokenOut: fillOrderArgs && fillOrderArgs[3],
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

    initializeOrdersData()
  }, [account, chainId])

  return state
}

export default useStopLossOrders
