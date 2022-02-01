import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import AssetBalances from 'app/features/trident/balances/AssetBalances/AssetBalances'
import { Assets } from 'app/features/trident/balances/AssetBalances/types'
import { useLPTableConfig } from 'app/features/trident/balances/AssetBalances/useLPTableConfig'
import { setBalancesState } from 'app/features/trident/balances/balancesSlice'
import { ActiveModal } from 'app/features/trident/types'
import { useTridentLiquidityPositions } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalancesV2 } from 'app/state/bentobox/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { useCallback, useMemo } from 'react'

import { useTableConfig } from './useTableConfig'

export const LiquidityPositionsBalances = () => {
  const { account, chainId } = useActiveWeb3React()

  const { data: positions } = useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const { config } = useLPTableConfig(positions)
  return <AssetBalances config={config} />
}

export const BentoBalances = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const balances = useBentoBalancesV2()
  const assets = balances.reduce<Assets[]>((acc, el) => {
    if (el) acc.push({ asset: el })
    return acc
  }, [])

  const handleRowClick = useCallback(
    (row) => {
      const { currency } = row.values.asset
      dispatch(
        setBalancesState({
          currency: currency.isNative ? 'ETH' : row.values.asset.currency.address,
          activeModal: ActiveModal.MENU,
        })
      )
    },
    [dispatch]
  )

  const { config } = useTableConfig(assets, balances.length === 0 && !!account)

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`BentoBox`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}

export const WalletBalances = () => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { data: _balances, loading } = useAllTokenBalancesWithLoadingIndicator()

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

  const balances = useMemo(() => {
    const res = Object.values(_balances).reduce<Assets[]>((acc, cur) => {
      if (cur.greaterThan(ZERO)) acc.push({ asset: cur })

      return acc
    }, [])

    if (ethBalance) {
      res.push({ asset: ethBalance })
    }
    return res
  }, [_balances, ethBalance])
  const { config } = useTableConfig(balances, loading)

  const handleRowClick = useCallback(
    (row) => {
      const { currency } = row.values.asset
      dispatch(
        setBalancesState({
          currency: currency.isNative ? 'ETH' : row.values.asset.currency.address,
          activeModal: ActiveModal.MENU,
        })
      )
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`Wallet`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}
