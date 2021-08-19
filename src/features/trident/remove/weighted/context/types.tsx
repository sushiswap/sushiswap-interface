import { TridentContext, TridentState } from '../../../types'

export type WeightedPoolContext = {
  state: WeightedPoolState
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
>

export type WeightedPoolState = Pick<
  TridentState,
  'inputAmounts' | 'showZapReview' | 'outputTokenAddress' | 'liquidityMode' | 'percentageAmount'
>
