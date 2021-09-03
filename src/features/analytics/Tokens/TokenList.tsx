import { classNames, formatNumber, formatNumberScale, formatPercent } from '../../../functions'

import ColoredNumber from '../ColoredNumber'
import CurrencyLogo from '../../../components/CurrencyLogo'
import React from 'react'
import Table from '../../../components/Table'
import _ from 'lodash'
import { useCurrency } from '../../../hooks/Tokens'
import LineGraph from '../../../components/LineGraph'

interface TokenListProps {
  tokens: {
    token: {
      address: string
      symbol: string
    }
    liquidity: number
    volume1d: number
    volume1w: number
    price: number
    change1d: number
    change1w: number
  }[]
}

interface TokenListNameProps {
  token: {
    address: string
    symbol: string
  }
}

function TokenListName({ token }: TokenListNameProps): JSX.Element {
  const currency = useCurrency(token.address)

  return (
    <>
      <div className="flex items-center">
        <CurrencyLogo className="rounded-full" currency={currency} size={40} />
        <div className="ml-4 text-lg font-bold text-high-emphesis">{token.symbol}</div>
      </div>
    </>
  )
}

export default function TokenList({ tokens }: TokenListProps): JSX.Element {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'token',
        Cell: (props) => <TokenListName token={props.value} />,
        disableSortBy: true,
        align: 'left',
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: (props) => formatNumber(props.value, true, undefined, 2),
        align: 'right',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        Cell: (props) => formatNumber(props.value, true, false),
        align: 'right',
      },
      {
        Header: 'Daily / Weekly % Change',
        accessor: (row) => (
          <div>
            <ColoredNumber className="font-medium" number={row.change1d} percent={true} />
            <div className="font-normal">
              {row.change1w > 0 && '+'}
              {formatPercent(row.change1w)}
            </div>
          </div>
        ),
        align: 'right',
        sortType: (a, b) => a.original.change1d - b.original.change1d,
      },
      {
        Header: 'Daily / Weekly Volume',
        accessor: (row) => (
          <div>
            <div className="font-medium text-high-emphesis">{formatNumber(row.volume1d, true, false, 2)}</div>
            <div className="font-normal text-primary">{formatNumber(row.volume1w, true, false, 2)}</div>
          </div>
        ),
        align: 'right',
      },
      {
        Header: 'Last Week',
        accessor: 'graph',
        Cell: (props) => (
          <div className="flex justify-end w-full h-full py-2 pr-2">
            <div className="w-32 h-10">
              <LineGraph
                data={props.value}
                stroke={{ solid: props.row.original.change1w >= 0 ? '#00ff4f' : '#ff3838' }}
              />
            </div>
          </div>
        ),
        disableSortBy: true,
        align: 'right',
      },
    ],
    []
  )

  return (
    <>
      {tokens && (
        <Table
          columns={columns}
          data={tokens}
          defaultSortBy={{ id: 'liquidity', desc: true }}
          link={{ href: '/analytics/tokens/', id: 'token.address' }}
        />
      )}
    </>
  )
}
