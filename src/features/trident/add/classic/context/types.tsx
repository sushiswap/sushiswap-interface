import { TridentContext, TridentState } from '../../../types'

export type ClassicPoolContext = {
  state: ClassicPoolState
} & Pick<
  TridentContext,
  | 'pool'
  | 'tokens'
  | 'parsedInputAmounts'
  | 'parsedOutputAmounts'
  | 'selectInputToken'
  | 'setLiquidityMode'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
>

export type ClassicPoolState = Pick<
  TridentState,
  | 'inputAmounts'
  | 'showZapReview'
  | 'balancedMode'
  | 'spendFromWallet'
  | 'inputTokenAddress'
  | 'liquidityMode'
  | 'txHash'
>
