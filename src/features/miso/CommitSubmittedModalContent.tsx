import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import suppySubmitted from 'app/animation/supply-submitted.json'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { getExplorerLink } from 'app/functions/explorer'
import { useActiveWeb3React } from 'app/services/web3'
import { transactionStateSelector } from 'app/state/global/transactions'
import Lottie from 'lottie-react'
import Link from 'next/link'
import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'

const CommitSubmittedModalContent: FC<{ txHash: string }> = ({ txHash }) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { pending, success, cancelled, failed } = useRecoilValue(transactionStateSelector(txHash))

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-8 lg:p-8 bg-gradient-to-r from-pink/20 to-red/20">
      <div className="w-[102px] h-[102px] rounded-full">
        <Lottie animationData={suppySubmitted} autoplay loop={false} />
      </div>
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        {i18n._(t`Success! Commit Submitted`)}
      </Typography>
      <div className="flex flex-col gap-1 px-3 py-2 rounded">
        <div className="flex items-center justify-center gap-2">
          <Typography variant="sm" weight={700} className="text-blue">
            <a target="_blank" rel="noreferrer" href={getExplorerLink(chainId, txHash, 'transaction')}>
              {i18n._(t`View on Explorer`)}
            </a>
          </Typography>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          {pending ? (
            <div className="w-4 h-4">
              <Lottie animationData={loadingCircle} autoplay loop />
            </div>
          ) : success ? (
            <CheckCircleIcon className="w-4 h-4 text-green" />
          ) : cancelled || failed ? (
            <XCircleIcon className="w-4 h-4 text-high-emphesis" />
          ) : (
            ''
          )}
          <Typography id={`div-deposit-status`} variant="sm" weight={700} className="italic">
            {pending
              ? i18n._(t`Processing`)
              : success
              ? i18n._(t`Success`)
              : cancelled
              ? i18n._(t`Cancelled`)
              : failed
              ? i18n._(t`Failed`)
              : ''}
          </Typography>
        </div>
      </div>
      <Button
        id={`btn-backToAuctions`}
        variant="filled"
        color="blue"
        className="bg-gradient-to-r from-red via-pink to-red"
      >
        <Link href="/miso" passHref={true}>
          <a>{i18n._(t`Back to Auctions`)}</a>
        </Link>
      </Button>
    </div>
  )
}

export default CommitSubmittedModalContent
