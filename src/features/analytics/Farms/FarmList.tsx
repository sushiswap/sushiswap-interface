import _ from 'lodash'
import React, { useMemo } from 'react'
import { formatNumber, formatNumberScale, formatPercent } from '../../../functions'
import Table from '../../../components/Table'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import { useCurrency } from '../../../hooks/Tokens'
import Image from 'next/image'
import ColoredNumber from '../ColoredNumber'

interface FarmListProps {
  pools: {
    pair: FarmListNameProps
    rewards: Reward[]
    liquidity: number
    apr: number
  }[]
}

type FarmListNameProps = {
  pair: {
    token0: {
      id: string
    }
    token1: {
      id: string
    }
    name: string
    type: 'Sushi Farm' | 'Kashi Farm'
  }
}

type Reward = {
  icon: string
  token: string
  rewardPerDay: number
}

function FarmListName({ pair }: FarmListNameProps): JSX.Element {
  const token0 = useCurrency(pair?.token0?.id)
  const token1 = useCurrency(pair?.token1?.id)

  return (
    <>
      <div className="flex items-center">
        <DoubleCurrencyLogo
          className="-space-x-3"
          logoClassName="rounded-full"
          currency0={token0}
          currency1={token1}
          size={40}
        />
        <div className="flex flex-col ml-3 whitespace-nowrap">
          <div className="font-bold text-high-emphesis">{pair?.name}</div>
          <div className="text-secondary">{pair.type}</div>
        </div>
      </div>
    </>
  )
}

function Rewards({ rewards }: { rewards: Reward[] }): JSX.Element {
  return (
    <div>
      <div className="inline-flex items-center space-x-4 flex-inline">
        <div className="flex flex-col items-center space-y-2">
          {rewards?.map((reward, i) => (
            <div key={i} className="flex items-center">
              <Image
                src={reward.icon}
                width="30px"
                height="30px"
                className="rounded-full"
                layout="fixed"
                alt={reward.token}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-1">
          {rewards?.map((reward, i) => {
            const decimals = 6 - String(reward?.rewardPerDay?.toFixed(0)).length
            return (
              <div key={i} className="text-base whitespace-nowrap">
                {reward?.rewardPerDay?.toFixed(decimals > 0 ? decimals : 0)} {reward.token}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function FarmList({ pools }: FarmListProps): JSX.Element {
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
        Header: 'Pool Name',
        accessor: 'pair',
        Cell: (props) => <FarmListName pair={props.value} />,
        disableSortBy: true,
        align: 'left',
      },
      {
        Header: 'Annual / Monthly / Daily APR',
        accessor: 'apr',
        Cell: (props) => (
          <div className="inline-flex flex-row font-medium">
            {props.value.annual < 10000 ? (
              <ColoredNumber number={props.value.annual} percent={true} />
            ) : (
              <div className="font-normal text-green">{'>10,000%'}</div>
            )}
            &nbsp;/ {props.value.monthly > 10000 ? '>10,000%' : formatPercent(props.value.monthly * 100)}
            &nbsp;/ {props.value.daily > 10000 ? '>10,000%' : formatPercent(props.value.daily * 100)}
          </div>
        ),
        align: 'right',
        sortType: (a, b) => a.original.apr.annual - b.original.apr.annual,
      },
      {
        Header: 'TVL',
        accessor: 'liquidity',
        Cell: (props) => (
          <div className="text-base font-medium text-primary">{formatNumber(props.value, true, false)}</div>
        ),
        align: 'right',
      },
      {
        Header: 'Daily Rewards',
        accessor: 'rewards',
        Cell: (props) => <Rewards rewards={props.value} />,
        disableSortBy: true,
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
