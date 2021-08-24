import { TridentContext, TridentState } from '../../../types'

export type ClassicPoolContext = {
  state: ClassicPoolState
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

export type ClassicPoolState = Pick<
  TridentState,
  | 'inputAmounts'
  | 'showZapReview'
  | 'outputTokenAddress'
  | 'liquidityMode'
  | 'percentageAmount'
  | 'txHash'
  | 'typedField'
>
