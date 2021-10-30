import { Interface } from '@ethersproject/abi'
import { ChainId, ChainKey, Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { default as constantProductPoolArtifact } from '@sushiswap/trident/artifacts/contracts/pool/ConstantProductPool.sol/ConstantProductPool.json'
import all from '@sushiswap/trident/exports/all.json'
import { computeConstantProductPoolAddress,ConstantProductPool, Pool, PoolState } from '@sushiswap/trident-sdk'
import combinate from 'combinate'
import { useMemo } from 'react'

import { useMultipleContractSingleData } from '../state/multicall/hooks'

const POOL_INTERFACE = new Interface(constantProductPoolArtifact.abi)

export function useConstantProductPools(
  currencies: [Currency | undefined, Currency | undefined][]
): [PoolState, Pool | null][] {
  const permutations = useMemo(() => {
    if (!currencies.length) return []
    return combinate({
      tokens: currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
      fee: [30],
      twap: [true, false],
    })
  }, [currencies])

  const pools = useMemo(
    () =>
      permutations.map(({ tokens: [tokenA, tokenB], fee, twap }) => {
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          all[ChainId.KOVAN][ChainKey.KOVAN].contracts.ConstantProductPoolFactory.address
          ? computeConstantProductPoolAddress({
              factoryAddress: all[ChainId.KOVAN][ChainKey.KOVAN].contracts.ConstantProductPoolFactory.address,
              tokenA,
              tokenB,
              fee,
              twap,
            })
          : undefined
      }),
    [permutations]
  )

  const results = useMultipleContractSingleData(pools, POOL_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      if (loading) return [PoolState.LOADING, null]
      if (!reserves) return [PoolState.NOT_EXISTS, null]
      const {
        tokens: [tokenA, tokenB],
        fee,
        twap,
      } = permutations[i]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PoolState.INVALID, null]
      const { _reserve0: reserve0, _reserve1: reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PoolState.EXISTS,
        new ConstantProductPool(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          twap
        ),
      ]
    })
  }, [permutations, results])
}

export function useConstantProductPool(tokenA?: Currency, tokenB?: Currency): [PoolState, Pool | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useConstantProductPools(inputs)[0]
}
