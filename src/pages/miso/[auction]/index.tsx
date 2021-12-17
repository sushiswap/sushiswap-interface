import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { Feature } from 'app/enums'
import AuctionClaimer from 'app/features/miso/AuctionClaimer'
import AuctionCommitter from 'app/features/miso/AuctionCommitter'
import AuctionDocuments from 'app/features/miso/AuctionDocuments'
import AuctionEditHeader from 'app/features/miso/AuctionEditHeader'
import AuctionFinalizeModal from 'app/features/miso/AuctionFinalizeModal'
import AuctionHeader from 'app/features/miso/AuctionHeader'
import AuctionStats from 'app/features/miso/AuctionStats'
import AuctionTabs from 'app/features/miso/AuctionTabs'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import { AuctionStatus } from 'app/features/miso/context/types'
import NetworkGuard from 'app/guards/Network'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import { useRouter } from 'next/router'
import React from 'react'

const MisoAuction = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { auction: address } = router.query
  const auction = useAuction(address as string)

  return (
    <>
      <MisoHeader className="bg-dark-900">
        {auction?.isOwner && (
          <section>
            <AuctionEditHeader auction={auction} />
          </section>
        )}
        <section className="flex flex-col w-full">
          <div>
            <Button
              onClick={() => router.back()}
              color="blue"
              variant="outlined"
              size="sm"
              className="rounded-full !pl-2 !py-1.5"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              {i18n._(t`Back`)}
            </Button>
          </div>
          <AuctionHeader auction={auction} />
        </section>
      </MisoHeader>
      <MisoBody>
        <section>
          <div className="flex flex-col lg:flex-row gap-[60px]">
            <div className="flex flex-col gap-6 lg:max-w-[396px]">
              <AuctionDocuments auction={auction} />
              <div className="flex flex-grow" />
              {auction?.status === AuctionStatus.FINISHED ? (
                <AuctionClaimer auction={auction} />
              ) : (
                <AuctionCommitter auction={auction} />
              )}
            </div>
            <AuctionStats auction={auction} />
          </div>
        </section>
        <section className="mt-4">
          <AuctionTabs auction={auction} />
        </section>
        <AuctionFinalizeModal auction={auction} />
      </MisoBody>
    </>
  )
}

MisoAuction.Layout = MisoLayout
MisoAuction.Guard = NetworkGuard(Feature.MISO)

export default MisoAuction
