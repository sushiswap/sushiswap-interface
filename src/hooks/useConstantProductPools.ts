import { Interface } from '@ethersproject/abi'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { default as constantProductPoolArtifact } from '@sushiswap/trident/artifacts/contracts/pool/ConstantProductPool.sol/ConstantProductPool.json'
import { computeConstantProductPoolAddress, ConstantProductPool, Fee } from '@sushiswap/trident-sdk'
import { PoolAtomType } from 'app/features/trident/types'
import { enumToArray } from 'app/functions/array/enumToArray'
import { useConstantProductPoolFactory } from 'app/hooks/useContract'
import combinate from 'combinate'
import { useMemo } from 'react'

import { useMultipleContractSingleData } from '../state/multicall/hooks'

const POOL_INTERFACE = new Interface(constantProductPoolArtifact.abi)

export enum ConstantProductPoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

type PoolInput = [Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined]

export function useConstantProductPoolsPermutations(currencies: [Currency | undefined, Currency | undefined][]) {
  const permutations = useMemo(() => {
    if (!currencies.length) return []
    return combinate({
      tokens: currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
      fee: enumToArray(Fee),
      twap: [true, false],
    }).map<PoolInput>(({ tokens: [tokenA, tokenB], fee, twap }) => [tokenA, tokenB, fee, twap])
  }, [currencies])

  return useConstantProductPools(permutations)
}

export function useConstantProductPools(pools: PoolInput[]): PoolAtomType[] {
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const poolsAddresses = useMemo(
    () =>
      pools.reduce<(string | undefined)[]>((acc, [tokenA, tokenB, fee, twap]) => {
        const address =
          tokenA &&
          tokenB &&
          fee &&
          twap !== undefined &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          constantProductPoolFactory?.address
            ? computeConstantProductPoolAddress({
                factoryAddress: constantProductPoolFactory.address,
                tokenA: tokenA.wrapped,
                tokenB: tokenB.wrapped,
                fee,
                twap,
              })
            : undefined

        acc.push(address && !acc.includes(address) ? address : undefined)
        return acc
      }, []),
    [constantProductPoolFactory?.address, pools]
  )

  const results = useMultipleContractSingleData(poolsAddresses, POOL_INTERFACE, 'getReserves')
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]
      if (loading) return { state: ConstantProductPoolState.LOADING }
      if (!reserves) return { state: ConstantProductPoolState.NOT_EXISTS }
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return { state: ConstantProductPoolState.INVALID }

      const { _reserve0: reserve0, _reserve1: reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return {
        state: ConstantProductPoolState.EXISTS,
        pool: new ConstantProductPool(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          twap
        ),
      }
    })
  }, [results, pools])
}

export function useConstantProductPool(tokenA?: Currency, tokenB?: Currency, fee?: Fee, twap?: boolean): PoolAtomType {
  const inputs: [PoolInput] = useMemo(() => [[tokenA, tokenB, fee, twap]], [tokenA, tokenB, fee, twap])
  return useConstantProductPools(inputs)[0]
}
