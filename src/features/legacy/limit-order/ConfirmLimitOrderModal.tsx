import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import { formatNumber, shortenAddress } from 'app/functions'
import useUSDCPrice from 'app/hooks/useUSDCPrice'
import { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useActiveWeb3React } from 'app/services/web3'
import { Field } from 'app/state/limit-order/actions'
import { useLimitOrderDerivedParsedAmounts, useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC } from 'react'

interface ConfirmLimitOrderModalProps {
  open: boolean
  onDismiss: () => void
  onConfirm: () => void
}

const ConfirmLimitOrderModal: FC<ConfirmLimitOrderModalProps> = ({ open, onDismiss, onConfirm }) => {
  return (
    <HeadlessUiModal.Controlled isOpen={open} onDismiss={onDismiss}>
      <ConfirmationModalContent
        title="Confirm Limit Order"
        onDismiss={onDismiss}
        topContent={<ConfirmLimitOrderTopContent />}
        bottomContent={<ConfirmLimitOrderBottomContent onClick={onConfirm} />}
      />
    </HeadlessUiModal.Controlled>
  )
}

const ConfirmLimitOrderTopContent = () => {
  const { i18n } = useLingui()
  const { limitPrice } = useLimitOrderState()
  const { [Field.INPUT]: parsedInputAmount, [Field.OUTPUT]: parsedOutputAmount } = useLimitOrderDerivedParsedAmounts()
  const { chainId } = useActiveWeb3React()

  const inputUSDC = useUSDCPrice(
    parsedInputAmount?.currency && chainId ? parsedInputAmount.currency : undefined
  )?.toFixed(18)
  const inputValueUSDC = formatNumber(Number(parsedInputAmount?.toSignificant(6)) * Number(inputUSDC))
  const outputUSDC = useUSDCPrice(
    parsedOutputAmount?.currency && chainId ? parsedOutputAmount.currency : undefined
  )?.toFixed(18)
  const outputValueUSDC = formatNumber(Number(parsedOutputAmount?.toSignificant(6)) * Number(outputUSDC))

  return (
    <div className="py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="text-xl font-bold text-white">{i18n._(t`You Pay:`)}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyLogo size={40} currency={parsedInputAmount?.currency} />
              <div className="text-xl font-bold text-white">{parsedInputAmount?.toSignificant(6)}</div>
              <div className="text-xl text-white">{parsedInputAmount?.currency?.symbol}</div>
            </div>
            <div className="text-sm text-low-emphesis">≈ {inputValueUSDC} USDC</div>
          </div>
        </div>
        <div className="flex justify-between px-5 py-3 rounded bg-dark-800">
          <span className="font-bold text-secondary">{i18n._(t`Rate`)}</span>
          <span className="text-primary">
            {limitPrice} {parsedOutputAmount?.currency.symbol} per {parsedInputAmount?.currency.symbol}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 text-xl font-bold text-white">{i18n._(t`You receive`)}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyLogo size={40} currency={parsedOutputAmount?.currency} />
              <div className="text-xl font-bold text-white">{parsedOutputAmount?.toSignificant(6)}</div>
              <div className="text-xl text-white">{parsedOutputAmount?.currency.symbol}</div>
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
  const { [Field.OUTPUT]: parsedOutputAmount } = useLimitOrderDerivedParsedAmounts()

  return (
    <div className="flex flex-col gap-6 px-6 py-8 -m-6 bg-dark-800">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-secondary">{i18n._(t`Minimum Received`)}</span>
          <span className="font-bold text-high-emphesis">
            {parsedOutputAmount?.toSignificant(6)} {parsedOutputAmount?.currency.symbol}
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
