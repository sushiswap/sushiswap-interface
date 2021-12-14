import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { Auction } from 'app/features/miso/context/Auction'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface AuctionEditHeaderProps {
  auction?: Auction
}

const AuctionEditHeader: FC<AuctionEditHeaderProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { auction: address } = router.query

  if (!auction?.isOwner) return <></>

  return (
    <div className="flex justify-start rounded">
      <Link href={`/miso/${address as string}/admin`} passHref={true}>
        <div>
          <Typography
            role="button"
            variant="lg"
            className="border-dark-900 border px-4 py-2 shadow shadow-pink-red/5 text-transparent bg-clip-text bg-gradient-to-r rounded from-blue via-pink to-red transition-all disabled:scale-[1] hover:scale-[1.05]"
            weight={700}
          >
            {i18n._(t`Edit Auction`)}
          </Typography>
        </div>
      </Link>
    </div>
  )
}

export default AuctionEditHeader
