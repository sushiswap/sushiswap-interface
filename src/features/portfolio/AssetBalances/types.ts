import { Currency, CurrencyAmount } from '@figswap/core-sdk'

export interface Assets {
  asset: CurrencyAmount<Currency>
  strategy?: { token: string; apy: number; targetPercentage: number; utilization: number }
}
