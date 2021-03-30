import { useActiveWeb3React } from 'hooks'
import React, { useCallback, useState } from 'react'
import { KashiPair } from 'kashi'
import { useKashiPairContract } from 'sushi-hooks/useContract'

function useKashiCooker(pair: KashiPair) {
  const { account, chainId, library } = useActiveWeb3React()

  const kashiPairContract = useKashiPairContract()

  const [actions, setActions] = useState([])
  const [values, setValues] = useState([])
  const [data, setData] = useState([])

  const approve = useCallback(async () => {
    //
  }, [])

  const addCollateral = useCallback(async value => {
    //
  }, [])

  const depositCollateral = useCallback(async value => {
    //
  }, [])

  const addAsset = useCallback(async value => {
    //
  }, [])

  const borrow = useCallback(async value => {
    //
  }, [])

  const cook = useCallback(() => {
    if (kashiPairContract) {
      return kashiPairContract.cook(actions, values, data)
    }
  }, [kashiPairContract, actions, values, data])

  return { approve, addCollateral, depositCollateral, addAsset, borrow, cook }
}

export default useKashiCooker
