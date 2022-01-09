import { Token } from '@sushiswap/core-sdk'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import React, { useCallback } from 'react'

import { ImportToken } from '../SearchModal/ImportToken'

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
}: {
  isOpen: boolean
  tokens: Token[]
  onConfirm: () => void
}) {
  const handleDismiss = useCallback(() => null, [])

  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={handleDismiss}>
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </HeadlessUiModal.Controlled>
  )
}
