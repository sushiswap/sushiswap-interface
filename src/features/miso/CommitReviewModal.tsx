import { ChevronRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, ZERO } from '@sushiswap/core-sdk'
import Chip from 'app/components/Chip'
import CurrencyLogo from 'app/components/CurrencyLogo'
import { RestrictedIcon } from 'app/components/Icon'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import CommitSubmittedModalContent from 'app/features/miso/CommitSubmittedModalContent'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { AuctionTitleByTemplateId, MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Button from 'components/Button'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import React, { FC, useCallback, useState } from 'react'

import { Auction } from './context/Auction'

interface CommitReviewStandardModalProps {
  auction: Auction
  open: boolean
  onDismiss(): void
  amount?: CurrencyAmount<Currency>
}

const CommitReviewStandardModal: FC<CommitReviewStandardModalProps> = ({ auction, open, onDismiss, amount }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [txHash, setTxHash] = useState<string>()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const addTransaction = useTransactionAdder()
  const contract = useContract(
    auction?.auctionInfo.addr,
    chainId && auction ? MisoAbiByTemplateId(chainId, auction.template) : undefined
  )

  const _onDismiss = useCallback(() => {
    setAttemptingTxn(false)
    onDismiss()
  }, [onDismiss])

  const execute = useCallback(async () => {
    if (!contract || !amount || !amount.greaterThan(ZERO)) return

    setAttemptingTxn(true)

    try {
      let tx
      if (auction.paymentToken.isNative) {
        tx = await contract.commitEth(account, true, { value: amount.quotient.toString() })
      } else {
        tx = await contract.commitTokens(amount.quotient.toString(), true)
      }

      setTxHash(tx.hash)
      await tx.wait()

      addTransaction(tx, {
        summary: i18n._(t`Committed ${amount?.toSignificant(6)} ${amount.currency.symbol}`),
      })

      setAttemptingTxn(false)
    } catch (e) {
      console.error(e)
      setAttemptingTxn(false)
    }
  }, [account, addTransaction, amount, auction.auctionInfo.paymentCurrency, contract, i18n, onDismiss])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={open} onDismiss={_onDismiss} afterLeave={() => setTxHash(undefined)}>
      {!txHash ? (
        <div className="flex flex-col h-full gap-8 pb-8 lg:max-w-lg lg:min-w-lg">
          <div className="relative">
            <div className="absolute w-full h-full pointer-events-none bg-gradient-to-r from-pink-red/20 via-pink/20 to-pink-red/20" />
            <div className="flex flex-col gap-4 p-8">
              <div className="flex flex-col gap-2">
                <Typography variant="h2" weight={700} className="text-high-emphesis">
                  {i18n._(t`Participate`)}
                </Typography>
                {auction.template === AuctionTemplate.DUTCH_AUCTION && (
                  <Typography variant="sm">
                    {i18n._(t`Your commitment is for the minimum amount of tokens. As the auction price drops, your commitment
                    will entitle you to claim even more tokens at the end. Final price per token is determined at the end
                    of the auction. Everyone who commits before the end of a successful auction, claims tokens at same
                    final price.`)}
                  </Typography>
                )}
                <div className="flex gap-4 items-center mt-2">
                  <Chip label="DeFi" color="blue" />
                  {auction && (
                    <div className="flex gap-1.5">
                      <AuctionIcon auctionTemplate={auction.template} width={18} />
                      <Typography variant="sm" weight={700} className="text-secondary">
                        {AuctionTitleByTemplateId(i18n)[auction.template]}
                      </Typography>
                    </div>
                  )}

                  <div className="flex gap-1.5">
                    <RestrictedIcon width={18} />
                    <Typography variant="sm" weight={700} className="text-secondary">
                      {i18n._(t`Restricted`)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 px-8">
              <Typography weight={700} variant="lg">
                {i18n._(t`You are committing`)}
              </Typography>
              <div className="flex items-center gap-3 border-dark-700">
                <CurrencyLogo currency={amount?.currency} size={32} className="rounded-full" />
                <div className="flex gap-2 items-baseline">
                  <Typography variant="lg" className="text-right text-high-emphesis" weight={700}>
                    {amount?.toSignificant(6)}
                  </Typography>
                  <Typography className="text-secondary" weight={700}>
                    {amount?.currency.symbol}
                  </Typography>
                </div>
                <ChevronRightIcon width={20} className="text-secondary" />
                {amount?.greaterThan(ZERO) && (
                  <div className="flex gap-2 items-baseline">
                    <Typography variant="lg" className="text-right text-high-emphesis" weight={700}>
                      {auction.tokenAmount(amount)?.toSignificant(6)}
                    </Typography>
                    <Typography className="text-secondary" weight={700}>
                      {auction.tokenAmount(amount)?.currency.symbol}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 px-8">
            <Button
              id={`btn-modal-confirm-deposit`}
              disabled={attemptingTxn}
              color="gradient"
              size="lg"
              className="!text-white not(disabled):bg-gradient-to-r from-red via-pink to-red"
              onClick={execute}
            >
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Commit`)}
              </Typography>
            </Button>
          </div>
        </div>
      ) : (
        <CommitSubmittedModalContent txHash={txHash} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default CommitReviewStandardModal
