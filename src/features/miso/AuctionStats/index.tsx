import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import AuctionChart from 'app/features/miso/AuctionChart'
import AuctionStatsSkeleton from 'app/features/miso/AuctionStats/AuctionStatsSkeleton'
import { Auction } from 'app/features/miso/context/Auction'
import { classNames } from 'app/functions'
import { FC, useState } from 'react'

enum ChartType {
  Price,
  FundRaised,
}

interface AuctionStatsProps {
  auction?: Auction
}

const AuctionStat: FC<{ label: string; value?: any; className?: string }> = ({ label, value, className }) => {
  return (
    <div className="flex flex-col rounded gap-1">
      <Typography variant="sm" className={classNames('text-secondary', className)}>
        {label}
      </Typography>
      <Typography weight={700} variant="lg" className={classNames('text-white', className)}>
        {value}
      </Typography>
    </div>
  )
}

const AuctionStats: FC<AuctionStatsProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const [chartType, setChartType] = useState<ChartType>(ChartType.Price)

  if (!auction) return <AuctionStatsSkeleton />

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-2">
        <AuctionStat
          className="text-left"
          label={i18n._(t`Current Token Price`)}
          value={
            <div className="flex justify-start items-baseline gap-1">
              {auction.tokenPrice?.toSignificant(6)}
              <Typography variant="sm" weight={700} className="text-low-emphesis">
                {auction.tokenPrice?.quoteCurrency.symbol}
              </Typography>
            </div>
          }
        />
        <AuctionStat
          className="text-right"
          label={i18n._(t`Amount Raised`)}
          value={
            <div className="flex justify-end items-baseline gap-1">
              {auction.totalTokensCommitted?.toSignificant(6)}
              <Typography variant="sm" weight={700} className="text-low-emphesis">
                {auction.totalTokensCommitted?.currency.symbol}
              </Typography>
            </div>
          }
        />
        <AuctionStat
          className="text-left lg:text-right"
          label={i18n._(t`Amount For Sale`)}
          value={
            <div className="flex justify-start items-baseline gap-1 lg:justify-end">
              {auction.totalTokens?.toSignificant(6)}
              <Typography variant="sm" weight={700} className="text-low-emphesis">
                {auction.totalTokens?.currency.symbol}
              </Typography>
            </div>
          }
        />
        <AuctionStat
          className="text-right"
          label={i18n._(t`Remaining`)}
          value={
            <div className="flex justify-end items-baseline gap-1">
              {auction.remainingPercentage?.toSignificant(6)}
              <Typography variant="sm" weight={700} className="text-low-emphesis">
                %
              </Typography>
            </div>
          }
        />
      </div>
      {auction && (
        <div className="flex flex-col bg-[rgba(255,255,255,0.04)] border border-dark-900 rounded gap-5 shadow-2xl shadow-pink-red/5 h-full">
          <div className="flex justify-end gap-6 p-5">
            <Typography
              weight={chartType === ChartType.Price ? 700 : 400}
              variant="lg"
              role="button"
              onClick={() => setChartType(ChartType.Price)}
              className={classNames(
                chartType === ChartType.Price
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-red to-pink'
                  : 'text-secondary'
              )}
            >
              {i18n._(t`Price`)}
            </Typography>
            <Typography
              weight={chartType === ChartType.FundRaised ? 700 : 400}
              variant="lg"
              role="button"
              onClick={() => setChartType(ChartType.FundRaised)}
              className={classNames(
                chartType === ChartType.FundRaised
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-red to-pink'
                  : 'text-secondary'
              )}
            >
              {i18n._(t`Fund Raised`)}
            </Typography>
          </div>
          <AuctionChart auction={auction} />
        </div>
      )}
    </div>
  )
}

export default AuctionStats
