import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Token, ZERO } from '@sushiswap/core-sdk'
import Chip from 'app/components/Chip'
import { RestrictedIcon } from 'app/components/Icon'
import ListPanel from 'app/components/ListPanel'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import { AuctionTitleByTemplateId, MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import DepositSubmittedModalContent from 'app/features/trident/DepositSubmittedModalContent'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Button from 'components/Button'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import React, { FC, useCallback, useState } from 'react'

import { Auction } from './context/Auction'

interface CommitReviewStandardModalProps {
  auction: Auction<Token, Token>
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

  const execute = useCallback(async () => {
    if (!contract || !amount || !amount.greaterThan(ZERO)) return

    let tx
    if (auction.auctionInfo.paymentCurrency === AddressZero) {
      tx = await contract.commitEth(account, true, { value: amount.quotient.toString() })
    } else {
      tx = await contract.commitTokens(amount.quotient.toString(), true)
    }

    addTransaction(tx, {
      summary: i18n._(t`Committed ${amount?.toSignificant(6)} ${amount.currency.symbol}`),
    })

    await tx.wait()
  }, [account, addTransaction, amount, auction.auctionInfo.paymentCurrency, contract, i18n])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={open} onDismiss={onDismiss} afterLeave={() => setTxHash(undefined)}>
      {!txHash ? (
        <div className="flex flex-col h-full gap-8 pb-8 lg:max-w-lg">
          <div className="relative">
            <div className="absolute w-full h-full pointer-events-none bg-gradient-to-r from-pink-red/20 via-pink/20 to-pink-red/20" />
            <div className="flex flex-col gap-4 p-8">
              <div className="flex flex-col gap-2">
                <Typography variant="h2" weight={700} className="text-high-emphesis">
                  {i18n._(t`Participate`)}
                </Typography>
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
            <div className="flex flex-col gap-3 px-8">
              <Typography weight={700} variant="lg">
                {i18n._(t`You are committing`)}
              </Typography>
              <ListPanel items={[<ListPanel.CurrencyAmountItem amount={amount} key={0} />]} />
            </div>
          </div>
          <div className="flex flex-col gap-5 px-8">
            <Button
              id={`btn-modal-confirm-deposit`}
              disabled={attemptingTxn}
              color="gradient"
              size="lg"
              className="!text-white bg-gradient-to-r from-red via-pink to-red"
              onClick={execute}
            >
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Commit`)}
              </Typography>
            </Button>
          </div>
        </div>
      ) : (
        <DepositSubmittedModalContent txHash={txHash} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default CommitReviewStandardModal
