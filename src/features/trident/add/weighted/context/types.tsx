import { TridentContext, TridentState } from '../../../types'

export type WeightedPoolContext = {
  state: WeightedPoolState
} & Pick<
  TridentContext,
  | 'pool'
  | 'tokens'
  | 'parsedInputAmounts'
  | 'parsedOutputAmounts'
  | 'selectInputToken'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
>

export type WeightedPoolState = Pick<
  TridentState,
  | 'inputAmounts'
  | 'showZapReview'
  | 'balancedMode'
  | 'spendFromWallet'
  | 'inputTokenAddress'
  | 'liquidityMode'
  | 'txHash'
>
