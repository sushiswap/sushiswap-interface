import { TridentContext, TridentState } from '../../../types'

export type ConcentratedPoolContext = {
  state: ConcentratedPoolState
} & Pick<
  TridentContext,
  | 'pool'
  | 'tokens'
  | 'parsedInputAmounts'
  | 'parsedOutputAmounts'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
  | 'setMaxPrice'
  | 'setMinPrice'
  | 'setSpendFromWallet'
  | 'setLiquidityMode'
>

export type ConcentratedPoolState = Pick<
  TridentState,
  | 'minPrice'
  | 'maxPrice'
  | 'inputAmounts'
  | 'showZapReview'
  | 'balancedMode'
  | 'spendFromWallet'
  | 'txHash'
  | 'fixedRatio'
  | 'liquidityMode'
>
