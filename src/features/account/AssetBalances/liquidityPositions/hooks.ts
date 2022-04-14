import { Token } from '@sushiswap/core-sdk'
import { AllPoolType } from 'app/features/trident/types'
import { getApy } from 'app/functions'
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

export function useTridentLiquidityPositionsBalances({ account, chainId }: PositionBalances) {
  return useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  }).data
}

export function useLegacyLiquidityPositionsBalances({ account, chainId }: PositionBalances) {
  const { data: block1w } = useOneWeekBlock({ chainId })
  const positions = useLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), liquidityTokenBalance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  }) as any[]

  const { data: pairs } = useSushiPairs({
    chainId,
    variables: { where: { id_in: positions?.map((position: any) => position.pair.id) } },
    shouldFetch: !!positions,
  })
  const { data: pairs1w } = useSushiPairs({
    chainId,
    variables: {
      block: block1w,
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

            return {
              id: position.id,
              assets: [pair.token0, pair.token1].map(
                (token: any) => new Token(chainId!, token.id, Number(token.decimals), token.symbol, token.name)
              ),
              type: AllPoolType.Legacy,
              swapFeePercent: 0.3,
              twapEnabled: true,
              value: (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD,
              apy: getApy({ volume: pair.volumeUSD - pair1w.volumeUSD, liquidity: pair.reserveUSD, days: 7 }),
            }
          })
        : undefined,
    [positions, pairs, pairs1w, chainId]
  ) as TridentPositionRow[] | undefined
}
