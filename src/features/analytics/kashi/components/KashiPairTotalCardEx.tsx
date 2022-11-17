import { useLingui } from '@lingui/react'
import KashiMediumRiskLendingPair from 'app/features/kashi/KashiMediumRiskLendingPair'
import { formatNumber } from 'app/functions'
import classNames from 'classnames'

import Progress from './Progress'

type AttributesByBorrowType = {
  progressColor: 'green' | 'pink' | 'blue'
  title: string
  users: string
}

type AttributesMapByBorrowType = {
  borrow: AttributesByBorrowType
  asset: AttributesByBorrowType
  supply: AttributesByBorrowType
}

const KashiPairTotalCard = ({
  containerClass = '',
  data,
  borrow = 'borrow',
  loading = false,
}: {
  containerClass?: string
  data: KashiMediumRiskLendingPair[]
  borrow?: 'borrow' | 'asset' | 'supply'
  loading?: boolean
}) => {
  const { i18n } = useLingui()
  const AttributesMapByBorrow = {
    borrow: {
      progressColor: 'pink',
      title: i18n._('Total Borrow'),
    },
    asset: {
      progressColor: 'green',
      title: i18n._('Total Available'),
    },
    supply: {
      progressColor: 'blue',
      title: i18n._('Total Supply'),
    },
  } as AttributesMapByBorrowType

  const attributes = AttributesMapByBorrow[borrow]
  const isLoading = loading || !data
  const amount = data.reduce(
    (
      value: { totalAssetAmountUSD: number; currentAllAssetsUSD: number; currentBorrowAmountUSD: number },
      market: KashiMediumRiskLendingPair
    ) => {
      value.currentAllAssetsUSD += Number(market.currentAllAssetsUSD?.toFixed(0)) || 0
      value.currentBorrowAmountUSD += Number(market.currentBorrowAmountUSD?.toFixed(0)) || 0
      value.totalAssetAmountUSD += Number(market.totalAssetAmountUSD?.toFixed(0)) || 0
      return value
    },
    { totalAssetAmountUSD: 0, currentAllAssetsUSD: 0, currentBorrowAmountUSD: 0 }
  )

  const sortFunc = {
    borrow: (a: KashiMediumRiskLendingPair, b: KashiMediumRiskLendingPair) =>
      (Number(b.currentBorrowAmountUSD?.toFixed(0)) || 0) - (Number(a.currentBorrowAmountUSD?.toFixed(0)) || 0),
    asset: (a: KashiMediumRiskLendingPair, b: KashiMediumRiskLendingPair) =>
      (Number(b.totalAssetAmountUSD?.toFixed(0)) || 0) - (Number(a.totalAssetAmountUSD?.toFixed(0)) || 0),
    supply: (a: KashiMediumRiskLendingPair, b: KashiMediumRiskLendingPair) =>
      (Number(b.currentAllAssetsUSD?.toFixed(0)) || 0) - (Number(a.currentAllAssetsUSD?.toFixed(0)) || 0),
  }
  const top3 = data.length > 3 ? [...data].sort(sortFunc[borrow]).slice(0, 3) : [...data]

  return (
    <div
      className={classNames({
        [containerClass]: true,
        'bg-dark-900 rounded shadow-md': true,
      })}
    >
      <div className="px-8 py-6 font-semibold">{attributes.title}</div>
      <div className="px-8 pb-4">
        <div className="mb-4 text-xl font-medium">
          {isLoading ? (
            <div className="inline-block w-48 h-5 rounded bg-dark-700 animate-pulse"></div>
          ) : (
            formatNumber(
              borrow === 'borrow'
                ? amount.currentBorrowAmountUSD
                : borrow === 'asset'
                ? amount.totalAssetAmountUSD
                : amount.currentAllAssetsUSD,
              true
            )
          )}
        </div>
        <div className="mb-4 text-sm font-medium">Top 3 Markets</div>
        {isLoading ? (
          <>
            <Progress loading={isLoading} containerClass="mb-4" />
            <Progress loading={isLoading} containerClass="mb-4" />
            <Progress loading={isLoading} containerClass="mb-4" />
          </>
        ) : (
          top3.map((market) => (
            <Progress
              loading={loading}
              key={market.address}
              containerClass="mb-4"
              title={`${market.asset.token.symbol}/${market.collateral.token.symbol}`}
              color={attributes.progressColor}
              progress={
                borrow === 'borrow'
                  ? (Number(market.currentBorrowAmountUSD?.toFixed(0)) || 0) / (amount.currentBorrowAmountUSD || 1)
                  : borrow === 'asset'
                  ? (Number(market.totalAssetAmountUSD?.toFixed(0)) || 0) / (amount.totalAssetAmountUSD || 1)
                  : (Number(market.currentAllAssetsUSD?.toFixed(0)) || 0) / (amount.currentAllAssetsUSD || 1)
              }
            />
          ))
        )}
      </div>
    </div>
  )
}

export default KashiPairTotalCard
