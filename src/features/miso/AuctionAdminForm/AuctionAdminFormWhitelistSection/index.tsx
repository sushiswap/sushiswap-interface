import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import ListOperator from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/ListOperator'
import PermissionListStatusSwitch from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/PermissionListStatusSwitch'
import PointListDragAndDrop from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/PointListDragAndDrop'
import WhitelistChecker from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/WhitelistChecker'
import { Auction } from 'app/features/miso/context/Auction'
import React, { FC } from 'react'

interface AuctionAdminFormWhitelistSectionProps {
  auction: Auction
}

const AuctionAdminFormWhitelistSection: FC<AuctionAdminFormWhitelistSectionProps> = ({ auction }) => {
  const { i18n } = useLingui()

  return (
    <div className="pt-8">
      <div className="flex flex-col gap-1">
        <Typography variant="lg" className="text-high-emphesis" weight={700}>
          {i18n._(t`Whitelisting`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(
            t`Auctions are open by default. You can add a smart contract with approval logic to your auction. This will restrict users participating in your auction if enabled. Please refer to our developer documentation and sample list in our Github Repo.`
          )}
        </Typography>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <PermissionListStatusSwitch auction={auction} />
        </div>
        <ListOperator auction={auction} />
        <PointListDragAndDrop auction={auction} />
        <WhitelistChecker auction={auction} />
      </div>
    </div>
  )
}

export default AuctionAdminFormWhitelistSection
