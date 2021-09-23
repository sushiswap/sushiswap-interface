import { ChainId, ChainKey, Currency, CurrencyAmount, FACTORY_ADDRESS, ONE } from '@sushiswap/core-sdk'
import TRIDENT from '@sushiswap/trident/exports/all.json'

import { computeHybridPoolAddress, Fee, HybridPool } from '@sushiswap/trident-sdk'
import { Interface } from '@ethersproject/abi'
import { abi } from '@sushiswap/trident/artifacts/contracts/pool/HybridPool.sol/HybridPool.json'
import { useMemo } from 'react'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'

console.log(
  TRIDENT[ChainId.KOVAN][ChainKey.KOVAN].contracts.HybridPoolFactory.address,
  'TRIDENT HYBRID POOL FCTORY ADDRESS'
)

const HYBRID_POOL_INTERFACE = new Interface(abi)

export enum HybridPoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useTridentHybridPools(
  pools: [Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined][]
): [HybridPoolState, HybridPool | null][] {
  const { chainId } = useActiveWeb3React()

  const poolAddresses = useMemo(() => {
    if (!chainId) return []

    return pools.map(([currencyA, currencyB, fee, twap]) => {
      if (!currencyA || !currencyB || currencyA === currencyB) return undefined

      const [tokenA, tokenB] = currencyA?.wrapped.sortsBefore(currencyB?.wrapped)
        ? [currencyA?.wrapped, currencyB?.wrapped]
        : [currencyB?.wrapped, currencyA?.wrapped]

      console.log(
        {
          factoryAddress: '0x4fbeDaEcb25C8094a5bd3b75CD51F02EC956Ad31',
          tokenA,
          tokenB,
          fee,
          twap,
        },
        computeHybridPoolAddress({
          factoryAddress: '0x4fbeDaEcb25C8094a5bd3b75CD51F02EC956Ad31',
          tokenA,
          tokenB,
          fee,
          // TODO: Jack - work out what this number is
          a: ONE,
        }),
        'HYBRID BABY'
      )

      return tokenA &&
        tokenB &&
        tokenA.chainId === tokenB.chainId &&
        !tokenA.equals(tokenB) &&
        fee &&
        twap &&
        TRIDENT[ChainId.KOVAN][ChainKey.KOVAN].contracts.HybridPoolFactory.address
        ? computeHybridPoolAddress({
            // TODO: Jack Fix
            factoryAddress: '0x4fbeDaEcb25C8094a5bd3b75CD51F02EC956Ad31',
            tokenA,
            tokenB,
            fee,
            // TODO: Jack - work out what this number is
            a: ONE,
          })
        : undefined
    })
  }, [pools])

  console.log({ poolAddresses })

  const results = useMultipleContractSingleData(poolAddresses, HYBRID_POOL_INTERFACE, 'getReserves')
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]
      if (loading) return [HybridPoolState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB) || !fee || !twap) return [HybridPoolState.INVALID, null]
      if (!reserves) return [HybridPoolState.NOT_EXISTS, null]
      const [reserve0, reserve1] = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        HybridPoolState.EXISTS,
        new HybridPool(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          ONE
        ),
      ]
    })
  }, [results, pools])
}

export function useTridentHybridPool(
  tokenA?: Currency,
  tokenB?: Currency,
  fee?: Fee,
  twap?: boolean
): [HybridPoolState, HybridPool | null] {
  const inputs: [[Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined]] = useMemo(
    () => [[tokenA, tokenB, fee, twap]],
    [tokenA, tokenB, fee, twap]
  )
  return useTridentHybridPools(inputs)[0]
}
