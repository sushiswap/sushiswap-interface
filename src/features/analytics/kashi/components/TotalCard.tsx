import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import { BigNumber } from 'ethers'
import numeral from 'numeral'

import { useAppContext } from '../context/AppContext'
import { KashiPair } from '../types/KashiPair'
import Progress from './Progress'

export type TotalData = {
  amount: BigInt
  volumeIn24H: BigInt
  totalUsers: BigInt
  topMarkets: KashiPair[]
}

type AttributesByBorrowType = {
  progressColor: 'pink' | 'blue' | 'green'
  title: string
  users: string
}

type AttributesMapByBorrowType = {
  borrow: AttributesByBorrowType
  asset: AttributesByBorrowType
  supply: AttributesByBorrowType
}

const TotalCard = ({
  containerClass = '',
  data,
  borrow = 'borrow',
  loading = false,
}: {
  containerClass?: string
  data: TotalData
  borrow?: 'borrow' | 'asset' | 'supply'
  loading?: boolean
}) => {
  const { i18n } = useLingui()
  const AttributesMapByBorrow = {
    borrow: {
      progressColor: 'pink',
      title: i18n._('Total Borrow'),
      users: i18n._('Borrowers'),
    },
    asset: {
      progressColor: 'green',
      title: i18n._('Total Available'),
      users: i18n._('Suppliers'),
    },
    supply: {
      progressColor: 'blue',
      title: i18n._('Total Supply'),
      users: i18n._('Suppliers'),
    },
  } as AttributesMapByBorrowType
  const attributes = AttributesMapByBorrow[borrow]
  const isLoading = data.amount === BigInt(0) || loading
  const { tokenUtilService } = useAppContext()

  return (
    <div
      className={classNames({
        [containerClass]: true,
        'bg-dark-900 rounded shadow-md border border-dark-800': true,
      })}
    >
      <div className="px-8 py-5 font-semibold border-b border-dark-800">{attributes.title}</div>
      <div className="px-8 py-8">
        <div className="mb-4 text-xl font-medium">
          {isLoading ? (
            <div className="inline-block w-48 h-5 rounded animate-pulse bg-dark-700"></div>
          ) : (
            numeral(Number(data.amount) / 100.0).format('($0,0.00)')
          )}
        </div>
        <div className="mb-4 text-sm font-medium">{i18n._('Top 3 Markets')}</div>
        {isLoading ? (
          <>
            <Progress loading={isLoading} containerClass="mb-4" />
            <Progress loading={isLoading} containerClass="mb-4" />
            <Progress loading={isLoading} containerClass="mb-4" />
          </>
        ) : (
          data.topMarkets.map((marketData) => (
            <Progress
              loading={isLoading}
              key={marketData.name}
              containerClass="mb-4"
              title={tokenUtilService.pairSymbol(marketData.asset?.symbol, marketData.collateral?.symbol)}
              color={attributes.progressColor}
              progress={
                BigNumber.from(
                  borrow === 'borrow'
                    ? marketData.totalBorrow
                    : borrow === 'asset'
                    ? marketData.totalAsset
                    : BigNumber.from(marketData.totalBorrow).add(BigNumber.from(marketData.totalAsset)).toBigInt()
                )
                  .mul(BigNumber.from('10000'))
                  .div(BigNumber.from(data.amount))
                  .toNumber() / 10000
              }
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TotalCard
