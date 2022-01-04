import { NATIVE, ZERO } from '@sushiswap/core-sdk'
import AssetBalances from 'app/features/trident/balances/AssetBalances/AssetBalances'
import { Assets } from 'app/features/trident/balances/AssetBalances/types'
import { useLPTableConfig } from 'app/features/trident/balances/AssetBalances/useLPTableConfig'
import { ActiveModalAtom, SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import { useTridentLiquidityPositions } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalancesV2 } from 'app/state/bentobox/hooks'
import { useAllTokenBalances, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { useCallback, useMemo } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { useTableConfig } from './useTableConfig'

export const LiquidityPositionsBalances = () => {
  const { account, chainId } = useActiveWeb3React()

  const {
    data: positions,
    isValidating,
    error,
  } = useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const { config } = useLPTableConfig(positions)
  return <AssetBalances config={config} loading={isValidating} error={error} />
}

export const BentoBalances = () => {
  const [selected, setSelected] = useRecoilState(SelectedCurrencyAtom)
  const setActiveModal = useSetRecoilState(ActiveModalAtom)
  const balances = useBentoBalancesV2()
  const assets = balances.reduce<Assets[]>((acc, el) => {
    if (el) acc.push({ asset: el })
    return acc
  }, [])

  const handleRowClick = useCallback(
    (row) => {
      setSelected(row.values.asset.currency)
      setActiveModal(ActiveModal.MENU)
    },
    [setActiveModal, setSelected]
  )

  const { config } = useTableConfig(assets)

  return (
    <AssetBalances
      config={config}
      selected={(row) => row.values.asset.currency === selected}
      onSelect={handleRowClick}
    />
  )
}

export const WalletBalances = () => {
  const { chainId, account } = useActiveWeb3React()
  const [selected, setSelected] = useRecoilState(SelectedCurrencyAtom)
  const _balances = useAllTokenBalances()
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)
  const setActiveModal = useSetRecoilState(ActiveModalAtom)

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
  const { config } = useTableConfig(balances)

  const handleRowClick = useCallback(
    (row) => {
      setSelected(row.values.asset.currency)
      setActiveModal(ActiveModal.MENU)
    },
    [setActiveModal, setSelected]
  )

  return (
    <AssetBalances
      config={config}
      selected={(row) => row.values.asset.currency === selected}
      onSelect={handleRowClick}
    />
  )
}
