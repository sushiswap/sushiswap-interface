import _ from 'lodash'
import React, { useMemo } from 'react'
import { formatNumber, formatNumberScale, formatPercent } from '../../../functions'
import Table from '../../../components/Table'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import { useCurrency } from '../../../hooks/Tokens'
import Image from 'next/image'

interface PoolListProps {
  pools: {
    pair: {
      token0: {
        id: string
      }
      token1: {
        id: string
      }
      name: string
    }
    rewards: Reward[]
    liquidity: number
    apr: number
  }[]
}

interface PairListNameProps {
  pair: {
    token0: {
      id: string
    }
    token1: {
      id: string
    }
    name: string
  }
}

type Reward = {
  icon: string
  token: string
  rewardPerDay: number
}

function PairListName({ pair }: PairListNameProps): JSX.Element {
  const token0 = useCurrency(pair?.token0?.id)
  const token1 = useCurrency(pair?.token1?.id)

  return (
    <>
      <div className="flex items-center">
        <DoubleCurrencyLogo currency0={token0} currency1={token1} size={32} />
        <div className="ml-3 font-bold whitespace-nowrap text-high-emphesis">{pair?.name}</div>
      </div>
    </>
  )
}

function Rewards({ rewards }: { rewards: Reward[] }): JSX.Element {
  return (
    <div>
      <div className="inline-flex items-center space-x-4 flex-inline">
        <div className="flex items-center space-x-2">
          {rewards?.map((reward, i) => (
            <div key={i} className="flex items-center">
              <Image
                src={reward.icon}
                width="30px"
                height="30px"
                className="rounded-md"
                layout="fixed"
                alt={reward.token}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-1">
          {rewards?.map((reward, i) => (
            <div key={i} className="text-xs md:text-sm whitespace-nowrap">
              {formatNumber(reward.rewardPerDay)} {reward.token} / DAY
            </div>
          ))}
        </div>
      </div>
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
        Header: 'Rewards',
        accessor: 'rewards',
        Cell: (props) => <Rewards rewards={props.value} />,
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
        Header: 'APR',
        accessor: 'apr',
        Cell: (props) => formatPercent(props.value),
        align: 'right',
      },
    ],
    []
  )

  return (
    <>
      {pools && (
        <Table
          columns={columns}
          data={pools}
          defaultSortBy={defaultSortBy}
          // link={{ href: '/analytics/pools/', id: 'pair.address' }}
        />
      )}
    </>
  )
}
