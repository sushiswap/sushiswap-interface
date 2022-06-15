/* eslint-disable @next/next/no-img-element */
import { i18n } from '@lingui/core'
import { useLingui } from '@lingui/react'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import { useAppContext } from '../context/AppContext'
import { KashiPair } from '../types/KashiPair'

type OrderBy = 'asset' | 'collateral' | 'totalSupply' | 'totalAsset' | 'supplyAPY' | 'totalBorrow' | 'borrowAPY' | ''
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
          {i18n._('Total Supply')}
          {orderBy === 'totalSupply' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('totalAsset')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Total Available')}
          {orderBy === 'totalAsset' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('supplyAPY')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Supply APY')}
          {orderBy === 'supplyAPY' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('totalBorrow')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Total Borrow')}
          {orderBy === 'totalBorrow' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="py-2 pl-2 pr-8 text-right"
        onClick={() => {
          onSort('borrowAPY')
        }}
      >
        <span className="cursor-pointer">
          {i18n._('Borrow APY')}
          {orderBy === 'borrowAPY' && iconByDirection[orderDirection]}
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

const PairMarketTableRow = ({ data, index }: { data: KashiPair; index: number }) => {
  const { tokenUtilService, handleLogoError } = useAppContext()
  const router = useRouter()
  const goto = (route: string) => {
    router.push(route)
  }

  return (
    <tr
      onClick={() => goto(`/analytics/kashi/pairs/${data.id}`)}
      className="border-t border-l-2 border-transparent cursor-pointer border-t-gray-900 hover:bg-dark-900"
    >
      <td className="py-3 pl-8 pr-2">
        <div className="md:flex">
          <div className="flex">
            <img
              src={tokenUtilService.logo(data.asset?.symbol)}
              className="inline-block w-8 h-8 rounded-full"
              onError={handleLogoError}
              alt={data?.symbol}
            />
            <img
              src={tokenUtilService.logo(data.collateral?.symbol)}
              onError={handleLogoError}
              className="inline-block w-8 h-8 -ml-2 rounded-full"
              alt={data?.symbol}
            />
          </div>
          <div className="text-sm font-bold md:text-base md:ml-2 text-gray-50">
            {tokenUtilService.pairSymbol(data.asset?.symbol, data.collateral?.symbol)}
          </div>
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        <div className="font-bold text-gray-50">
          {numeral(BigNumber.from(data?.totalAsset).add(BigNumber.from(data.totalBorrow)).toNumber() / 100).format(
            '$0,.00'
          )}
        </div>
        <div className="text-xs text-gray-400">
          {numeral(
            BigNumber.from(data?.totalAssetElastic)
              .add(BigNumber.from(data.totalBorrowElastic))
              .div(BigNumber.from('10').pow(Number(data.asset?.decimals || 0) - 2))
              .toNumber() / 100
          ).format('0,.00')}
          &nbsp;
          {data.asset?.symbol}
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        <div className="font-bold text-gray-50">
          {numeral(BigNumber.from(data?.totalAsset).toNumber() / 100).format('$0,.00')}
        </div>
        <div className="text-xs text-gray-400">
          {numeral(
            BigNumber.from(data?.totalAssetElastic)
              .div(BigNumber.from('10').pow(Number(data.asset?.decimals || 0) - 2))
              .toNumber() / 100
          ).format('0,.00')}
          &nbsp;
          {data.asset?.symbol}
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        <div className="font-bold text-gray-50">
          {numeral(BigNumber.from(data?.supplyAPR).div(BigNumber.from('1000000000000')).toNumber() / 100000).format(
            '%0.00'
          )}
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        <div className="font-bold text-gray-50">
          {numeral(BigNumber.from(data?.totalBorrow).toNumber() / 100).format('$0,.00')}
        </div>
        <div className="text-xs text-gray-400">
          {numeral(
            BigNumber.from(data?.totalBorrowElastic)
              .div(BigNumber.from('10').pow(Number(data.asset?.decimals || 0) - 2))
              .toNumber() / 100
          ).format('0,.00')}
          &nbsp;
          {data.asset?.symbol}
        </div>
      </td>
      <td className="py-3 pl-2 pr-8 text-right">
        <div className="font-bold text-gray-50">
          {numeral(BigNumber.from(data?.borrowAPR).div(BigNumber.from('1000000000000')).toNumber() / 100000).format(
            '%0.00'
          )}
        </div>
      </td>
    </tr>
  )
}

const PairMarketTable = ({ loading = false, data = [] }: { loading?: boolean; data: KashiPair[] }) => {
  const [orderBy, setOrderBy] = useState<OrderBy>('')
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('desc')

  const [fullList, setFullList] = useState<KashiPair[]>([])
  const [sortedList, setSortedList] = useState<KashiPair[]>([])
  const [list, setList] = useState<KashiPair[]>([])
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
        asc: (a: KashiPair, b: KashiPair) =>
          (a.asset?.symbol.toLowerCase() || '').localeCompare(b.asset?.symbol.toLowerCase() || ''),
        desc: (a: KashiPair, b: KashiPair) =>
          (b.asset?.symbol.toLowerCase() || '').localeCompare(a.asset?.symbol.toLowerCase() || ''),
      },
      collateral: {
        asc: (a: KashiPair, b: KashiPair) =>
          (a.collateral?.symbol.toLowerCase() || '').localeCompare(b.collateral?.symbol.toLowerCase() || ''),
        desc: (a: KashiPair, b: KashiPair) =>
          (b.collateral?.symbol.toLowerCase() || '').localeCompare(a.collateral?.symbol.toLowerCase() || ''),
      },
      totalSupply: {
        asc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .lte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
            ? -1
            : 1,
        desc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .gte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
            ? -1
            : 1,
      },
      totalAsset: {
        asc: (a: KashiPair, b: KashiPair) => (BigNumber.from(a.totalAsset).lte(BigNumber.from(b.totalAsset)) ? -1 : 1),
        desc: (a: KashiPair, b: KashiPair) => (BigNumber.from(a.totalAsset).gte(BigNumber.from(b.totalAsset)) ? -1 : 1),
      },
      totalBorrow: {
        asc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalBorrow).lte(BigNumber.from(b.totalBorrow)) ? 1 : -1,
        desc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalBorrow).gte(BigNumber.from(b.totalBorrow)) ? -1 : 1,
      },
      supplyAPY: {
        asc: (a: KashiPair, b: KashiPair) => (BigNumber.from(a.supplyAPR).lte(BigNumber.from(b.supplyAPR)) ? -1 : 1),
        desc: (a: KashiPair, b: KashiPair) => (BigNumber.from(a.supplyAPR).gte(BigNumber.from(b.supplyAPR)) ? -1 : 1),
      },
      borrowAPY: {
        asc: (a: KashiPair, b: KashiPair) => (BigNumber.from(a.borrowAPR).lte(BigNumber.from(b.borrowAPR)) ? -1 : 1),
        desc: (a: KashiPair, b: KashiPair) => (BigNumber.from(a.borrowAPR).gte(BigNumber.from(b.borrowAPR)) ? -1 : 1),
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
