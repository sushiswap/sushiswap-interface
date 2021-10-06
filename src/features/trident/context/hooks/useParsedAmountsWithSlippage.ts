import { Currency, CurrencyAmount, Percent } from '@sushiswap/core-sdk'
import { useUserSlippageToleranceWithDefault } from '../../../../state/user/hooks'
import { calculateSlippageAmount } from '../../../../functions'
import { ZERO_PERCENT } from '../../../../constants'

const useParsedAmountsWithSlippage = (
  parsedAmounts: CurrencyAmount<Currency>[],
  noLiquidity: boolean,
  slippage: Percent
) => {
  const allowedSlippage = useUserSlippageToleranceWithDefault(slippage)
  return parsedAmounts.map((el) => {
    const result = el?.greaterThan(0)
      ? calculateSlippageAmount(el, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0]
      : undefined

    if (result) {
      return CurrencyAmount.fromRawAmount(el.currency, result.toString())
    }

    return undefined
  })
}

export default useParsedAmountsWithSlippage
