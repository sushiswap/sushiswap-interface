import { Feature } from 'app/enums'
import AuctionCommitter from 'app/features/miso/AuctionCommitter'
import AuctionDocuments from 'app/features/miso/AuctionDocuments'
import AuctionHeader from 'app/features/miso/AuctionHeader'
import AuctionStats from 'app/features/miso/AuctionStats'
import AuctionTabs from 'app/features/miso/AuctionTabs'
import useAuction from 'app/features/miso/context/hooks/useAuction'
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
      <section className="flex flex-col gap-6 w-full">
        <AuctionHeader auction={auction} />
      </section>
      <div className="flex border-b border-dark-900" />
      <section>
        <div className="flex flex-col lg:flex-row gap-[60px]">
          <div className="flex flex-col gap-6">
            <AuctionDocuments auction={auction} />
            <AuctionCommitter auction={auction} />
          </div>
          <AuctionStats auction={auction} />
        </div>
      </section>
      <section className="mt-4">
        <AuctionTabs auction={auction} />
      </section>
    </div>
  )
}

MisoAuction.Layout = MisoLayout
MisoAuction.Guard = NetworkGuard(Feature.MISO)

export default MisoAuction
