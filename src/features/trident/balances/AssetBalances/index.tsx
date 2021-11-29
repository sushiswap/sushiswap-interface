import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { Currency, CurrencyAmount, NATIVE, Token, ZERO } from '@sushiswap/core-sdk'
import { Assets, TableInstance } from 'app/features/trident/balances/AssetBalances/types'
import { useLPTableConfig } from 'app/features/trident/balances/AssetBalances/useLPTableConfig'
import { ActiveModalAtom, SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import { classNames } from 'app/functions'
import { useLiquidityPositions } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalances } from 'app/state/bentobox/hooks'
import { useAllTokenBalances, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { useCallback, useMemo, useState } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { useTableConfig } from './useTableConfig'

export const LiquidityPositionsBalances = () => {
  const [selected, setSelected] = useState<Currency>()
  const { account, chainId } = useActiveWeb3React()

  // TODO ramin: wait for new agnostic subgraph hooks
  const userPairs = useLiquidityPositions({ user: account ?? undefined, chainId: Number(chainId) })
  const { config } = useLPTableConfig([])

  return <_AssetBalances config={config} />
}

export const BentoBalances = () => {
  const { chainId } = useActiveWeb3React()
  const bentoBalances = useBentoBalances()
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

  const { config } = useTableConfig(balances)

  return <_AssetBalances config={config} />
}

export const WalletBalances = () => {
  const { chainId, account } = useActiveWeb3React()
  const _balances = useAllTokenBalances()
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
  const { config } = useTableConfig(balances)

  return <_AssetBalances config={config} />
}

const _AssetBalances = ({ config }) => {
  const [selected, setSelected] = useRecoilState(SelectedCurrencyAtom)
  const setActiveModal = useSetRecoilState(ActiveModalAtom)

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page }: TableInstance = useTable(
    config,
    useSortBy,
    usePagination,
    useFlexLayout
  )

  const handleRowClick = useCallback(
    (currency: Currency) => {
      setSelected(currency)
      setActiveModal(ActiveModal.MENU)
    },
    [setActiveModal, setSelected]
  )

  return (
    <>
      <div {...getTableProps()} className="w-full">
        <div>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i} className="lg:pl-[18px] lg:pr-[18px] lg:mb-3">
              {headerGroup.headers.map((column, i) => (
                <th
                  key={i}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={classNames(column.className, `font-normal`)}
                >
                  {column.render('Header')}
                  <span className="inline-block ml-1 align-middle">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ArrowDownIcon width={12} />
                      ) : (
                        <ArrowUpIcon width={12} />
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </div>
        <div {...getTableBodyProps()} className="lg:border lg:border-dark-700 lg:rounded lg:overflow-hidden">
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                key={i}
                onClick={() => handleRowClick(row.values.asset.currency)}
                className={classNames(
                  i % 2 === 0 ? 'lg:bg-[rgb(255,255,255,0.03)]' : '',
                  row.values.asset.currency === selected ? 'lg:!bg-dark-800' : '',
                  i < page.length - 1 ? 'border-b lg:border-dark-700 border-dark-900' : '',
                  'lg:hover:bg-dark-900 lg:pl-3.5 lg:pr-5 cursor-pointer'
                )}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <td key={i} {...cell.getCellProps()} className="py-4 flex items-center">
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </div>
      </div>
    </>
  )
}
