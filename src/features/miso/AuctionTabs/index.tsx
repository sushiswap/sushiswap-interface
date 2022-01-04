import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import AuctionAboutTab from 'app/features/miso/AuctionTabs/AuctionAboutTab'
import AuctionBidsTab from 'app/features/miso/AuctionTabs/AuctionBidsTab'
import AuctionDetailsTab from 'app/features/miso/AuctionTabs/AuctionDetailsTab'
import { Auction } from 'app/features/miso/context/Auction'
import { classNames } from 'app/functions'
import React, { FC, useState } from 'react'

import AuctionTabsSkeleton from './AuctionTabsSkeleton'

interface AuctionTabsProps {
  auction?: Auction
}

const AuctionTabs: FC<AuctionTabsProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const tabs = [i18n._(t`Auction Details`), i18n._(t`Commitments`), i18n._(t`About Project`)]
  const [tab, setTab] = useState(0)

  if (!auction) return <AuctionTabsSkeleton />

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex space-x-8 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b border-dark-800 mb-4"
        aria-label="Tabs"
      >
        {tabs.map((_tab, index) => (
          <div key={_tab} onClick={() => setTab(index)} className="space-y-2 cursor-pointer h-full">
            <div
              className={classNames(
                index === tab ? 'text-high-emphesis' : '',
                'capitalize font-bold text-sm text-secondary'
              )}
            >
              {_tab}
            </div>
            <div
              className={classNames(
                index === tab ? 'relative bg-gradient-to-r from-red via-pink to-red h-[3px] w-full' : ''
              )}
            />
          </div>
        ))}
      </div>
      <AuctionDetailsTab auction={auction} active={tab === 0} />
      <AuctionBidsTab auction={auction} active={tab === 1} />
      <AuctionAboutTab auction={auction} active={tab === 2} />
    </div>
  )
}

export default AuctionTabs
