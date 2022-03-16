import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import Error from 'app/components/Error'
import { Feature } from 'app/enums'
import AuctionClaimer from 'app/features/miso/AuctionClaimer'
import AuctionCommitter from 'app/features/miso/AuctionCommitter'
import AuctionDocuments from 'app/features/miso/AuctionDocuments'
import AuctionFinalizeModal from 'app/features/miso/AuctionFinalizeModal'
import AuctionHeader from 'app/features/miso/AuctionHeader'
import AuctionStats from 'app/features/miso/AuctionStats'
import AuctionTabs from 'app/features/miso/AuctionTabs'
import Breadcrumb from 'app/features/miso/Breadcrumb'
import { AuctionContext } from 'app/features/miso/context/AuctionContext'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import { AuctionStatus } from 'app/features/miso/context/types'
import NetworkGuard from 'app/guards/Network'
import { useRedirectOnChainId } from 'app/hooks/useRedirectOnChainId'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React from 'react'

const MisoAuction = () => {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const { auction: address } = router.query
  const { auction, loading, error } = useAuction(address as string, account ?? AddressZero)

  // Redirect to overview on chainId change
  useRedirectOnChainId('/miso')

  if ((!loading && error) || !isAddress(address as string)) {
    return <Error statusCode={404} />
  }

  return (
    <AuctionContext auction={auction} loading={loading}>
      <MisoHeader breadcrumb={<Breadcrumb auction={auction} />} auction={auction}>
        <section className="flex flex-col w-full">
          <AuctionHeader />
        </section>
      </MisoHeader>
      <MisoBody>
        <section>
          <div className="flex flex-col lg:flex-row gap-[60px]">
            <div className="flex flex-col gap-6 lg:min-w-[396px] lg:max-w-[396px]">
              <AuctionDocuments />
              <div className="flex flex-grow" />
              {auction?.status === AuctionStatus.FINISHED ? <AuctionClaimer /> : <AuctionCommitter />}
            </div>
            <AuctionStats />
          </div>
        </section>
        <section className="mt-4">
          <AuctionTabs />
        </section>
        <AuctionFinalizeModal />
      </MisoBody>
    </AuctionContext>
  )
}

MisoAuction.Layout = MisoLayout
MisoAuction.Guard = NetworkGuard(Feature.MISO)

export default MisoAuction
