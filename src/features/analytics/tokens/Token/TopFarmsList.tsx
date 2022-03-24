import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import Table from 'app/components/Table'
import { formatPercent } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import { useMemo } from 'react'

interface TopFarmsListProps {
  farms: {
    pair: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    roi: number
    rewards: {
      icon: JSX.Element
    }[]
  }[]
}

interface FarmListNameProps {
  pair: {
    token0: {
      id: string
      symbol: string
    }
    token1: {
      id: string
      symbol: string
    }
  }
}

function FarmListname({ pair }: FarmListNameProps): JSX.Element {
  const token0 = useCurrency(pair.token0.id)
  const token1 = useCurrency(pair.token1.id)

  return (
    <div className="flex items-center">
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      <DoubleCurrencyLogo currency0={token0} currency1={token1} size={28} />
      <div className="ml-3 font-bold text-high-emphesis">
        {pair.token0.symbol}-{pair.token1.symbol}
      </div>
    </div>
  )
}

export default function TopFarmsList({ farms }: TopFarmsListProps): JSX.Element {
  const columns = useMemo(
    () => [
      {
        Header: 'Token Pair',
        accessor: 'pair',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <FarmListname pair={props.value} />,
        disableSortBy: true,
        align: 'left',
      },
      {
        Header: 'ROI (1Y)',
        accessor: 'roi',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => formatPercent(props.value),
        align: 'right',
      },
      {
        Header: 'Rewards',
        accessor: 'rewards',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => props.value,
      },
    ],
    []
  )

  return <>{farms && <Table columns={columns} data={farms} defaultSortBy={{ id: 'ROI (1Y)', desc: true }} />}</>
}
