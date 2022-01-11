import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json'
import { useCallback, useEffect, useState } from 'react'

import { isAddress } from '../functions'
import { useContract } from './useContract'

const usePool = (poolAddress: string | undefined) => {
  const [poolData, setPoolData] = useState<any>({})
  const address = isAddress(poolAddress)
  const poolContract = useContract(address || undefined, IUniswapV2PairABI, false)

  const fetchPoolData = useCallback(async () => {
    const [reserves, token0, token1, totalSupply] = await Promise.all([
      poolContract?.getReserves(),
      poolContract?.token0(),
      poolContract?.token1(),
      poolContract?.totalSupply(),
    ])

    setPoolData({
      reserves,
      token0,
      token1,
      totalSupply,
    })
  }, [poolAddress])

  useEffect(() => {
    if (poolAddress) {
      fetchPoolData()
    }
  }, [poolAddress])

  return poolData
}

export default usePool
