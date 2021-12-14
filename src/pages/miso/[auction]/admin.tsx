import { EmojiSadIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import AuctionAdminForm from 'app/features/miso/AuctionAdminForm'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import NetworkGuard from 'app/guards/Network'
import MisoLayout from 'app/layouts/Miso'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const MisoAuction = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const { auction: address } = router.query
  const auction = useAuction(address as string, account ?? undefined)

  const header = (
    <div className="flex flex-col gap-4">
      <div>
        <Button
          color="blue"
          variant="outlined"
          size="sm"
          className="rounded-full !pl-2 !py-1.5"
          startIcon={<ChevronLeftIcon width={24} height={24} />}
        >
          <Link href={`/miso/${address}`}>{i18n._(t`Auction`)}</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`Edit Auction`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Only the Auction admin and approved operators for this auction are able to edit any of the details below.
Do not waste your gas.`)}
        </Typography>
      </div>
    </div>
  )

  if (!account || !auction) {
    return (
      <div className="flex flex-col my-12 gap-12 px-6">
        {header}
        <div className="p-10 rounded animate-pulse w-full h-[2700px] bg-dark-900" />
      </div>
    )
  }

  if (!auction?.isOwner) {
    return (
      <div className="flex flex-col my-12 gap-12 px-6">
        {header}
        <div className="flex gap-4 items-center">
          <EmojiSadIcon width={40} />
          <Typography weight={700}>
            {i18n._(t`Oops! You're not allowed to edit this page.`)}{' '}
            <span className="text-blue">
              <Link href={`/miso/${address}`}>{i18n._(t`Go back to auction`)}</Link>
            </span>
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col my-12 gap-12 px-6">
      {header}
      <AuctionAdminForm auction={auction} />
    </div>
  )
}

MisoAuction.Layout = MisoLayout
MisoAuction.Guard = NetworkGuard(Feature.MISO)

export default MisoAuction
