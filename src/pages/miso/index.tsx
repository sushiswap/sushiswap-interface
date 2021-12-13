import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import AuctionCard from 'app/features/miso/AuctionCard'
import useMisoAuctions from 'app/features/miso/context/hooks/useMisoAuctions'
import { AuctionStatus } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import MisoLayout from 'app/layouts/Miso'
import React, { useState } from 'react'

const Miso = () => {
  const { i18n } = useLingui()
  const [tab, setTab] = useState(AuctionStatus.LIVE)
  const auctions = useMisoAuctions(tab, undefined)

  return (
    <section className="flex my-12 flex-col gap-10 px-6">
      <div className="flex flex-col gap-3">
        <Typography variant="h3" weight={700}>
          {i18n._(t`Chef's Edition`)}
        </Typography>
        <Typography className="text-secondary">
          {i18n._(t`These auctions are meticulously chosen by the Sushi Samurais, serving the best MISO for you.`)}
        </Typography>
      </div>
      <div className="flex flex-col border-b border-dark-800">
        <div className="flex flex-row space-x-8 overflow-x-auto overflow-y-hidden whitespace-nowrap" aria-label="Tabs">
          {[AuctionStatus.LIVE, AuctionStatus.UPCOMING, AuctionStatus.FINISHED].map((_tab) => (
            <div key={_tab} onClick={() => setTab(_tab)} className="space-y-2 cursor-pointer h-full">
              <div
                className={classNames(
                  _tab === tab ? 'text-high-emphesis' : '',
                  'capitalize font-bold text-sm text-secondary'
                )}
              >
                {AuctionStatus[_tab]}
              </div>
              <div
                className={classNames(_tab === tab ? 'relative bg-gradient-to-r from-blue to-pink h-[3px] w-full' : '')}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {auctions?.map((auction, index) => {
          return <AuctionCard auction={auction} key={index} />
        })}
      </div>
    </section>
  )
}

Miso.Layout = MisoLayout
Miso.Guard = NetworkGuard(Feature.MISO)

export default Miso
