import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Token } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { getApy } from 'app/features/analytics/pairs/PairList'
import AssetBalances from 'app/features/portfolio/AssetBalances/AssetBalances'
import { useLegacyLPTableConfig } from 'app/features/portfolio/AssetBalances/liquidityPositions/useLegacyLPTableConfig'
import { useTridentLPTableConfig } from 'app/features/portfolio/AssetBalances/liquidityPositions/useTridentLPTableConfig'
import { useLiquidityPositions, useOneWeekBlock, useSushiPairs, useTridentLiquidityPositions } from 'app/services/graph'
import React, { useMemo } from 'react'

interface PositionBalances {
  account: string
  chainId: number | undefined
}

export const TridentLiquidityPositionsBalances = ({ account, chainId }: PositionBalances) => {
  const { data: positions } = useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const { config } = useTridentLPTableConfig({ positions, chainId })
  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`Trident`)}
      </Typography>
      <AssetBalances config={config} />
    </div>
  )
}

export const LegacyLiquidityPositionsBalances = ({ account, chainId }: PositionBalances) => {
  const positions = useLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), liquidityTokenBalance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

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

  const data = useMemo(
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
              value: (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD,
              apy: getApy(pair.volumeUSD - pair1w.volumeUSD, pair.reserveUSD),
            }
          })
        : undefined,
    [positions, pairs, pairs1w, chainId]
  )

  const { config } = useLegacyLPTableConfig(data)
  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`Legacy`)}
      </Typography>
      <AssetBalances config={config} />
    </div>
  )
}
