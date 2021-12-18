import { Feature } from 'app/enums'
import AuctionClaimer from 'app/features/miso/AuctionClaimer'
import AuctionCommitter from 'app/features/miso/AuctionCommitter'
import AuctionDocuments from 'app/features/miso/AuctionDocuments'
import AuctionFinalizeModal from 'app/features/miso/AuctionFinalizeModal'
import AuctionHeader from 'app/features/miso/AuctionHeader'
import AuctionStats from 'app/features/miso/AuctionStats'
import AuctionTabs from 'app/features/miso/AuctionTabs'
import Breadcrumb from 'app/features/miso/Breadcrumb'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import { AuctionStatus } from 'app/features/miso/context/types'
import { cloudinaryLoader } from 'app/functions/cloudinary'
import NetworkGuard from 'app/guards/Network'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import { useRouter } from 'next/router'
import React from 'react'

const MisoAuction = () => {
  const router = useRouter()
  const { auction: address } = router.query
  const auction = useAuction(address as string)

  return (
    <>
      <div
        {...(auction?.auctionDocuments?.desktopBanner && {
          style: {
            backgroundImage: `url("${cloudinaryLoader({ src: auction.auctionDocuments.desktopBanner, width: 1280 })}")`,
          },
        })}
      >
        <MisoHeader
          className="bg-dark-900/90 bg-cover filter backdrop-blur-[5px]"
          breadcrumb={<Breadcrumb auction={auction} />}
        >
          <section className="flex flex-col w-full">
            <AuctionHeader auction={auction} />
          </section>
        </MisoHeader>
      </div>
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
