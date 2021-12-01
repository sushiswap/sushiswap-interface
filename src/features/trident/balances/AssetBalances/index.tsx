import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, NATIVE, Token, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { Assets, TableInstance } from 'app/features/trident/balances/AssetBalances/types'
import { useLPTableConfig } from 'app/features/trident/balances/AssetBalances/useLPTableConfig'
import { ActiveModalAtom, SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import { classNames } from 'app/functions'
import { useTridentLiquidityPositions } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalances } from 'app/state/bentobox/hooks'
import { useAllTokenBalances, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useCallback, useMemo } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'
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
  return <_AssetBalances config={config} loading={isValidating} error={error} />
}

export const BentoBalances = () => {
  const { chainId } = useActiveWeb3React()
  const [selected, setSelected] = useRecoilState(SelectedCurrencyAtom)
  const bentoBalances = useBentoBalances()
  const setActiveModal = useSetRecoilState(ActiveModalAtom)

  const balances = useMemo(
    () =>
      chainId
        ? bentoBalances.reduce<Assets[]>((acc, { address, decimals, name, symbol, bentoBalance }) => {
            const token = new Token(chainId, address, decimals, symbol, name)
            const cur = CurrencyAmount.fromRawAmount(token, bentoBalance)
            if (cur.greaterThan(ZERO)) acc.push({ asset: cur })

            return acc
          }, [])
        : [],
    [bentoBalances, chainId]
  )

  const handleRowClick = useCallback(
    (row) => {
      setSelected(row.values.asset.currency)
      setActiveModal(ActiveModal.MENU)
    },
    [setActiveModal, setSelected]
  )

  const { config } = useTableConfig(balances)

  return (
    <_AssetBalances
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
    <_AssetBalances
      config={config}
      selected={(row) => row.values.asset.currency === selected}
      onSelect={handleRowClick}
    />
  )
}

interface _AssetBalancesProps {
  config: any
  loading?: boolean
  error?: boolean
  selected?(row: any): boolean
  onSelect?(row: any): void
}

const _AssetBalances: FC<_AssetBalancesProps> = ({ config, loading, error, onSelect, selected }) => {
  const { i18n } = useLingui()

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page }: TableInstance = useTable(
    config,
    useSortBy,
    usePagination,
    useFlexLayout
  )

  return (
    <div {...getTableProps()} className="w-full">
      <div>
        {headerGroups.map((headerGroup, i) => (
          <div {...headerGroup.getHeaderGroupProps()} key={i} className="lg:pl-[18px] lg:pr-[18px] lg:mb-3">
            {headerGroup.headers.map((column, i) => (
              <div
                key={i}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={classNames(column.className, `font-normal`, 'flex items-center lg:gap-2 gap-1')}
              >
                {column.render('Header')}
                {i === 0 && (
                  <div className="inline-flex items-center">
                    <div
                      className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue inline-block ml-3 transition ${
                        loading ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {error && <span className="ml-2 text-sm italic text-red">{i18n._(t`⚠️ Loading Error`)}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()} className="lg:border lg:border-dark-700 lg:rounded lg:overflow-hidden">
        {page.length > 0 ? (
          page.map((row, i) => {
            prepareRow(row)
            return (
              <div
                {...row.getRowProps()}
                key={i}
                onClick={() => onSelect && onSelect(row)}
                className={classNames(
                  i % 2 === 0 ? 'lg:bg-[rgb(255,255,255,0.03)]' : '',
                  selected && selected(row) ? 'lg:!bg-dark-800' : '',
                  i < page.length - 1 ? 'border-b lg:border-dark-700 border-dark-900' : '',
                  'lg:hover:bg-dark-900 lg:pl-3.5 lg:pr-5 lg:gap-2 gap-1',
                  onSelect ? 'cursor-pointer' : ''
                )}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <div
                      key={i}
                      {...cell.getCellProps()}
                      className={classNames('h-[64px] flex items-center', headerGroups[0].headers[i].className)}
                    >
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })
        ) : (
          <Typography variant="xs" className="text-center text-low-emphesis h-[60px] flex items-center justify-center">
            {i18n._(t`No balances`)}
          </Typography>
        )}
      </div>
    </div>
  )
}
