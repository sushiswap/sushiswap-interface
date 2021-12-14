import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import AuctionHeaderSkeleton from 'app/features/miso/AuctionHeader/AuctionHeaderSkeleton'
import AuctionTimer from 'app/features/miso/AuctionTimer'
import { Auction } from 'app/features/miso/context/Auction'
import { useAuctionDocuments } from 'app/features/miso/context/hooks/useAuctionDocuments'
import { AuctionStatus } from 'app/features/miso/context/types'
import { AuctionStatusById } from 'app/features/miso/context/utils'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

interface AuctionHeaderProps {
  auction?: Auction
}
const AuctionHeader: FC<AuctionHeaderProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const [documents] = useAuctionDocuments(auction)

  if (!auction) return <AuctionHeaderSkeleton />

  return (
    <div className="grid md:grid-cols-3 grid-cols-2 items-end gap-8 md:gap-0">
      <div className="flex gap-3 order-1 md:order-1">
        {documents && documents.icon && <img alt="logo" src={documents.icon} width={60} height="auto" />}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Typography weight={700} className="text-secondary">
              {auction.auctionToken.symbol}
            </Typography>
            {auction && (
              <Chip
                size="sm"
                color={
                  auction.status === AuctionStatus.LIVE
                    ? 'green'
                    : auction.status === AuctionStatus.UPCOMING
                    ? 'blue'
                    : 'pink'
                }
                label={AuctionStatusById(i18n)[auction.status]}
              />
            )}
          </div>
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {auction.auctionToken.name}
          </Typography>
        </div>
      </div>
      <div className="flex col-span-2 md:col-span-1 order-3 md:order-3 justify-center">
        <AuctionTimer auction={auction}>
          {({ days, hours, minutes, seconds }) => {
            return (
              <div className="grid grid-cols-7 rounded">
                <div className="col-span-7 mb-3">
                  <Typography
                    weight={700}
                    className={classNames(
                      auction.status === AuctionStatus.UPCOMING
                        ? 'text-blue'
                        : auction.status === AuctionStatus.LIVE
                        ? 'text-green'
                        : 'text-pink',
                      'tracking-[0.3em] text-center'
                    )}
                  >
                    {auction.status === AuctionStatus.UPCOMING
                      ? i18n._(t`SALE STARTS IN`)
                      : auction.status === AuctionStatus.LIVE
                      ? i18n._(t`SALE LIVE`)
                      : i18n._(t`SALE FINISHED`)}
                  </Typography>
                </div>
                <Typography variant="h3" weight={700} className="text-mono text-white text-center">
                  {days}
                </Typography>
                <Typography variant="lg" className="text-mono text-low-emphesis text-center">
                  :
                </Typography>
                <Typography variant="h3" weight={700} className="text-mono text-white text-center">
                  {hours}
                </Typography>
                <Typography variant="lg" className="text-mono text-low-emphesis text-center">
                  :
                </Typography>
                <Typography variant="h3" weight={700} className="text-mono text-white text-center">
                  {minutes}
                </Typography>
                <Typography variant="lg" className="text-mono text-low-emphesis text-center">
                  :
                </Typography>
                <Typography variant="h3" weight={700} className="text-mono text-white text-center">
                  {seconds}
                </Typography>
                <Typography variant="xs" weight={700} className="text-low-emphesis text-mono text-center mt-1">
                  {i18n._(t`Days`)}
                </Typography>
                <div />
                <Typography variant="xs" weight={700} className="text-low-emphesis text-mono text-center mt-1">
                  {i18n._(t`Hours`)}
                </Typography>
                <div />
                <Typography variant="xs" weight={700} className="text-low-emphesis text-mono text-center mt-1">
                  {i18n._(t`Minutes`)}
                </Typography>
                <div />
                <Typography variant="xs" weight={700} className="text-low-emphesis text-mono text-center mt-1">
                  {i18n._(t`Seconds`)}
                </Typography>
              </div>
            )
          }}
        </AuctionTimer>
      </div>
      <div className="flex gap-5 justify-end order-2 md:order-3">
        <div className="flex flex-col gap-1">
          <Typography weight={700} variant="sm" className="text-secondary">
            {i18n._(t`Current Token Price`)}
          </Typography>
          <div className="flex justify-end items-baseline w-full gap-1">
            <Typography variant="h2" weight={700} className="text-high-emphesis text-right">
              {auction.currentPrice?.toSignificant(6)}
            </Typography>
            <Typography variant="lg" weight={700} className="text-right">
              {auction.currentPrice?.quoteCurrency.symbol}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionHeader
