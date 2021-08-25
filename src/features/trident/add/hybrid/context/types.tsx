import { TridentContext, TridentState } from '../../../types'
import { ConstantProductPool } from '../../../../../../../sushiswap-sdk'

export type HybridPoolContext = {
  state: HybridPoolState
  pool: ConstantProductPool | null
} & Pick<
  TridentContext,
  | 'currencies'
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
