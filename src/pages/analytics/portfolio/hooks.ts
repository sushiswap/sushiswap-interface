import { useMemo } from 'react'
import { usePositions } from '../../../features/farm/hooks'
import { useActiveWeb3React } from '../../../hooks'
import {
  useEthPrice,
  useFarms,
  useKashiPairs,
  useLiquidityPositions,
  useSushiPairs,
  useTokens,
} from '../../../services/graph'

export function useUserPairs() {
  const { account } = useActiveWeb3React()

  const userPairs = useLiquidityPositions({
    where: {
      user: account?.toLowerCase(),
      liquidityTokenBalance_gt: '0',
    },
  })
  const pairsFiltered = useSushiPairs(
    userPairs ? { where: { id_in: userPairs.map((pair) => pair.pair.id) } } : undefined
  )
  const userPairsFormatted = useMemo(() => {
    return pairsFiltered && userPairs
      ? pairsFiltered.map((pair) => {
          const userPair = userPairs.find((p) => p.pair.id === pair.id)

          return {
            ...pair,
            userBalanceToken: Number(userPair.liquidityTokenBalance),
            userBalanceUSD: (pair.reserveUSD / pair.totalSupply) * userPair.liquidityTokenBalance,
          }
        })
      : []
  }, [pairsFiltered])

  return userPairsFormatted
}

export function useUserFarms() {
  const userPositions = usePositions()
  const farms = useFarms()

  const sushiPairs = useSushiPairs()
  const kashiPairs = useKashiPairs()

  const tokens = useTokens()
  const ethPrice = useEthPrice()

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
                userStakedUsd: sushiPair
                  ? ((sushiPair.reserveUSD / sushiPair.totalSupply) * position.amount) / 1e18
                  : 0,
              }
            })
            .filter((position) => position)
        : [],
    [userPositions, farms, sushiPairs, kashiPairs]
  )
  return userFarmsFormatted
}
