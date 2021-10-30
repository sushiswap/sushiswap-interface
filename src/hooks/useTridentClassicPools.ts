import { Interface } from '@ethersproject/abi'
import { ChainId, ChainKey, Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import ConstantProductPoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/ConstantProductPool.sol/ConstantProductPool.json'
import TRIDENT from '@sushiswap/trident/exports/all.json'
import { computeConstantProductPoolAddress, ConstantProductPool, Fee } from '@sushiswap/trident-sdk'
import { useMemo } from 'react'
import { useMultipleContractSingleData } from 'state/multicall/hooks'

import { useActiveWeb3React } from '../services/web3/hooks/useActiveWeb3React'

const CONSTANT_PRODUCT_POOL_INTERFACE = new Interface(ConstantProductPoolArtifact.abi)

export enum ConstantProductPoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useTridentClassicPools(
  pools: [Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined][]
): [ConstantProductPoolState, ConstantProductPool | null][] {
  const { chainId } = useActiveWeb3React()
  const poolAddresses = useMemo(() => {
    if (!chainId) return []

    return pools.map(([currencyA, currencyB, fee, twap]) => {
      if (!currencyA || !currencyB || currencyA === currencyB) return undefined

      const [tokenA, tokenB] = currencyA?.wrapped.sortsBefore(currencyB?.wrapped)
        ? [currencyA?.wrapped, currencyB?.wrapped]
        : [currencyB?.wrapped, currencyA?.wrapped]

      return tokenA &&
        tokenB &&
        tokenA.chainId === tokenB.chainId &&
        !tokenA.equals(tokenB) &&
        fee &&
        twap &&
        TRIDENT[ChainId.KOVAN][ChainKey.KOVAN].contracts.ConstantProductPoolFactory.address
        ? computeConstantProductPoolAddress({
            factoryAddress: TRIDENT[ChainId.KOVAN][ChainKey.KOVAN].contracts.ConstantProductPoolFactory.address,
            tokenA,
            tokenB,
            fee,
            twap,
          })
        : undefined
    })
  }, [chainId, pools])

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
      const [reserve0, reserve1] = reserves
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
