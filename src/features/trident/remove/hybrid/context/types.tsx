import { TridentContext, TridentState } from '../../../types'

export type HybridPoolContext = {
  state: HybridPoolState
} & Pick<
  TridentContext,
  | 'pool'
  | 'tokens'
  | 'parsedInputAmounts'
  | 'parsedOutputAmounts'
  | 'selectOutputToken'
  | 'setLiquidityMode'
  | 'handlePercentageAmount'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
>

export type HybridPoolState = Pick<
  TridentState,
  'inputAmounts' | 'showZapReview' | 'outputTokenAddress' | 'liquidityMode' | 'percentageAmount'
>
