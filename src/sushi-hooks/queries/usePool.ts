import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import IUniswapV2PairABI from '@sushiswap/core/build/abi/IUniswapV2Pair.json'
import { useActiveWeb3React } from '../../hooks'
import { useContract } from '../useContract'
import { useBlockNumber } from '../../state/application/hooks'

// Data we want
// Reserves
// token0
// token1
// totalSupply

const usePool = (poolAddress: string) => {
  const [poolData, setPoolData] = useState<any>({});

  const poolContract = useContract(poolAddress, IUniswapV2PairABI, false)

  const fetchPoolData = useCallback(async () => {
    const [
      reserves,
      token0,
      token1, 
      totalSupply
    ] = await Promise.all([
      poolContract?.reserves(),
      poolContract?.token0(),
      poolContract?.token1(),
      poolContract?.totalSupply(),
    ])

    setPoolData({
      reserves,
      token0,
      token1, 
      totalSupply
    })
  }, [poolAddress])

  return poolData
}

export default usePool
