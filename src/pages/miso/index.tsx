import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import AuctionCard from 'app/features/miso/AuctionCard'
import { useAuctions } from 'app/features/miso/context/hooks/useAuction'
import { AuctionStatus } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
const queryToAuctionStatus = {
  live: AuctionStatus.LIVE,
  upcoming: AuctionStatus.UPCOMING,
  finished: AuctionStatus.FINISHED,
}

const Miso = () => {
  const { i18n } = useLingui()
  const { query } = useRouter()
  const auctions = useAuctions(queryToAuctionStatus[query?.status as string] ?? AuctionStatus.LIVE)

  const tabs = [
    { key: AuctionStatus.LIVE, value: i18n._(t`Live`), link: 'live' },
    { key: AuctionStatus.UPCOMING, value: i18n._(t`Upcoming`), link: 'upcoming' },
    { key: AuctionStatus.FINISHED, value: i18n._(t`Finished`), link: 'finished' },
  ]

  return (
    <>
      <MisoHeader>
        <div className="flex justify-between lg:flex-row flex-col gap-8">
          <div className="flex flex-col">
            <Typography variant="hero" weight={700} className="text-white">
              {i18n._(t`Chef's Edition`)}
            </Typography>
            <Typography weight={700}>
              {i18n._(t`These auctions are meticulously chosen by the Sushi Samurais, serving the best MISO for you.`)}
            </Typography>
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <Link href="/miso/auction" passHref={true}>
                <Button
                  color="blue"
                  className="rounded-full bg-gradient-to-r from-pink-red via-pink to-red text-white transition hover:scale-[1.05]"
                >
                  {i18n._(t`Create Auction`)}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MisoHeader>
      <MisoBody>
        <section className="flex flex-col gap-10">
          <div className="flex flex-col">
            <div
              className="flex flex-row space-x-8 overflow-x-auto overflow-y-hidden whitespace-nowrap"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <Link href={`/miso?status=${tab.link}`} key={tab.key} passHref={true}>
                  <div className="space-y-2 cursor-pointer h-full">
                    <Typography
                      weight={700}
                      className={classNames(
                        tab.key === (queryToAuctionStatus[query?.status as string] || AuctionStatus.LIVE)
                          ? 'bg-gradient-to-r from-red to-pink bg-clip-text text-transparent'
                          : '',
                        'font-bold text-sm text-high-emphesis'
                      )}
                    >
                      {tab.value}
                    </Typography>
                    <div
                      className={classNames(
                        tab.key === queryToAuctionStatus[query?.status as string]
                          ? 'relative bg-gradient-to-r from-red to-pink h-[3px] w-full'
                          : ''
                      )}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {auctions?.length} Results
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {auctions?.map((auction, index) => {
                return <AuctionCard auction={auction} key={index} />
              })}
            </div>
          </div>
        </section>
      </MisoBody>
    </>
  )
}

Miso.Layout = MisoLayout
Miso.Guard = NetworkGuard(Feature.MISO)

export default Miso
