import { TridentContext, TridentState } from '../../../types'
import { ConstantProductPool } from '../../../../../../../sushiswap-sdk'

export type WeightedPoolContext = {
  state: WeightedPoolState
  pool: ConstantProductPool | null
} & Pick<
  TridentContext,
  | 'currencies'
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

export type WeightedPoolState = Pick<
  TridentState,
  'inputAmounts' | 'showZapReview' | 'outputTokenAddress' | 'liquidityMode' | 'percentageAmount' | 'txHash'
>
