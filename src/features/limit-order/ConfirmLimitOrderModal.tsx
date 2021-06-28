import React, { FC, useCallback } from 'react'
import { USDC, useActiveWeb3React, useUSDCPrice } from '../../hooks'
import { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { useLingui } from '@lingui/react'
import CurrencyLogo from '../../components/CurrencyLogo'
import { t, Trans } from '@lingui/macro'
import { useDerivedLimitOrderInfo, useLimitOrderState } from '../../state/limit-order/hooks'
import { Field } from '../../state/limit-order/actions'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { formatNumber, shortenAddress } from '../../functions'

interface ConfirmLimitOrderModalProps {
  open: boolean
  onDismiss: () => void
  onConfirm: () => void
}
const ConfirmLimitOrderModal: FC<ConfirmLimitOrderModalProps> = ({ open, onDismiss, onConfirm }) => {
  const topContent = useCallback(() => <ConfirmLimitOrderTopContent />, [])
  const bottomContent = useCallback(() => <ConfirmLimitOrderBottomContent onClick={onConfirm} />, [onConfirm])

  return (
    <Modal isOpen={open} onDismiss={onDismiss} maxHeight={90}>
      <ConfirmationModalContent
        title="Confirm Limit Order"
        onDismiss={onDismiss}
        topContent={topContent}
        bottomContent={bottomContent}
      />
    </Modal>
  )
}

const ConfirmLimitOrderTopContent = () => {
  const { i18n } = useLingui()
  const { limitPrice } = useLimitOrderState()
  const { currencies, parsedAmounts } = useDerivedLimitOrderInfo()
  const { chainId } = useActiveWeb3React()

  const inputUSDC = useUSDCPrice(
    currencies[Field.INPUT] && chainId in USDC ? currencies[Field.INPUT] : undefined
  )?.toFixed(18)
  const inputValueUSDC = formatNumber(Number(parsedAmounts[Field.INPUT].toSignificant(6)) * Number(inputUSDC))

  const outputUSDC = useUSDCPrice(
    currencies[Field.OUTPUT] && chainId in USDC ? currencies[Field.OUTPUT] : undefined
  )?.toFixed(18)
  const outputValueUSDC = formatNumber(Number(parsedAmounts[Field.OUTPUT].toSignificant(6)) * Number(outputUSDC))

  return (
    <div className="py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="text-white text-xl font-bold">{i18n._(t`You Pay:`)}</div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <CurrencyLogo size={40} currency={currencies[Field.INPUT]} />
              <div className="text-xl text-white font-bold">{parsedAmounts[Field.INPUT]?.toSignificant(6)}</div>
              <div className="text-xl text-white">{currencies[Field.INPUT]?.symbol}</div>
            </div>
            <div className="text-low-emphesis text-sm">≈ {inputValueUSDC} USDC</div>
          </div>
        </div>
        <div className="bg-dark-800 rounded flex justify-between py-3 px-5">
          <span className="text-secondary font-bold">{i18n._(t`Rate`)}</span>
          <span className="text-primary">
            {limitPrice} {currencies[Field.OUTPUT]?.symbol} per {currencies[Field.INPUT]?.symbol}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-white text-xl font-bold gap-2 flex">
            <Trans>
              You receive
              <span className="font-normal text-secondary">(at least):</span>
            </Trans>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <CurrencyLogo size={40} currency={currencies[Field.OUTPUT]} />
              <div className="text-xl text-white font-bold">{parsedAmounts[Field.OUTPUT]?.toSignificant(6)}</div>
              <div className="text-xl text-white">{currencies[Field.OUTPUT]?.symbol}</div>
            </div>
            <div className="text-low-emphesis text-sm">≈ {outputValueUSDC} USDC</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ConfirmLimitOrderBottomContentProps {
  onClick: () => void
}

const ConfirmLimitOrderBottomContent: FC<ConfirmLimitOrderBottomContentProps> = ({ onClick }) => {
  const { i18n } = useLingui()
  const { orderExpiration, recipient } = useLimitOrderState()
  const { currencies, parsedAmounts } = useDerivedLimitOrderInfo()

  return (
    <div className="bg-dark-800 py-8 -m-6 px-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-secondary">{i18n._(t`Minimum Received`)}</span>
          <span className="text-high-emphesis font-bold">
            {parsedAmounts[Field.OUTPUT]?.toSignificant(6)} {currencies[Field.OUTPUT]?.symbol}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary">{i18n._(t`Order Expiration`)}</span>
          <span className="text-high-emphesis font-bold">{orderExpiration.label}</span>
        </div>
        {recipient && (
          <div className="flex justify-between items-center">
            <span className="text-secondary">{i18n._(t`Recipient`)}</span>
            <span className="text-high-emphesis font-bold">{shortenAddress(recipient, 6)}</span>
          </div>
        )}
      </div>
      <Button color="gradient" onClick={onClick}>
        {i18n._(t`Confirm Limit Order`)}
      </Button>
    </div>
  )
}

export default ConfirmLimitOrderModal
