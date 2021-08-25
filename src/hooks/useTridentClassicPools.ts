import {
  ConstantProductPool,
  Currency,
  CurrencyAmount,
  FACTORY_ADDRESS,
  Fee,
  Pair,
  computeConstantProductPoolAddress,
} from '@sushiswap/sdk'

import { Interface } from '@ethersproject/abi'
import { abi } from '@sushiswap/trident/artifacts/ConstantProductPool.json'
import { useMemo } from 'react'
import { useMultipleContractSingleData } from '../state/multicall/hooks'

const CONSTANT_PRODUCT_POOL_INTERFACE = new Interface(abi)

export enum ConstantProductPoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useTridentClassicPools(
  pools: [Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined][]
): [ConstantProductPoolState, ConstantProductPool | null][] {
  const poolAddresses = useMemo(
    () =>
      pools.map(([tokenA, tokenB, fee, twap]) => {
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          fee &&
          twap &&
          FACTORY_ADDRESS[tokenA.chainId]
          ? computeConstantProductPoolAddress({
              factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
              tokenA,
              tokenB,
              fee,
              twap,
            })
          : undefined
      }),
    [pools]
  )

  const results = useMultipleContractSingleData(poolAddresses, CONSTANT_PRODUCT_POOL_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]
      if (loading) return [ConstantProductPoolState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB) || !fee || !twap) return [ConstantProductPoolState.INVALID, null]
      if (!reserves) return [ConstantProductPoolState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        ConstantProductPoolState.EXISTS,
        new ConstantProductPool(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          twap
        ),
      ]
    })
  }, [results, pools])
}

export function useTridentClassicPool(
  tokenA?: Currency,
  tokenB?: Currency,
  fee?: Fee,
  twap?: boolean
): [ConstantProductPoolState, ConstantProductPool | null] {
  const inputs: [[Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined]] = useMemo(
    () => [[tokenA, tokenB, fee, twap]],
    [tokenA, tokenB, fee, twap]
  )
  return useTridentClassicPools(inputs)[0]
}
