import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import React, { FC } from 'react'

interface AuctionFinalizeModalProps {
  auction?: Auction
}

const AuctionFinalizeModal: FC<AuctionFinalizeModalProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const { finalizeAuction } = useAuctionEdit(
    auction?.auctionInfo.addr,
    auction?.template,
    auction?.auctionInfo.liquidityTemplate
  )

  return (
    <HeadlessUiModal.Controlled isOpen={auction?.canFinalize || false} onDismiss={() => {}} className="bg-transparent">
      <div className="flex flex-col items-center h-full gap-2 pb-8 m-5">
        <div className="flex flex-col justify-center">
          <Typography variant="hero" weight={700} className="text-high-emphesis text-center">
            {auction?.auctionInfo.auctionSuccessful ? i18n._(t`Congratulations!`) : i18n._(t`Shoot!`)}
          </Typography>
          <Typography weight={700} className="text-secondary text-center">
            {auction?.auctionInfo.auctionSuccessful
              ? i18n._(t`Your auction was successful!`)
              : i18n._(t`Your auction failed to reach its minimum raise`)}
          </Typography>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => finalizeAuction()}
            className="!text-2xl !opacity-100 px-6 py-2 !text-transparent bg-clip-text bg-gradient-to-r rounded from-red to-pink transition-all disabled:scale-[1] hover:scale-[1.05]"
          >
            {i18n._(t`Finalize Auction`)}
          </Button>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default AuctionFinalizeModal
