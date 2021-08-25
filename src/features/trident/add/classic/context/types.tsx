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
  | 'selectInputToken'
  | 'setLiquidityMode'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
  | 'setSpendFromWallet'
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
  | 'typedField'
>
