import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import AuctionChart from 'app/features/miso/AuctionChart'
import { Auction } from 'app/features/miso/context/Auction'
import { classNames } from 'app/functions'
import { FC, useState } from 'react'

enum ChartType {
  Price,
  FundRaised,
}

interface AuctionStatsProps {
  auction: Auction<Token, Token>
}

const AuctionStat: FC<{ label: string; value?: any }> = ({ label, value }) => {
  return (
    <div className="flex flex-col rounded gap-1">
      <Typography variant="sm" className="text-secondary text-right">
        {label}
      </Typography>
      <Typography weight={700} variant="lg" className="text-white text-right">
        {value}
      </Typography>
    </div>
  )
}

const AuctionStats: FC<AuctionStatsProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const [chartType, setChartType] = useState<ChartType>(ChartType.Price)

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-3 gap-4">
        <AuctionStat
          label={i18n._(t`Current Token Price`)}
          value={
            <div className="flex justify-end items-baseline gap-1">
              {auction.currentPrice?.toSignificant(6)}
              <Typography variant="sm" weight={700} className="text-low-emphesis">
                {auction.currentPrice?.quoteCurrency.symbol}
              </Typography>
            </div>
          }
        />
        <AuctionStat
          label={i18n._(t`Amount For Sale`)}
          value={
            <div className="flex justify-end items-baseline gap-1">
              {auction.totalTokens?.toSignificant(6)}
              <Typography variant="sm" weight={700} className="text-low-emphesis">
                {auction.totalTokens?.currency.symbol}
              </Typography>
            </div>
          }
        />
        {/*TODO RAMIN*/}
        <AuctionStat
          label={i18n._(t`Remaining`)}
          value={
            <div className="flex justify-end items-baseline gap-1">
              25
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
              Fund Raised
            </Typography>
          </div>
          <AuctionChart auction={auction} />{' '}
        </div>
      )}
    </div>
  )
}

export default AuctionStats
