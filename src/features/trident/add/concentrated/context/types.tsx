import { TridentContext, TridentState } from '../../../types'
import { ConstantProductPool } from '../../../../../../../sushiswap-sdk'

export type ConcentratedPoolContext = {
  state: ConcentratedPoolState
  pool: ConstantProductPool | null
} & Pick<
  TridentContext,
  | 'currencies'
  | 'parsedInputAmounts'
  | 'parsedOutputAmounts'
  | 'execute'
  | 'handleInput'
  | 'showReview'
  | 'dispatch'
  | 'setMaxPrice'
  | 'setMinPrice'
  | 'setSpendFromWallet'
  | 'setLiquidityMode'
>

export type ConcentratedPoolState = Pick<
  TridentState,
  | 'minPrice'
  | 'maxPrice'
  | 'inputAmounts'
  | 'showZapReview'
  | 'balancedMode'
  | 'spendFromWallet'
  | 'txHash'
  | 'fixedRatio'
  | 'liquidityMode'
>
