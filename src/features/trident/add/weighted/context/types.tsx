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
  | 'selectInputToken'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
  | 'setLiquidityMode'
  | 'setSpendFromWallet'
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
  | 'fixedRatio'
>
