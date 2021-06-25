import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import DoubleLogo from '../../../components/DoubleLogo'
import { classNames, formatNumber, formatNumberScale, formatPercent } from '../../../functions'
import { useCurrency } from '../../../hooks/Tokens'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'
import Table from './Table'
import CurrencyLogo from '../../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'

interface PairListProps {
  pairs: {
    pair: {
      address0: string
      address1: string
      symbol0: string
      symbol1: string
    }
    liquidity: number
    volume24h: number
    volume7d: number
  }[]
}

interface PairListNameProps {
  pair: {
    address0: string
    address1: string
    symbol0: string
    symbol1: string
  }
}

function PairListName({ pair }: PairListNameProps): JSX.Element {
  const token0 = useCurrency(pair.address0)
  const token1 = useCurrency(pair.address1)

  return (
    <>
      <div className="flex items-center">
        <DoubleCurrencyLogo currency0={token0} currency1={token1} size={28} />
        <div className="text-high-emphesis font-bold ml-3">
          {pair.symbol0}-{pair.symbol1}
        </div>
      </div>
    </>
  )
}

export default function PairList({ pairs }: PairListProps): JSX.Element {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Pair',
        accessor: 'pair',
        Cell: (props) => <PairListName pair={props.value} />,
        disableSortBy: true,
        align: 'left',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        Cell: (props) => formatNumberScale(props.value, true),
        align: 'right',
      },
      {
        Header: 'Volume (24h)',
        HideHeader: '(7d)',
        accessor: 'volume24h',
        Cell: (props) => formatNumber(props.value, true),
        align: 'right',
      },
      {
        Header: 'Volume (7d)',
        accessor: 'volume7d',
        Cell: (props) => formatNumber(props.value, true),
        align: 'right',
      },
      {
        Header: 'Fees (24h)',
        HideHeader: '(7d)',
        accessor: (row) => formatNumber(row.volume24h * 0.003, true),
        align: 'right',
      },
      {
        Header: 'Fees (7d)',
        accessor: (row) => formatNumber(row.volume7d * 0.003, true),
        disableSortBy: true,
        align: 'right',
      },
      {
        Header: 'Fees (Yearly)',
        accessor: (row) => formatPercent((((row.volume7d / 7) * 365) / row.liquidity) * 100 * 0.03),
        disableSortBy: true,
        align: 'right',
      },
    ],
    []
  )

  return <>{pairs && <Table columns={columns} data={pairs} />}</>
}
