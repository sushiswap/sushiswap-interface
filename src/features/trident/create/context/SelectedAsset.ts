import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { tryParseAmount } from 'app/functions'

export enum SpendSource {
  WALLET,
  BENTO_BOX,
}

export enum SelectAssetError {
  ACCOUNT_NOT_CONNECTED,
  INSUFFICIENT_BALANCE,
  NO_AMOUNT_CHOSEN,
}

interface SelectedAssetProps {
  currency?: Currency
  amount?: string
  spendFromSource?: SpendSource
  error?: SelectAssetError
  amountInteractedWith?: boolean
}

export class SelectedAsset {
  readonly currency?: Currency
  readonly amount: string
  readonly amountInteractedWith: boolean
  readonly spendFromSource: SpendSource
  readonly error?: SelectAssetError

  constructor({
    currency,
    amount = '',
    spendFromSource = SpendSource.WALLET,
    error,
    amountInteractedWith = false,
  }: SelectedAssetProps) {
    this.currency = currency
    this.amount = amount
    this.spendFromSource = spendFromSource
    this.error = error
    this.amountInteractedWith = amountInteractedWith
  }

  get parsedAmount(): CurrencyAmount<Currency> | undefined {
    return tryParseAmount(this.amount, this.currency)
  }

  oppositeToggle(): SpendSource {
    return this.spendFromSource === SpendSource.WALLET ? SpendSource.BENTO_BOX : SpendSource.WALLET
  }
}
