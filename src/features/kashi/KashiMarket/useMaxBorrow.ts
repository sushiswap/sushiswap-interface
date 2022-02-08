import { Currency, CurrencyAmount, Fraction, JSBI, Percent, ZERO } from '@sushiswap/core-sdk'
import { KashiMarket } from 'app/features/kashi/types'
import { e10 } from 'app/functions'
import { useV2TradeExactIn } from 'app/hooks/useV2Trades'
import { useUserSlippageToleranceWithDefault } from 'app/state/user/hooks'

const DEFAULT_BORROW_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
const LTV = new Fraction(75, 100)
const PADDING = new Fraction(95, 100)

interface UseMaxBorrowPayload {
  leveraged: boolean
  collateralAmount?: CurrencyAmount<Currency>
  borrowAmount?: CurrencyAmount<Currency>
  market: KashiMarket
}

type UseMaxBorrow = (x: UseMaxBorrowPayload) => CurrencyAmount<Currency> | undefined
const useMaxBorrow: UseMaxBorrow = ({ leveraged, collateralAmount, borrowAmount, market }) => {
  const foundTrade = useV2TradeExactIn(borrowAmount, collateralAmount?.currency)
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_BORROW_SLIPPAGE_TOLERANCE)
  const swapCollateralAmount = leveraged ? foundTrade?.minimumAmountOut(allowedSlippage) : undefined

  if (!collateralAmount || !borrowAmount) {
    return undefined
  }

  const userCollateralAmount = CurrencyAmount.fromRawAmount(
    collateralAmount.currency,
    market.userCollateralAmount.string
  )

  // Calculate total collateral amount
  let userTotalCollateral = userCollateralAmount.add(collateralAmount)
  if (swapCollateralAmount) {
    userTotalCollateral = userTotalCollateral.add(swapCollateralAmount)
  }

  const borrowableOracleAmount = userTotalCollateral
    .multiply(LTV)
    .multiply(e10(18).toString())
    .divide(JSBI.BigInt(market.oracleExchangeRate)).asFraction
  const borrowableSpotAmount = userTotalCollateral
    .multiply(LTV)
    .multiply(e10(18).toString())
    .divide(JSBI.BigInt(market.spotExchangeRate)).asFraction
  const borrowableMinimum = borrowableOracleAmount.lessThan(borrowableSpotAmount)
    ? borrowableOracleAmount
    : borrowableSpotAmount

  const borrowableMinimumPadded = borrowableMinimum
    .multiply(PADDING)
    .asFraction.subtract(
      CurrencyAmount.fromRawAmount(borrowAmount.currency, market.currentUserBorrowAmount.string || '0')
    )

  const maxAvailableBorrow = CurrencyAmount.fromRawAmount(borrowAmount.currency, market.maxAssetAvailable.toString())

  return borrowableMinimumPadded.greaterThan(ZERO)
    ? borrowableMinimumPadded.greaterThan(maxAvailableBorrow)
      ? maxAvailableBorrow
      : CurrencyAmount.fromRawAmount(borrowAmount.currency, borrowableMinimumPadded.quotient)
    : CurrencyAmount.fromRawAmount(borrowAmount.currency, '0')
}

export default useMaxBorrow
