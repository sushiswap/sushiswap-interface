import { TridentContext, TridentState } from '../../../types'

export type ConcentratedPoolContext = {
  state: ConcentratedPoolState
} & Pick<
  TridentContext,
  | 'pool'
  | 'tokens'
  | 'parsedInputAmounts'
  | 'parsedOutputAmounts'
  | 'selectOutputToken'
  | 'handlePercentageAmount'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
  | 'setLiquidityMode'
>

export type ConcentratedPoolState = Pick<
  TridentState,
  'inputAmounts' | 'showZapReview' | 'outputTokenAddress' | 'percentageAmount' | 'txHash' | 'liquidityMode'
>
