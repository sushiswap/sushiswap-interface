/* eslint-disable @next/next/no-img-element */
import { i18n } from '@lingui/core'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import { useAppContext } from '../context/AppContext'
import { KashiPairsByToken } from '../types/KashiPair'

type OrderBy = 'symbol' | 'totalSupply' | 'totalAsset' | 'totalBorrow' | ''
type OrderDirection = 'asc' | 'desc'

const MarketTableHead = ({
  onSort,
  orderBy,
  orderDirection,
}: {
  onSort: (orderBy: OrderBy) => void
  orderBy: OrderBy
  orderDirection: OrderDirection
}) => {
  const iconByDirection = {
    asc: <FaChevronUp className="inline-block" size={12} />,
    desc: <FaChevronDown className="inline-block" size={12} />,
  }

  return (
    <tr className="text-sm border-t border-gray-900 text-secondary">
      <td
        className="py-4 pl-8 pr-2"
        onClick={() => {
          onSort('symbol')
        }}
      >
        Token {orderBy === 'symbol' && iconByDirection[orderDirection]}
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort('totalSupply')
        }}
      >
        <span className="cursor-pointer">
          Total Supply
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
          Total Available
          {orderBy === 'totalAsset' && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="py-2 pl-2 pr-8 text-right"
        onClick={() => {
          onSort('totalBorrow')
        }}
      >
        <span className="cursor-pointer">
          Total Borrow
          {orderBy === 'totalBorrow' && iconByDirection[orderDirection]}
        </span>
      </td>
    </tr>
  )
}

const MarketTableRowLoading = () => (
  <tr className="border-t border-l-2 border-transparent cursor-pointer border-t-gray-900 hover:bg-dark-900">
    <td className="py-3 pl-8 pr-2">
      <div className="flex items-center">
        <div>
          <div className="inline-block w-8 h-8 rounded-full animate-pulse bg-dark-700"></div>
        </div>
        <div className="ml-2">
          <div>
            <div className="inline-block w-24 h-5 rounded animate-pulse bg-dark-700"></div>
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
    <td className="py-3 pl-2 pr-8 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded animate-pulse bg-dark-700"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded animate-pulse bg-dark-700 w-28"></div>
      </div>
    </td>
  </tr>
)

const MarketTableRow = ({ data, index }: { data: KashiPairsByToken; index: number }) => {
  const { tokenUtilService, handleLogoError } = useAppContext()
  const router = useRouter()
  const goto = (route: string) => {
    router.push(route)
  }

  return (
    <tr
      onClick={() => goto(`/analytics/kashi/tokens/${data.token.id}`)}
      className="border-t border-l-2 border-transparent cursor-pointer border-t-gray-900 hover:bg-dark-900"
    >
      <td className="py-3 pl-8 pr-2">
        <div className="flex items-center">
          <img
            src={tokenUtilService.logo(data.token.symbol)}
            className="inline-block w-8 h-8 rounded-full min-w-fit min-h-fit"
            onError={handleLogoError}
            alt={data.token.symbol}
          />
          <div className="ml-2">
            <div className="font-bold text-gray-50">{tokenUtilService.symbol(data.token.symbol)}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 font-bold text-right text-gray-50">
        {numeral(BigNumber.from(data.totalAsset).add(BigNumber.from(data.totalBorrow)).toNumber() / 100).format(
          '$0,.00'
        )}
      </td>
      <td className="px-2 py-3 font-bold text-right text-gray-50">
        {numeral(BigNumber.from(data.totalAsset).toNumber() / 100).format('$0,.00')}
      </td>
      <td className="py-3 pl-2 pr-8 font-bold text-right text-gray-50">
        {numeral(BigNumber.from(data.totalBorrow).toNumber() / 100).format('$0,.00')}
      </td>
    </tr>
  )
}

const TokenMarketTable = ({ loading = false, data = [] }: { loading?: boolean; data: KashiPairsByToken[] }) => {
  const [orderBy, setOrderBy] = useState<OrderBy>('')
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('desc')

  const [fullList, setFullList] = useState<KashiPairsByToken[]>([])
  const [sortedList, setSortedList] = useState<KashiPairsByToken[]>([])
  const [list, setList] = useState<KashiPairsByToken[]>([])
  const [isMore, setMore] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setFullList(data)
  }, [data])

  useEffect(() => {
    let newSortedList = [...fullList]
    const compareFuncs = {
      symbol: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          (a.token.symbol.toLowerCase() || '').localeCompare(b.token.symbol.toLowerCase() || ''),
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          (b.token.symbol.toLowerCase() || '').localeCompare(a.token.symbol.toLowerCase() || ''),
      },
      totalSupply: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .lte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
            ? -1
            : 1,
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .gte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
            ? -1
            : 1,
      },
      totalAsset: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset).lte(BigNumber.from(b.totalAsset)) ? -1 : 1,
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset).gte(BigNumber.from(b.totalAsset)) ? -1 : 1,
      },
      totalBorrow: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalBorrow).lte(BigNumber.from(b.totalBorrow)) ? -1 : 1,
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalBorrow).gte(BigNumber.from(b.totalBorrow)) ? -1 : 1,
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
          placeholder={i18n._('Search by Token...')}
          onChange={handleSearchChange}
        />
      </div>
      <table className="w-full token-market-table">
        <thead>
          <MarketTableHead onSort={handleSort} orderBy={orderBy} orderDirection={orderDirection} />
        </thead>
        {loading ? (
          <tbody>
            <MarketTableRowLoading />
            <MarketTableRowLoading />
            <MarketTableRowLoading />
            <MarketTableRowLoading />
          </tbody>
        ) : (
          <tbody>
            {sortedList
              .filter((value) => value.token.symbol.toLowerCase().indexOf(search.toLowerCase()) >= 0)
              .map((data, index) => (
                <MarketTableRow key={`${index}`} data={data} index={index} />
              ))}
          </tbody>
        )}
      </table>
    </div>
  )
}
export default TokenMarketTable
