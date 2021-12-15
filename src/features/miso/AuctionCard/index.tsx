import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import AuctionCardPrice from 'app/features/miso/AuctionCard/AuctionCardPrice'
import AuctionChart from 'app/features/miso/AuctionChart'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import AuctionTimer from 'app/features/miso/AuctionTimer'
import { AuctionStatus } from 'app/features/miso/context/types'
import { AuctionStatusById, AuctionTitleByTemplateId } from 'app/features/miso/context/utils'
import { classNames } from 'app/functions'
import Link from 'next/link'
import React, { FC } from 'react'

import { Auction } from '../context/Auction'
import AuctionSkeleton from './AuctionSkeleton'

const AuctionCard: FC<{ auction?: Auction; link?: boolean }> = ({ auction, link = true }) => {
  const { i18n } = useLingui()

  if (!auction) {
    return <AuctionSkeleton />
  }

  const content = (
    <div
      style={{ backgroundImage: `url("${auction.auctionDocuments.icon}")` }}
      className="bg-cover cursor-pointer rounded bg-dark-900 overflow-hidden transition-all shadow-md hover:translate-y-[-3px] hover:shadow-xl hover:shadow-pink/5"
    >
      <div className="flex flex-col gap-3.5 bg-dark-900/90 backdrop-blur-[10px] pt-2 filter">
        <div />
        <div className="flex gap-3 px-5">
          {auction.auctionDocuments.icon && (
            <div className="relative">
              <div
                className={classNames(
                  auction.status === AuctionStatus.LIVE
                    ? 'bg-green'
                    : auction.status === AuctionStatus.FINISHED
                    ? 'bg-pink'
                    : 'bg-blue',
                  'absolute top-[-2px] right-[-2px] rounded-full w-3.5 h-3.5 shadow-md shadow-dark-800'
                )}
              />
              <img alt="logo" src={auction.auctionDocuments.icon} width={48} height="auto" />
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <Typography variant="sm" weight={700} className="text-secondary">
              {auction.auctionToken.symbol}
            </Typography>
            <Typography variant="h3" weight={700} className="text-high-emphesis truncate">
              {auction.auctionToken.name}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between bg-dark-800 px-5 py-3 items-center ">
          <div className="flex gap-3">
            <AuctionIcon auctionTemplate={auction.template} width={18} height={14} />
            <Typography variant="xs" weight={700}>
              {AuctionTitleByTemplateId(i18n)[auction.template]}
            </Typography>
          </div>
          <Typography
            variant="xs"
            weight={700}
            className={
              auction.status === AuctionStatus.LIVE
                ? 'text-green'
                : auction.status === AuctionStatus.FINISHED
                ? 'text-pink'
                : auction.status === AuctionStatus.UPCOMING
                ? 'text-blue'
                : ''
            }
          >
            {AuctionStatusById(i18n)[auction.status]}
          </Typography>
        </div>
        <div className="flex justify-between px-5">
          <div className="flex flex-col">
            <Typography variant="xxs" weight={700} className="text-secondary uppercase">
              {i18n._(t`Current Token Price`)}
            </Typography>
            <Typography variant="sm" weight={700}>
              {auction.tokenPrice?.toSignificant(6)} {auction.tokenPrice?.quoteCurrency.symbol}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="xxs" weight={700} className="text-secondary uppercase">
              {i18n._(t`Amount for sale`)}
            </Typography>
            <Typography variant="sm" weight={700}>
              {auction.totalTokens?.toSignificant(6)} {auction.totalTokens?.currency.symbol}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col">
          <AuctionChart auction={auction} prices={false} />
          <div className="flex flex-col px-5 py-2 px-4 bg-dark-800 flex-grow divide-y divide-dark-700">
            <div className="flex justify-between gap-0.5 py-2">
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {i18n._(t`Auction Price`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                <AuctionCardPrice auction={auction} />
              </Typography>
            </div>
            {auction.remainingPercentage && (
              <div className="flex justify-between gap-0.5 py-2">
                <Typography variant="xs" weight={700} className="text-secondary">
                  {i18n._(t`Tokens remaining`)}
                </Typography>
                <Typography variant="xs" weight={700}>
                  {auction.remainingPercentage.toSignificant(6)}%
                </Typography>
              </div>
            )}
            <div className="flex justify-between gap-0.5 py-2">
              <Typography variant="xs" weight={700} className="text-secondary">
                {i18n._(t`Total Raised`)}
              </Typography>
              <Typography variant="xs" weight={700}>
                {auction.commitmentsTotal?.toSignificant(6)} {auction?.commitmentsTotal?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-between gap-0.5 py-2">
              <Typography variant="xs" weight={700} className="text-secondary">
                {i18n._(t`Time Remaining`)}
              </Typography>
              <Typography variant="xs" weight={700}>
                <AuctionTimer auction={auction} />
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!link) return content

  return (
    <Link href={`/miso/${auction.auctionInfo.addr}`} passHref={true}>
      {content}
    </Link>
  )
}

export default AuctionCard
