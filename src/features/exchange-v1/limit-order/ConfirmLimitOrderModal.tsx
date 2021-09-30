import React, { FC, useCallback } from 'react'
import { formatNumber, shortenAddress } from '../../functions'
import { useActiveWeb3React, useUSDCPrice } from '../../hooks'
import { useDerivedLimitOrderInfo, useLimitOrderState } from '../../state/limit-order/hooks'

import Button from '../../components/Button'
import { ConfirmationModalContent } from '../../modals/TransactionConfirmationModal'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/limit-order/actions'
import Modal from '../../components/Modal'
import { USDC } from '@sushiswap/sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

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
          <div className="text-xl font-bold text-white">{i18n._(t`You Pay:`)}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyLogo size={40} currency={currencies[Field.INPUT]} />
              <div className="text-xl font-bold text-white">{parsedAmounts[Field.INPUT]?.toSignificant(6)}</div>
              <div className="text-xl text-white">{currencies[Field.INPUT]?.symbol}</div>
            </div>
            <div className="text-sm text-low-emphesis">≈ {inputValueUSDC} USDC</div>
          </div>
        </div>
        <div className="flex justify-between px-5 py-3 rounded bg-dark-800">
          <span className="font-bold text-secondary">{i18n._(t`Rate`)}</span>
          <span className="text-primary">
            {limitPrice} {currencies[Field.OUTPUT]?.symbol} per {currencies[Field.INPUT]?.symbol}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 text-xl font-bold text-white">{i18n._(t`You receive`)}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyLogo size={40} currency={currencies[Field.OUTPUT]} />
              <div className="text-xl font-bold text-white">{parsedAmounts[Field.OUTPUT]?.toSignificant(6)}</div>
              <div className="text-xl text-white">{currencies[Field.OUTPUT]?.symbol}</div>
            </div>
            <div className="text-sm text-low-emphesis">≈ {outputValueUSDC} USDC</div>
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
    <div className="flex flex-col gap-6 px-6 py-8 -m-6 bg-dark-800">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-secondary">{i18n._(t`Minimum Received`)}</span>
          <span className="font-bold text-high-emphesis">
            {parsedAmounts[Field.OUTPUT]?.toSignificant(6)} {currencies[Field.OUTPUT]?.symbol}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">{i18n._(t`Order Expiration`)}</span>
          <span className="font-bold text-high-emphesis">{orderExpiration.label}</span>
        </div>
        {recipient && (
          <div className="flex items-center justify-between">
            <span className="text-secondary">{i18n._(t`Recipient`)}</span>
            <span className="font-bold text-high-emphesis">{shortenAddress(recipient, 6)}</span>
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
