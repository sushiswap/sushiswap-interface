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
import MisoLayout from 'app/layouts/Miso'
import { useRouter } from 'next/router'
import React from 'react'

const MisoAuction = () => {
  const router = useRouter()
  const { auction: address } = router.query
  const auction = useAuction(address as string)

  return (
    <div className="my-12 flex flex-col gap-10 px-6">
      <section>
        <AuctionEditHeader auction={auction} />
      </section>
      <section className="flex flex-col gap-6 w-full">
        <AuctionHeader auction={auction} />
      </section>
      <div className="flex border-b border-dark-900" />
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
    </div>
  )
}

MisoAuction.Layout = MisoLayout
MisoAuction.Guard = NetworkGuard(Feature.MISO)

export default MisoAuction
