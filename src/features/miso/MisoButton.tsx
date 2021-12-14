import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, NativeCurrency, Token, ZERO } from '@sushiswap/core-sdk'
import LoadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import CommitReviewModal from 'app/features/miso/CommitReviewModal'
import { Auction } from 'app/features/miso/context/Auction'
import { useAuctionsPointList } from 'app/features/miso/context/hooks/useAuctionsPointList'
import { AuctionStatus } from 'app/features/miso/context/types'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC, useState } from 'react'

interface MisoButtonProps {
  auction: Auction
  amount?: CurrencyAmount<Token | NativeCurrency>
}

const MisoButton: FC<MisoButtonProps> = ({ auction, amount }) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [approvalState, approve] = useApproveCallback(amount, auction.auctionInfo.addr)
  const [review, setReview] = useState(false)
  const whitelisted = useAuctionsPointList(auction.auctionInfo.usePointList ? auction : undefined)

  if (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) {
    return (
      <Button
        disabled={auction.status === AuctionStatus.FINISHED || approvalState === ApprovalState.PENDING}
        className="h-[74px]"
        color="blue"
        onClick={approve}
        {...(approvalState === ApprovalState.PENDING && {
          startIcon: (
            <div className="w-4 h-4 mr-1">
              <Lottie animationData={LoadingCircle} autoplay loop />
            </div>
          ),
        })}
      >
        {auction.status === AuctionStatus.FINISHED ? i18n._(t`Sale Finished`) : i18n._(t`Approve`)}
      </Button>
    )
  }

  const error =
    auction.auctionInfo.usePointList && account && !whitelisted.includes(account)
      ? i18n._(t`Not whitelisted`)
      : !amount?.greaterThan(ZERO)
      ? i18n._(t`Input amount`)
      : auction.status === AuctionStatus.FINISHED
      ? i18n._(t`Sale Finished`)
      : ''

  return (
    <>
      <Button
        onClick={() => setReview(true)}
        disabled={!!error || auction.status !== AuctionStatus.LIVE}
        className="outline-none h-[74px] bg-gradient-to-r from-red via-pink to-red transition-all disabled:scale-[1] hover:scale-[1.02] !opacity-100 disabled:!opacity-40"
      >
        <div className="flex flex-col">
          <Typography className="text-white" weight={700}>
            {error ? error : i18n._(t`Commit`)}
          </Typography>
        </div>
      </Button>
      <CommitReviewModal amount={amount} auction={auction} open={review} onDismiss={() => setReview(false)} />
    </>
  )
}

export default MisoButton
