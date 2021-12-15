import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface AuctionEditHeaderProps {
  auction?: Auction
}

const AuctionEditHeader: FC<AuctionEditHeaderProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { finalizeAuction } = useAuctionEdit(
    auction?.auctionInfo.addr,
    auction?.template,
    auction?.marketInfo.liquidityTemplate
  )
  const { auction: address } = router.query

  if (!auction?.isOwner) return <></>

  return (
    <div className="flex justify-start rounded gap-4">
      <Link href={`/miso/${address as string}/admin`} passHref={true}>
        <div>
          <Button className="border-dark-900 border px-4 py-2 shadow shadow-pink-red/5 !text-transparent bg-clip-text bg-gradient-to-r rounded from-blue via-pink to-red transition-all disabled:scale-[1] hover:scale-[1.05]">
            {i18n._(t`Edit Auction`)}
          </Button>
        </div>
      </Link>
      {auction.canFinalize && (
        <Button
          onClick={() => finalizeAuction()}
          className="border-dark-900 border px-4 py-2 shadow shadow-pink-red/5 !text-transparent bg-clip-text bg-gradient-to-r rounded from-blue via-pink to-red transition-all disabled:scale-[1] hover:scale-[1.05]"
        >
          {i18n._(t`Finalize Auction`)}
        </Button>
      )}
    </div>
  )
}

export default AuctionEditHeader
