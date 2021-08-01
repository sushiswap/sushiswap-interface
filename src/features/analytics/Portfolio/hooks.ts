import { ChainId } from '@sushiswap/sdk'
import { uniq } from 'lodash'
import { useMemo } from 'react'
import { usePositions } from '../../../features/farm/hooks'
import { getFraction } from '../../../functions'
import { chainsWithFeature, Feature } from '../../../functions/feature'
import { useActiveWeb3React } from '../../../hooks'
import {
  useFarms,
  useUserKashiPairs as useGetUserKashiPairs,
  useLiquidityPositions,
  useNativePrice,
  useSushiPairs,
  useTokens,
  useBentoUserTokens as useGetBentoUserTokens,
  useKashiPairs,
} from '../../../services/graph'
import { useAssets } from './../../../services/zerion/hooks'

export function useAllUserPairs() {
  let pairs = []
  for (const chainId of chainsWithFeature(Feature.AMM)) {
    pairs = [...pairs, ...useUserPairs(ChainId[chainId])]
  }
  return pairs
}

export function useUserPairs(chainId = undefined) {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected

  const userPairs = useLiquidityPositions(
    {
      where: {
        user: account?.toLowerCase(),
        liquidityTokenBalance_gt: '0',
      },
    },
    chainId
  )
  const pairsFiltered = useSushiPairs(
    userPairs ? { where: { id_in: userPairs.map((pair) => pair.pair.id) } } : undefined,
    undefined,
    chainId
  )
  const userPairsFormatted = useMemo(() => {
    return pairsFiltered && userPairs
      ? pairsFiltered.map((pair) => {
          const userPair = userPairs.find((p) => p.pair.id === pair.id)

          return {
            ...pair,
            userBalanceToken: Number(userPair.liquidityTokenBalance),
            userBalanceUSD: (pair.reserveUSD / pair.totalSupply) * userPair.liquidityTokenBalance,
            chain: ChainId[chainId],
          }
        })
      : []
  }, [pairsFiltered])

  return userPairsFormatted
}

export function useAllUserFarms() {
  let farms = []
  for (const chainId of chainsWithFeature(Feature.LIQUIDITY_MINING)) {
    farms = [...farms, ...useUserFarms(ChainId[chainId])]
  }
  return farms
}

export function useUserFarms(chainId = undefined) {
  const { chainId: chainIdSelected } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected

  const userPositions = usePositions(chainId)
  const farms = useFarms(undefined, chainId)

  const sushiPairs = useSushiPairs(undefined, undefined, chainId)
  const kashiPairs = useKashiPairs(undefined, chainId)

  const nativePrice = useNativePrice(undefined, chainId)

  const userFarmsFormatted = useMemo(
    () =>
      userPositions && farms && sushiPairs && kashiPairs
        ? userPositions
            .map((position) => {
              const farm = farms.find((f) => f.chef === position.chef && f.id === position.id)
              if (!farm) return undefined
              const sushiPair = sushiPairs.find((pair) => pair.id === farm.pair)
              const kashiPair = kashiPairs.find((pair) => pair.id === farm.pair)

              return {
                ...farm,
                type: sushiPair ? 'lp' : kashiPair ? 'kashi' : 'unknown',
                userStakedToken: position.amount / 1e18,
                userStakedUSD: sushiPair
                  ? ((sushiPair.reserveUSD / sushiPair.totalSupply) * position.amount) / 1e18
                  : (position.amount / getFraction(kashiPair) / 10 ** kashiPair.token0.decimals) *
                    kashiPair.token0.derivedETH *
                    nativePrice,
                chain: ChainId[chainId],
              }
            })
            .filter((position) => position)
        : [],
    [userPositions, farms, sushiPairs, kashiPairs]
  )
  return userFarmsFormatted
}

export function useAllBentoUserTokens() {
  let tokens = []
  for (const chainId of chainsWithFeature(Feature.BENTOBOX)) {
    tokens = [...tokens, ...useBentoUserTokens(ChainId[chainId])]
  }
  return tokens
}

export function useBentoUserTokens(chainId = undefined) {
  const { chainId: chainIdSelected } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected

  const bentoUserTokens = useGetBentoUserTokens(undefined, chainId)

  const tokens = useTokens(undefined, undefined, chainId)

  const nativePrice = useNativePrice(undefined, chainId)

  return useMemo(() => {
    return bentoUserTokens && tokens && nativePrice
      ? bentoUserTokens.map((bentoToken) => {
          const token = tokens.find((t) => t.id === bentoToken.id)

          return {
            ...bentoToken,
            valueUSD: (bentoToken.amount * token?.derivedETH * nativePrice) / 10 ** token?.decimals ?? 0,
            chain: ChainId[chainId],
          }
        })
      : []
  }, [bentoUserTokens, tokens, nativePrice])
}

export function useAllUserKashiPairs() {
  let pairs = []
  for (const chainId of chainsWithFeature(Feature.BENTOBOX)) {
    pairs = [...pairs, ...useUserKashiPairs(ChainId[chainId])]
  }
  return pairs
}

export function useUserKashiPairs(chainId = undefined) {
  const userKashiPairs = useGetUserKashiPairs(undefined, chainId)

  const kashiTokenAddresses = useMemo(
    () =>
      userKashiPairs
        ? uniq([
            ...userKashiPairs.map((userPair) => userPair.pair.asset.id),
            ...userKashiPairs.map((userPair) => userPair.pair.collateral.id),
          ])
        : [],
    [userKashiPairs]
  )

  const tokens = useTokens({ where: { id_in: kashiTokenAddresses } }, undefined, chainId)

  const nativePrice = useNativePrice(undefined, chainId)

  return useMemo(() => {
    return userKashiPairs && tokens && nativePrice
      ? userKashiPairs.map((userPair) => {
          const asset = tokens.find((t) => t.id === userPair.pair.asset.id)
          const collateral = tokens.find((t) => t.id === userPair.pair.collateral.id)

          const assetValueUSD = (userPair.assetAmount / 10 ** asset.decimals) * asset.derivedETH * nativePrice
          const borrowedValueUSD = (userPair.borrowAmount / 10 ** asset.decimals) * asset.derivedETH * nativePrice
          const collateralValueUSD =
            (userPair.collateralAmount / 10 ** collateral.decimals) * collateral.derivedETH * nativePrice

          return {
            ...userPair,
            assetValueUSD,
            borrowedValueUSD,
            collateralValueUSD,
            valueUSD: assetValueUSD + collateralValueUSD - borrowedValueUSD,
            chain: ChainId[chainId],
          }
        })
      : []
  }, [userKashiPairs, tokens, nativePrice])
}

export function useUserAssets() {
  const assets = useAssets()

  return useMemo(() => {
    return assets
      ? assets
          .map((asset) => {
            const price = asset.price?.value ?? asset.value ?? 0
            return {
              token: asset.asset_code,
              symbol: asset.symbol,
              amount: asset.quantity,
              chain: asset.network,
              type: asset.type,
              valueUSD: (price * asset.quantity) / 10 ** asset.decimals,
            }
          })
          .filter((asset) => asset.valueUSD !== 0)
          .filter((asset) => asset.type !== 'sushi') // covered by useUserPairs
      : []
  }, [assets])
}
