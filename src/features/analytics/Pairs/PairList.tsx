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
    volume1d: number
    volume1w: number
  }[]
  type: 'all' | 'gainers' | 'losers'
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

function ColoredUSDNumber({ number, percent = false }: { number: number; percent?: boolean }): JSX.Element {
  if (isNaN(number) || number === Infinity) number = 0

  //console.log(percent, number)

  return (
    <>
      <div className={classNames(number >= 0 ? 'text-green' : 'text-red', 'font-normal')}>
        {(number >= 0 ? '+' : '-') +
          (percent ? formatPercent(number).replace('-', '') : formatNumberScale(number, true).replace('-', ''))}
      </div>
    </>
  )
}

const allColumns = [
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
    accessor: 'volume1d',
    Cell: (props) => formatNumber(props.value, true),
    align: 'right',
  },
  {
    Header: 'Volume (7d)',
    accessor: 'volume1w',
    Cell: (props) => formatNumber(props.value, true),
    align: 'right',
  },
  {
    Header: 'Fees (24h)',
    HideHeader: '(7d)',
    accessor: (row) => formatNumber(row.volume1d * 0.003, true),
    align: 'right',
  },
  {
    Header: 'Fees (7d)',
    accessor: (row) => formatNumber(row.volume1w * 0.003, true),
    disableSortBy: true,
    align: 'right',
  },
  {
    Header: 'Fees (Yearly)',
    accessor: (row) => formatPercent((((row.volume1w / 7) * 365) / row.liquidity) * 100 * 0.03),
    disableSortBy: true,
    align: 'right',
  },
]

const gainersColumns = [
  {
    Header: 'Pair',
    accessor: 'pair',
    Cell: (props) => <PairListName pair={props.value} />,
    disableSortBy: true,
    align: 'left',
  },
  {
    Header: '△ Liquidity (24h)',
    accessor: 'liquidityChangeNumber1d',
    Cell: (props) => <ColoredUSDNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Liquidity % (24h)',
    accessor: 'liquidityChangePercent1d',
    Cell: (props) => <ColoredUSDNumber number={props.value} percent={true} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Liquidity (7d)',
    accessor: 'liquidityChangeNumber1w',
    Cell: (props) => <ColoredUSDNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Liquidity % (7d)',
    accessor: 'liquidityChangePercent1w',
    Cell: (props) => <ColoredUSDNumber number={props.value} percent={true} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume (24h)',
    accessor: 'volumeChangeNumber1d',
    Cell: (props) => <ColoredUSDNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume % (24h)',
    accessor: 'volumeChangePercent1d',
    Cell: (props) => <ColoredUSDNumber number={props.value} percent={true} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume (7d)',
    accessor: 'volumeChangeNumber1w',
    Cell: (props) => <ColoredUSDNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume % (7d)',
    accessor: 'volumeChangePercent1w',
    Cell: (props) => <ColoredUSDNumber number={props.value} percent={true} />,
    align: 'right',
    sortType: 'basic',
  },
]

export default function PairList({ pairs, type }: PairListProps): JSX.Element {
  const defaultSortBy = React.useMemo(() => {
    switch (type) {
      case 'all':
        return { id: 'liquidity', desc: true }
      case 'gainers':
        return { id: 'liquidityChangeNumber1d', desc: true }
      case 'losers':
        return { id: 'liquidityChangeNumber1d', desc: false }
    }
  }, [type])

  const columns = React.useMemo(() => {
    switch (type) {
      case 'all':
        return allColumns
      case 'gainers':
        return gainersColumns
      case 'losers':
        return gainersColumns
    }
  }, [type])

  return <>{pairs && <Table columns={columns} data={pairs} defaultSortBy={defaultSortBy} />}</>
}
