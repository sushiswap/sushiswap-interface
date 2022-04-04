import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import AssetBalances from 'app/features/portfolio/AssetBalances/AssetBalances'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { setBalancesState } from 'app/features/portfolio/portfolioSlice'
import { ActiveModal } from 'app/features/trident/types'
import { useBentoStrategies } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalancesV2ForAccount } from 'app/state/bentobox/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useCallback, useMemo } from 'react'

import { useBasicTableConfig } from '../useBasicTableConfig'
import { useBentoBoxTableConfig } from '../useBentoBoxTableConfig'
export const BentoBalances = ({ account }: { account: string }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()

  const { data: balances, loading } = useBentoBalancesV2ForAccount(account)

  const tokens = useMemo(() => balances.map((balance) => balance.currency.address.toLowerCase()), [balances])

  const strategies = useBentoStrategies({
    chainId,
    shouldFetch: !!chainId && !loading && balances.length > 0,
    variables: { where: { token_in: tokens } },
  })

  const assets = useMemo(
    () =>
      balances.reduce<Assets[]>((previousValue, currentValue) => {
        const strategy = strategies?.find((strategy) => strategy.token === currentValue.currency.address.toLowerCase())
        return [...previousValue, { asset: currentValue, strategy }]
      }, []),
    [balances, strategies]
  )

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

  const { config } = useBentoBoxTableConfig(assets, loading)

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`BentoBox`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}

export const WalletBalances: FC<{ account: string }> = ({ account }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [tokenBalances, loading] = useAllTokenBalancesWithLoadingIndicator(account)

  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

  const balances = useMemo(() => {
    return Object.values(tokenBalances).reduce<Assets[]>(
      (previousValue, currentValue) => {
        if (currentValue && currentValue.greaterThan(ZERO)) {
          return [...previousValue, { asset: currentValue }]
        }

        return previousValue
      },
      ethBalance ? [{ asset: ethBalance }] : []
    )
  }, [tokenBalances, ethBalance])

  const { config } = useBasicTableConfig(balances, loading)

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
