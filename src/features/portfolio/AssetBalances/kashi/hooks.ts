import { AddressZero } from '@ethersproject/constants'
import { Currency, CurrencyAmount, JSBI, Token } from '@sushiswap/core-sdk'
import { useKashiPairAddresses, useKashiPairs } from 'app/features/kashi/hooks'
import useSearchAndSort from 'app/hooks/useSearchAndSort'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

export const reduceBalances = (balanceSources: CurrencyAmount<Currency>[]) =>
  Object.values(
    balanceSources.reduce<Record<string, CurrencyAmount<Currency>>>((acc, cur) => {
      if (cur.currency.isNative) {
        if (acc[AddressZero]) acc[AddressZero] = acc[AddressZero].add(cur)
        else acc[AddressZero] = cur
      } else if (acc[cur.currency.wrapped.address]) {
        acc[cur.currency.wrapped.address] = acc[cur.currency.wrapped.address].add(cur)
      } else {
        acc[cur.currency.wrapped.address] = cur
      }

      return acc
    }, {})
  )

export const useKashiBorrowPositions = (pairs: any[]) =>
  useSearchAndSort(
    pairs.filter((pair: any) => pair.userCollateralShare.gt(0) || pair.userBorrowPart.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'health.value', direction: 'descending' }
  )

export const useKashiLendPositions = (pairs: any[]) =>
  useSearchAndSort(
    pairs.filter((pair) => pair.userAssetFraction.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'currentUserAssetAmount.usdValue', direction: 'descending' }
  )

const useBorrowPositionAmounts = () => {
  const { chainId } = useActiveWeb3React()
  const addresses = useKashiPairAddresses()
  const pairs = useKashiPairs(addresses)

  return useKashiBorrowPositions(pairs)
    .items.map((item) => {
      if (!chainId) return undefined

      const borrowedAsset = new Token(chainId, item.asset.address, item.asset.tokenInfo.decimals, item.asset.symbol)
      const borrowedAssetAmount = JSBI.BigInt(item.currentUserBorrowAmount.value.toString())
      return CurrencyAmount.fromRawAmount(borrowedAsset, borrowedAssetAmount)
    })
    .filter(Boolean) as CurrencyAmount<Token>[]
}

type PairWithAmount = {
  pair: any
  amount: CurrencyAmount<Token>
}

export const useLendPositionAmounts = (): PairWithAmount[] => {
  const { chainId } = useActiveWeb3React()
  const addresses = useKashiPairAddresses()
  const pairs = useKashiPairs(addresses)

  return useKashiLendPositions(pairs)
    .items.map((item) => {
      if (!chainId) return undefined

      const lentAsset = new Token(chainId, item.asset.address, item.asset.tokenInfo.decimals, item.asset.symbol)
      const lentAssetAmount = JSBI.BigInt(item.currentUserAssetAmount.value.toString())
      return {
        pair: item,
        amount: CurrencyAmount.fromRawAmount(lentAsset, lentAssetAmount),
      }
    })
    .filter(Boolean) as PairWithAmount[]
}

export const useCollateralPositionAmounts = (): PairWithAmount[] => {
  const { chainId } = useActiveWeb3React()
  const addresses = useKashiPairAddresses()
  const pairs = useKashiPairs(addresses)

  return useKashiBorrowPositions(pairs)
    .items.map((item) => {
      if (!chainId) return undefined

      const collateralAsset = new Token(
        chainId,
        item.collateral.address,
        item.collateral.tokenInfo.decimals,
        item.collateral.symbol
      )
      const collateralAssetAmount = JSBI.BigInt(item.userCollateralAmount.value.toString())
      return {
        pair: item,
        amount: CurrencyAmount.fromRawAmount(collateralAsset, collateralAssetAmount),
      }
    })
    .filter(Boolean) as PairWithAmount[]
}

export function useKashiPositions() {
  const borrowPositionAmounts = useBorrowPositionAmounts()
  const lentPositions = useLendPositionAmounts()
  const lentPositionAmounts = lentPositions.map((p) => p.amount)

  const collateralPositions = useCollateralPositionAmounts()
  const collateralPositionAmounts = collateralPositions.map((p) => p.amount)

  const kashiBalances = useMemo(
    () => reduceBalances([...collateralPositionAmounts, ...lentPositionAmounts]),
    [collateralPositionAmounts, lentPositionAmounts]
  )

  return useMemo(
    () => ({
      borrowed: borrowPositionAmounts,
      collateral: collateralPositionAmounts,
      lent: lentPositionAmounts,
      kashiBalances,
    }),
    [borrowPositionAmounts, collateralPositionAmounts, kashiBalances, lentPositionAmounts]
  )
}
