import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, NATIVE, WNATIVE } from '@sushiswap/core-sdk'
import TransactionDetails from 'app/features/trident/remove/TransactionDetails'
import WithdrawalSubmittedModalContent from 'app/features/trident/WithdrawalSubmittedModalContent'
import { useActiveWeb3React } from 'app/services/web3'
import Button from 'components/Button'
import Divider from 'components/Divider'
import ListPanel from 'components/ListPanel'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import React, { FC, useCallback, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { attemptingTxnAtom, DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE, showReviewAtom } from '../../context/atoms'
import { useClassicStandardRemoveExecute } from '../../context/hooks/useClassicStandardRemoveExecute'
import { usePoolDetailsBurn } from '../../context/hooks/usePoolDetails'
import useRemovePercentageInput from '../../context/hooks/useRemovePercentageInput'

interface RemoveTransactionReviewStandardModal {}

const RemoveTransactionReviewStandardModal: FC<RemoveTransactionReviewStandardModal> = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [txHash, setTxHash] = useState<string>()

  const {
    parsedSLPAmount,
    receiveNative: [receiveNative],
    outputToWallet,
  } = useRemovePercentageInput()

  const { minLiquidityOutput } = usePoolDetailsBurn(parsedSLPAmount, DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE)

  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const receiveETH = receiveNative && outputToWallet

  const _execute = useClassicStandardRemoveExecute()

  const liquidityOutput = minLiquidityOutput.map((el) => {
    if (el?.currency.wrapped.address === WNATIVE[chainId].address && receiveETH) {
      return CurrencyAmount.fromRawAmount(NATIVE[chainId], el.quotient.toString())
    }

    return el
  })

  const execute = useCallback(async () => {
    const tx = await _execute()
    if (tx && tx.hash) {
      setTxHash(tx.hash)
    }
  }, [_execute, setTxHash])

  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => setShowReview(false)}
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col gap-8 h-full lg:max-w-md">
          <div className="relative">
            <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
            <div className="px-5 pt-5 pb-8 flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <Button
                  color="blue"
                  variant="outlined"
                  size="sm"
                  className="rounded-full py-1 pl-2 cursor-pointer"
                  startIcon={<ChevronLeftIcon width={24} height={24} />}
                  onClick={() => setShowReview(false)}
                >
                  {i18n._(t`Back`)}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="h2" weight={700} className="text-high-emphesis">
                  {i18n._(t`Confirm Withdrawal`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 px-5">
              <Typography weight={700} variant="lg">
                {i18n._(t`You'll receive (at least):`)}
              </Typography>
              <ListPanel
                items={liquidityOutput.map((parsedInputAmount, index) => (
                  <ListPanel.CurrencyAmountItem amount={parsedInputAmount} key={index} />
                ))}
              />
            </div>
            <div className="flex flex-row justify-between px-5">
              <Typography weight={700} variant="lg">
                {i18n._(t`and deposited to your:`)}
              </Typography>
              <Typography weight={700} variant="lg" className="text-high-emphesis">
                {outputToWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col px-5 gap-5">
            <Divider />
            <TransactionDetails />
            <Button disabled={attemptingTxn} color="gradient" size="lg" onClick={execute}>
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Withdrawal`)}
              </Typography>
            </Button>

            {/*spacer*/}
            <span />
          </div>
        </div>
      ) : (
        <WithdrawalSubmittedModalContent txHash={txHash} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default RemoveTransactionReviewStandardModal
