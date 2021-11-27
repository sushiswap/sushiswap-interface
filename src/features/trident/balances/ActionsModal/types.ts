import { Currency } from '@sushiswap/core-sdk'

export interface ActionsModalProps {
  currency?: Currency
  onClose(): void
}
