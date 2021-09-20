import { Currency, CurrencyAmount, FACTORY_ADDRESS, JSBI } from '@sushiswap/core-sdk'
import TRIDENT from '@sushiswap/trident/exports/all.json'

import { Fee, HybridPool } from '@sushiswap/trident-sdk'
import { Interface } from '@ethersproject/abi'
import abi from '../constants/abis/constant-product-pool.json'
import { useMemo } from 'react'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'

const CONSTANT_PRODUCT_POOL_INTERFACE = new Interface(abi)

export enum HybridPoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useTridentHybridPools(
  pools: [Currency | undefined, Currency | undefined, Fee | undefined, JSBI | undefined][]
): [HybridPoolState, HybridPool | null][] {
  const { chainId } = useActiveWeb3React()
  const poolAddresses = useMemo(() => {
    if (!chainId) return []

    return pools.map(([currencyA, currencyB, fee, twap]) => {
      if (!currencyA || !currencyB || currencyA === currencyB) return undefined

      const [tokenA, tokenB] = currencyA?.wrapped.sortsBefore(currencyB?.wrapped)
        ? [currencyA?.wrapped, currencyB?.wrapped]
        : [currencyB?.wrapped, currencyA?.wrapped]

      // console.log(
      //   computeConstantProductPoolAddress({
      //     // TODO Ramin:
      //     factoryAddress: TRIDENT[`${chainId}`]['kovan'].contracts.ConstantProductPoolFactory.address,
      //     tokenA,
      //     tokenB,
      //     fee,
      //     twap,
      //   })
      // )

      return tokenA &&
        tokenB &&
        tokenA.chainId === tokenB.chainId &&
        !tokenA.equals(tokenB) &&
        fee &&
        twap &&
        FACTORY_ADDRESS[tokenA.chainId]
        ? '0x9a5bb67bba24c6e64c3c05e3a73e89d2e029080a'
        : // // : // TODO ramin: hardcoded
          // computeConstantProductPoolAddress({
          //   factoryAddress: CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS,
          //   tokenA,
          //   tokenB,
          //   fee,
          //   twap,
          // })
          undefined
    })
  }, [chainId, pools])

  const results = useMultipleContractSingleData(poolAddresses, CONSTANT_PRODUCT_POOL_INTERFACE, 'getReserves')
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const a = pools[i]?.[3]
      if (loading) return [HybridPoolState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB) || !fee || !a) return [HybridPoolState.INVALID, null]
      if (!reserves) return [HybridPoolState.NOT_EXISTS, null]
      const [reserve0, reserve1] = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        HybridPoolState.EXISTS,
        new HybridPool(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          a
        ),
      ]
    })
  }, [results, pools])
}

export function useTridentHybridPool(
  tokenA?: Currency,
  tokenB?: Currency,
  fee?: Fee,
  a?: JSBI
): [HybridPoolState, HybridPool | null] {
  const inputs: [[Currency | undefined, Currency | undefined, Fee | undefined, JSBI | undefined]] = useMemo(
    () => [[tokenA, tokenB, fee, a]],
    [tokenA, tokenB, fee, a]
  )
  return useTridentHybridPools(inputs)[0]
}
