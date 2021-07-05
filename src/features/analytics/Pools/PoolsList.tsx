import _ from 'lodash'
import React, { useMemo } from 'react'
import { classNames, formatNumber, formatNumberScale, formatPercent } from '../../../functions'
import Table from '../../../components/Table'
import ColoredNumber from '../../../features/analytics/ColoredNumber'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import { useCurrency } from '../../../hooks/Tokens'
import CurrencyLogo from '../../../components/CurrencyLogo'

interface PoolListProps {
  pools: {
    pair: {
      address0: string
      address1: string
      symbol: string
    }
    rewards: Reward[]
    liquidity: number
    apr: number
  }[]
}

interface PairListNameProps {
  pair: {
    address0: string
    address1: string
    symbol: string
  }
}

type Reward = {
  address: string
  symbol: string
  amount: number
}

function PairListName({ pair }: PairListNameProps): JSX.Element {
  const token0 = useCurrency(pair.address0)
  const token1 = useCurrency(pair.address1)

  return (
    <>
      <div className="flex items-center">
        <DoubleCurrencyLogo currency0={token0} currency1={token1} size={32} />
        <div className="ml-3 font-bold text-high-emphesis">{pair.symbol}</div>
      </div>
    </>
  )
}

function Rewards({ rewards }: { rewards: Reward[] }): JSX.Element {
  const currency0 = useCurrency(rewards[0].address)
  const currency1 = useCurrency(rewards.length === 2 ? rewards[1].address : '')

  const currencies = [currency0, currency1]

  const size = useMemo(() => {
    if (rewards.length === 1) return 28
    if (rewards.length === 2) return 18
  }, [rewards])

  return (
    <div className="flex justify-end">
      <table className="flex flex-col space-y-2 text-sm text-high-emphesis">
        {rewards.map((reward, i) => (
          <tr>
            <td>
              <CurrencyLogo currency={currencies[i]} size={size} />
            </td>
            <td>
              <div className="ml-2">{`${reward.amount.toFixed(3)} ${reward.symbol} / day`}</div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default function PoolList({ pools }: PoolListProps): JSX.Element {
  const defaultSortBy = React.useMemo(
    () => ({
      id: 'apr',
      desc: true,
    }),
    []
  )

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
        Header: 'Reward per $1,000',
        accessor: 'rewards',
        Cell: (props) => <Rewards rewards={props.value} />,
        align: 'right',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        Cell: (props) => formatNumberScale(props.value, true),
        align: 'right',
      },
      {
        Header: 'APR',
        accessor: 'apr',
        Cell: (props) => formatPercent(props.value),
        align: 'right',
      },
    ],
    []
  )

  return <>{pools && <Table columns={columns} data={pools} defaultSortBy={defaultSortBy} />}</>
}
