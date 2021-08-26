import { TridentContext, TridentState } from '../../../types'
import { ConstantProductPool, Currency } from '../../../../../../../sushiswap-sdk'
import { ConstantProductPoolState } from '../../../../../hooks/useTridentClassicPools'
import { Field } from '../../../../../state/mint/actions'

interface InputFieldState {
  typedValue: string
  otherTypedValue?: string
  independentField: Field
  noLiquidity: boolean
}

export type ClassicPoolContext = {
  state: ClassicPoolState
  pool: ConstantProductPool | null
  poolState: ConstantProductPoolState
  currencies: Record<Field, Currency>
  handleInput: (payload: InputFieldState) => void
} & Pick<
  TridentContext,
  | 'parsedOutputAmounts'
  | 'selectInputToken'
  | 'setLiquidityMode'
  | 'execute'
  | 'showReview'
  | 'dispatch'
  | 'setSpendFromWallet'
>

export type ClassicPoolState = InputFieldState &
  Pick<
    TridentState,
    | 'showZapReview'
    | 'balancedMode'
    | 'spendFromWallet'
    | 'inputTokenAddress'
    | 'liquidityMode'
    | 'txHash'
    | 'typedFieldAddress'
  >
