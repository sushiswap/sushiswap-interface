import React, { useCallback } from 'react'

import { ImportToken } from '../SearchModal/ImportToken'
import Modal from '../../components/Modal'
import { Token } from '@sushiswap/sdk'

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
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  )
}
