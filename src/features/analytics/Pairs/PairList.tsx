import _ from 'lodash'
import React from 'react'
import { formatNumber, formatNumberScale, formatPercent } from '../../../functions'
import Table from '../../../components/Table'
import ColoredNumber from '../../../features/analytics/ColoredNumber'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import { useCurrency } from '../../../hooks/Tokens'

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
        <DoubleCurrencyLogo currency0={token0} currency1={token1} size={32} />
        <div className="ml-3 font-bold text-high-emphesis whitespace-nowrap">
          {pair.symbol0}-{pair.symbol1}
        </div>
      </div>
    </>
  )
}

const allColumns = [
  {
    Header: 'Pair',
    accessor: 'pair',
    Cell: (props) => <PairListName pair={props.value} />,
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
    align: 'right',
  },
  {
    Header: 'Fees (Yearly)',
    accessor: (row) => formatPercent((((row.volume1w / 7) * 365) / row.liquidity) * 100 * 0.03),
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
    Cell: (props) => <ColoredNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Liquidity % (24h)',
    accessor: 'liquidityChangePercent1d',
    Cell: (props) => <ColoredNumber number={props.value} percent={true} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Liquidity (7d)',
    accessor: 'liquidityChangeNumber1w',
    Cell: (props) => <ColoredNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Liquidity % (7d)',
    accessor: 'liquidityChangePercent1w',
    Cell: (props) => <ColoredNumber number={props.value} percent={true} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume (24h)',
    accessor: 'volumeChangeNumber1d',
    Cell: (props) => <ColoredNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume % (24h)',
    accessor: 'volumeChangePercent1d',
    Cell: (props) => <ColoredNumber number={props.value} percent={true} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume (7d)',
    accessor: 'volumeChangeNumber1w',
    Cell: (props) => <ColoredNumber number={props.value} />,
    align: 'right',
    sortType: 'basic',
  },
  {
    Header: '△ Volume % (7d)',
    accessor: 'volumeChangePercent1w',
    Cell: (props) => <ColoredNumber number={props.value} percent={true} />,
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
