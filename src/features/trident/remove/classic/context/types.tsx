import { TridentContext, TridentState } from '../../../types'
import { ConstantProductPool } from '../../../../../../../sushiswap-sdk'

export type ClassicPoolContext = {
  state: ClassicPoolState
  pool: ConstantProductPool | null
} & Pick<
  TridentContext,
  | 'currencies'
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
  | 'typedFieldAddress'
>
