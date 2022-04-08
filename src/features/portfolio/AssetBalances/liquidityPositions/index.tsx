import AssetBalances from 'app/features/portfolio/AssetBalances/AssetBalances'
import { useTridentLPTableConfig } from 'app/features/portfolio/AssetBalances/liquidityPositions/useTridentLPTableConfig'
import { useTridentLiquidityPositions } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'

export const LiquidityPositionsBalances = () => {
  const { account, chainId } = useActiveWeb3React()

  const { data: positions } = useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const { config } = useTridentLPTableConfig(positions)
  return <AssetBalances config={config} />
}
