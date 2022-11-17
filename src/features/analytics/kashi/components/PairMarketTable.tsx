/* eslint-disable @next/next/no-img-element */
import { i18n } from '@lingui/core'
import { useLingui } from '@lingui/react'
import { ChainId, Token } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import { useActiveWeb3React } from 'app/services/web3'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import { useAppContext } from '../context/AppContext'
import { KashiPairNew } from '../types/KashiPair'

type OrderBy = 'asset' | 'collateral' | 'totalSupply' | 'totalAsset' | 'supplyAPR' | 'totalBorrow' | 'borrowAPR' | ''
type OrderDirection = 'asc' | 'desc'

const PairMarketTableHead = ({
  onSort,
  orderBy,
  orderDirection,
}: {
  onSort: (orderBy: OrderBy) => void
  orderBy: OrderBy
  orderDirection: OrderDirection
}) => {
  const { i18n } = useLingui()
  const iconByDirection = {
    asc: <FaChevronUp className="inline-block" size={12} />,
    desc: <FaChevronDown className="inline-block" size={12} />,
  }

  return (
    <tr className="text-sm border-t border-gray-900 text-secondary">
      <td className="py-4 pl-8 pr-2">
        <span
          onClick={() => {
            onSort('asset')
          }}
          className="cursor-pointer"
        >
          Asset{orderBy === 'asset' && iconByDirection[orderDirection]}
        </span>
        /
        <span
          onClick={() => {
            onSort('collateral')
          }}
          className="cursor-pointer"
        >
          {i18n._('Collateral')}
          {orderBy === 'collateral' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('totalSupply')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('TVL')}
          {orderBy === 'totalSupply' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('totalBorrow')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Borrowed')}
          {orderBy === 'totalBorrow' && iconByDirection[orderDirection]}
        </span>
      </td>

      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('supplyAPR')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Supply APR')}
          {orderBy === 'supplyAPR' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('totalAsset')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Available')}
          {orderBy === 'totalAsset' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="py-2 pl-2 pr-8 text-right"
        onClick={() => {
          onSort('borrowAPR')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Borrow APR')}
          {orderBy === 'borrowAPR' && iconByDirection[orderDirection]}
        </span>
      </td>
    </tr>
  )
}

const PairMarketTableRowLoading = () => (
  <tr className="border-t border-l-2 border-transparent cursor-pointer border-t-gray-900 hover:border-l-primary1-400">
    <td className="py-3 pl-8 pr-2">
      <div className="md:flex">
        <div>
          <div className="inline-block w-8 h-8 rounded-full animate-pulse"></div>
          <div className="inline-block w-8 h-8 -ml-2 rounded-full animate-pulse bg-dark-700"></div>
        </div>
        <div className="md:ml-2">
          <div>
            <div className="inline-block w-24 h-5 rounded animate-pulse bg-dark-700"></div>
          </div>
          <div>
            <div className="inline-block w-12 h-4 rounded animate-pulse bg-dark-700"></div>
          </div>
        </div>
      </div>
    </td>
    <td className="px-2 py-3 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded animate-pulse bg-dark-700"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded animate-pulse bg-dark-700 w-28"></div>
      </div>
    </td>
    <td className="px-2 py-3 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded animate-pulse bg-dark-700"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded animate-pulse bg-dark-700 w-28"></div>
      </div>
    </td>
    <td className="px-2 py-3 text-right">
      <div className="inline-block w-12 h-5 rounded animate-pulse bg-dark-700"></div>
    </td>
    <td className="px-2 py-3 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded animate-pulse bg-dark-700"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded animate-pulse bg-dark-700 w-28"></div>
      </div>
    </td>
    <td className="py-3 pl-2 pr-8 text-right">
      <div className="inline-block w-12 h-5 rounded animate-pulse bg-dark-700"></div>
    </td>
  </tr>
)

const PairMarketTableRow = ({ data, index }: { data: KashiPairNew; index: number }) => {
  const { tokenUtilService, handleLogoError } = useAppContext()
  const router = useRouter()
  const goto = (route: string) => {
    router.push(route)
  }

  const { chainId } = useActiveWeb3React()

  const asset = new Token(
    chainId ?? ChainId.ETHEREUM,
    data.asset?.id ?? '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    Number(data.asset?.decimals ?? 0),
    data.asset?.symbol,
    data.asset?.name
  )

  const collateral = new Token(
    Number(chainId) ?? ChainId.ETHEREUM,
    data.collateral?.id ?? '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    Number(data.collateral?.decimals ?? 0),
    data.collateral?.symbol,
    data.collateral?.name
  )

  return (
    <>
      <tr
        onClick={() => goto(`/analytics/kashi/pairs/${data.id}`)}
        className="border-t border-l-2 border-transparent cursor-pointer border-t-gray-900 hover:bg-dark-900"
      >
        <td className="py-3 pl-8 pr-2">
          <div className="md:flex">
            <div className="flex">
              <CurrencyLogoArray currencies={[asset, collateral]} dense />
            </div>
            <div className="text-sm font-bold md:text-base md:ml-2 text-gray-50">
              {tokenUtilService.pairSymbol(data.asset?.symbol, data.collateral?.symbol)}
            </div>
          </div>
        </td>
        <td className="px-2 py-3 text-right">
          <div className="font-bold text-gray-50">
            {numeral(
              BigNumber.from(data?.totalAssetAmount).add(BigNumber.from(data.totalBorrowAmount)).toNumber() / 100
            ).format('$0,.00')}
          </div>
          <div className="text-xs text-gray-400">
            {numeral(
              BigNumber.from(data?.totalAsset?.elastic)
                .add(BigNumber.from(data.totalBorrow?.elastic))
                .div(
                  BigNumber.from('10').pow(
                    Number(data.asset?.decimals && Number(data.asset?.decimals) >= 2 ? data.asset?.decimals : 2) - 2
                  )
                )
                .toNumber() / 100
            ).format('0,.00')}
            &nbsp;
            {data.asset?.symbol}
          </div>
        </td>
        <td className="px-2 py-3 text-right">
          <div className="font-bold text-gray-50">
            {numeral(BigNumber.from(data?.totalBorrowAmount).toNumber() / 100).format('$0,.00')}
          </div>
          <div className="text-xs text-gray-400">
            {numeral(
              BigNumber.from(data?.totalBorrow?.elastic)
                .div(
                  BigNumber.from('10').pow(
                    Number(data.asset?.decimals && Number(data.asset?.decimals) >= 2 ? data.asset?.decimals : 2) - 2
                  )
                )
                .toNumber() / 100
            ).format('0,.00')}
            &nbsp;
            {data.asset?.symbol}
          </div>
        </td>
        <td className="px-2 py-3 text-right">
          <div className="font-bold text-gray-50">
            {numeral(
              BigNumber.from(data?.kpi?.supplyAPR).div(BigNumber.from('1000000000000')).toNumber() / 100000
            ).format('%0.00')}
          </div>
          <div className="text-xs text-gray-400">{i18n._(`annualized`)}</div>
        </td>
        <td className="px-2 py-3 text-right">
          <div className="font-bold text-gray-50">
            {numeral(BigNumber.from(data?.totalAssetAmount).toNumber() / 100).format('$0,.00')}
          </div>
          <div className="text-xs text-gray-400">
            {numeral(
              BigNumber.from(data?.totalAsset?.elastic)
                .div(
                  BigNumber.from('10').pow(
                    Number(data.asset?.decimals && Number(data.asset?.decimals) >= 2 ? data.asset?.decimals : 2) - 2
                  )
                )
                .toNumber() / 100
            ).format('0,.00')}
            &nbsp;
            {data.asset?.symbol}
          </div>
        </td>

        <td className="py-3 pl-2 pr-8 text-right">
          <div className="font-bold text-gray-50">
            {numeral(
              BigNumber.from(data?.kpi?.borrowAPR).div(BigNumber.from('1000000000000')).toNumber() / 100000
            ).format('%0.00')}
          </div>
          <div className="text-xs text-gray-400">{i18n._(`annualized`)}</div>
        </td>
      </tr>
    </>
  )
}

const PairMarketTable = ({ loading = false, data = [] }: { loading?: boolean; data: KashiPairNew[] }) => {
  const [orderBy, setOrderBy] = useState<OrderBy>('totalSupply')
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('desc')

  const [fullList, setFullList] = useState<KashiPairNew[]>([])
  const [sortedList, setSortedList] = useState<KashiPairNew[]>([])
  const [list, setList] = useState<KashiPairNew[]>([])
  const [isMore, setMore] = useState(false)
  const [search, setSearch] = useState('')
  const { tokenUtilService } = useAppContext()

  useEffect(() => {
    setFullList(data)
  }, [data])

  useEffect(() => {
    let newSortedList = [...fullList]
    const compareFuncs = {
      asset: {
        asc: (a: KashiPairNew, b: KashiPairNew) =>
          (a.asset?.symbol.toLowerCase() || '').localeCompare(b.asset?.symbol.toLowerCase() || ''),
        desc: (a: KashiPairNew, b: KashiPairNew) =>
          (b.asset?.symbol.toLowerCase() || '').localeCompare(a.asset?.symbol.toLowerCase() || ''),
      },
      collateral: {
        asc: (a: KashiPairNew, b: KashiPairNew) =>
          (a.collateral?.symbol.toLowerCase() || '').localeCompare(b.collateral?.symbol.toLowerCase() || ''),
        desc: (a: KashiPairNew, b: KashiPairNew) =>
          (b.collateral?.symbol.toLowerCase() || '').localeCompare(a.collateral?.symbol.toLowerCase() || ''),
      },
      totalSupply: {
        asc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.totalAssetAmount)
            .add(BigNumber.from(a.totalBorrowAmount))
            .lte(BigNumber.from(b.totalAssetAmount).add(BigNumber.from(b.totalBorrowAmount)))
            ? -1
            : 1,
        desc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.totalAssetAmount)
            .add(BigNumber.from(a.totalBorrowAmount))
            .gte(BigNumber.from(b.totalAssetAmount).add(BigNumber.from(b.totalBorrowAmount)))
            ? -1
            : 1,
      },
      totalAsset: {
        asc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.totalAssetAmount).lte(BigNumber.from(b.totalAssetAmount)) ? -1 : 1,
        desc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.totalAssetAmount).gte(BigNumber.from(b.totalAssetAmount)) ? -1 : 1,
      },
      totalBorrow: {
        asc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.totalBorrowAmount).lte(BigNumber.from(b.totalBorrowAmount)) ? 1 : -1,
        desc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.totalBorrowAmount).gte(BigNumber.from(b.totalBorrowAmount)) ? -1 : 1,
      },
      supplyAPR: {
        asc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.kpi?.supplyAPR).lte(BigNumber.from(b.kpi?.supplyAPR)) ? -1 : 1,
        desc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.kpi?.supplyAPR).gte(BigNumber.from(b.kpi?.supplyAPR)) ? -1 : 1,
      },
      borrowAPR: {
        asc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.kpi?.borrowAPR).lte(BigNumber.from(b.kpi?.borrowAPR)) ? -1 : 1,
        desc: (a: KashiPairNew, b: KashiPairNew) =>
          BigNumber.from(a.kpi?.borrowAPR).gte(BigNumber.from(b.kpi?.borrowAPR)) ? -1 : 1,
      },
    }

    if (orderBy) {
      newSortedList.sort(compareFuncs[orderBy][orderDirection])
    }
    setSortedList(newSortedList)
  }, [fullList, orderBy, orderDirection])

  useEffect(() => {
    setList([])
  }, [sortedList])

  const handleLoadMore = () => {
    if (isMore) return
    setMore(true)
    if (list.length < sortedList.length) {
      const start = list.length
      const end = Math.min(start + 20, sortedList.length)
      const newList = [...list, ...sortedList.slice(start, end)]
      setList(newList)
    }
    setMore(false)
  }

  const handleSort = (orderField: OrderBy) => {
    if (orderBy === orderField) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc')
      return
    }
    setOrderBy(orderField)
    setOrderDirection('desc')
  }

  const handleSearchChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement
    setSearch(target.value)
  }

  return (
    <div className="overflow-x-auto">
      <div className="pb-6">
        <input
          type="text"
          className="w-full p-2 border rounded focus:outline-blue placeholder:text-low-emphesis border-dark-800 bg-dark-900"
          placeholder={i18n._('Search by Asset/Collateral...')}
          onChange={handleSearchChange}
        />
      </div>
      <table className="w-full pair-market-table">
        <thead>
          <PairMarketTableHead onSort={handleSort} orderBy={orderBy} orderDirection={orderDirection} />
        </thead>
        {loading ? (
          <tbody>
            <PairMarketTableRowLoading />
            <PairMarketTableRowLoading />
            <PairMarketTableRowLoading />
            <PairMarketTableRowLoading />
          </tbody>
        ) : (
          <tbody>
            {sortedList
              .filter((value) => {
                const token = tokenUtilService.pairSymbol(value.asset?.symbol, value.collateral?.symbol)
                if (token) {
                  return token.toLowerCase().indexOf(search.toLowerCase()) >= 0
                }
                return false
              })
              .map((data, index) => (
                <PairMarketTableRow key={`${data.id}`} data={data} index={index} />
              ))}
          </tbody>
        )}
      </table>
    </div>
  )
}
export default PairMarketTable
