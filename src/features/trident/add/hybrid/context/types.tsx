import { TridentContext, TridentState } from '../../../types'

export type HybridPoolContext = {
  state: HybridPoolState
} & Pick<
  TridentContext,
  | 'pool'
  | 'tokens'
  | 'parsedInputAmounts'
  | 'parsedOutputAmounts'
  | 'setLiquidityMode'
  | 'selectInputToken'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
>

export type HybridPoolState = Pick<
  TridentState,
  | 'inputAmounts'
  | 'showZapReview'
  | 'balancedMode'
  | 'spendFromWallet'
  | 'inputTokenAddress'
  | 'liquidityMode'
  | 'txHash'
>
