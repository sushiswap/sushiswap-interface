import { Interface } from '@ethersproject/abi'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { default as constantProductPoolArtifact } from '@sushiswap/trident/artifacts/contracts/pool/ConstantProductPool.sol/ConstantProductPool.json'
import { computeConstantProductPoolAddress, ConstantProductPool, Fee } from '@sushiswap/trident-sdk'
import { enumToArray } from 'app/functions/array/enumToArray'
import { useConstantProductPoolFactory } from 'app/hooks/useContract'
import { ConstantProductPoolState } from 'app/hooks/useTridentClassicPools'
import combinate from 'combinate'
import { useMemo } from 'react'

import { useMultipleContractSingleData } from '../state/multicall/hooks'

const POOL_INTERFACE = new Interface(constantProductPoolArtifact.abi)

export function useConstantProductPools(
  currencies: [Currency | undefined, Currency | undefined][]
): [ConstantProductPoolState, ConstantProductPool | null][] {
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const permutations = useMemo(() => {
    if (!currencies.length) return []
    return combinate({
      tokens: currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
      fee: enumToArray(Fee),
      twap: [true, false],
    })
  }, [currencies])

  const pools = useMemo(
    () =>
      permutations.reduce<(string | undefined)[]>((acc, { tokens: [tokenA, tokenB], fee, twap }) => {
        const address =
          tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          constantProductPoolFactory?.address
            ? computeConstantProductPoolAddress({
                factoryAddress: constantProductPoolFactory.address,
                tokenA,
                tokenB,
                fee,
                twap,
              })
            : undefined

        acc.push(address && !acc.includes(address) ? address : undefined)
        return acc
      }, []),
    [constantProductPoolFactory?.address, permutations]
  )

  const results = useMultipleContractSingleData(pools, POOL_INTERFACE, 'getReserves')
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      if (loading) return [ConstantProductPoolState.LOADING, null]
      if (!reserves) return [ConstantProductPoolState.NOT_EXISTS, null]
      const {
        tokens: [tokenA, tokenB],
        fee,
        twap,
      } = permutations[i]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [ConstantProductPoolState.INVALID, null]
      const { _reserve0: reserve0, _reserve1: reserve1 } = reserves
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
  }, [permutations, results])
}

export function useConstantProductPool(
  tokenA?: Currency,
  tokenB?: Currency
): [ConstantProductPoolState, ConstantProductPool | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useConstantProductPools(inputs)[0]
}
