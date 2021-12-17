import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import ListOperator from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/ListOperator'
import PointListDragAndDrop from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/PointListDragAndDrop'
import WhitelistChecker from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/WhitelistChecker'
import { Auction } from 'app/features/miso/context/Auction'
import React, { FC } from 'react'

import PermissionListStatusSwitch from './PermissionListStatusSwitch'

interface AuctionAdminFormWhitelistSectionProps {
  auction: Auction
}

const AuctionAdminFormWhitelistSection: FC<AuctionAdminFormWhitelistSectionProps> = ({ auction }) => {
  const { i18n } = useLingui()

  return (
    <Form.Section
      columns={1}
      header={
        <Form.Section.Header
          header={i18n._(t`Whitelisting`)}
          subheader={i18n._(
            t`Auctions are open by default. You can add a smart contract with approval logic to your auction. This will restrict users participating in your auction if enabled. Please refer to our developer documentation and sample list in our Github Repo.`
          )}
        />
      }
    >
      <div className="sm:col-span-6">
        <PermissionListStatusSwitch auction={auction} />
      </div>
      <div className="sm:col-span-6">
        <ListOperator auction={auction} />
      </div>
      <PointListDragAndDrop auction={auction} />
      <div className="sm:col-span-6">
        <WhitelistChecker auction={auction} />
      </div>
    </Form.Section>
  )
}

export default AuctionAdminFormWhitelistSection
