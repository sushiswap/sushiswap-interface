import { Token } from '@sushiswap/core-sdk'
import { PoolType } from '@sushiswap/trident-sdk'
import { aprToApy, formatPercent } from 'app/functions'
import {
  TridentPositionRow,
  useLiquidityPositions,
  useOneWeekBlock,
  useSushiPairs,
  useTridentLiquidityPositions,
} from 'app/services/graph'
import { useMemo } from 'react'

interface PositionBalances {
  account: string
  chainId: number | undefined
}

export const getApy = (volume: number, liquidity: number) => {
  const apy = aprToApy((((volume / 7) * 365 * 0.0025) / liquidity) * 100, 3650)
  if (apy > 1000) return '>10,000%'
  return formatPercent(apy)
}

export function useTridentLiquidityPositionsBalances({ account, chainId }: PositionBalances) {
  return useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  }).data
}

export function useLegacyLiquidityPositionsBalances({ account, chainId }: PositionBalances) {
  const positions = useLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), liquidityTokenBalance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  }) as any[]

  const pairs = useSushiPairs({
    chainId,
    variables: { where: { id_in: positions?.map((position: any) => position.pair.id) } },
    shouldFetch: !!positions,
  })
  const pairs1w = useSushiPairs({
    chainId,
    variables: {
      block: useOneWeekBlock({ chainId }),
      where: { id_in: positions?.map((position: any) => position.pair.id) },
    },
    shouldFetch: !!positions,
  })

  return useMemo(
    () =>
      !!positions && !!pairs
        ? positions.map((position: any) => {
            const pair = pairs.find((pair: any) => pair.id === position.pair.id)
            const pair1w = pairs1w?.find((pair: any) => pair.id === position.pair.id) ?? pair

            console.log(pair.volumeUSD - pair1w.volumeUSD, pairs1w, pair.reserveUSD)

            return {
              id: position.id,
              assets: [pair.token0, pair.token1].map(
                (token: any) => new Token(chainId!, token.id, Number(token.decimals), token.symbol, token.name)
              ),
              type: PoolType.ConstantProduct,
              swapFeePercent: 0.3,
              twapEnabled: true,
              value: (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD,
              apy: getApy(pair.volumeUSD - pair1w.volumeUSD, pair.reserveUSD),
              legacy: true,
            }
          })
        : undefined,
    [positions, pairs, pairs1w, chainId]
  ) as TridentPositionRow[] | undefined
}
