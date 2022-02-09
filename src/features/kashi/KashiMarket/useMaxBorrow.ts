import { Currency, CurrencyAmount, JSBI, ZERO } from '@sushiswap/core-sdk'
import { DEFAULT_BORROW_SLIPPAGE_TOLERANCE, LTV, PADDING } from 'app/features/kashi/constants'
import { KashiMarket } from 'app/features/kashi/types'
import { e10 } from 'app/functions'
import { useV2TradeExactIn } from 'app/hooks/useV2Trades'
import { useUserSlippageToleranceWithDefault } from 'app/state/user/hooks'

interface UseMaxBorrowPayload {
  leveraged: boolean
  collateralAmount?: CurrencyAmount<Currency>
  borrowAmount?: CurrencyAmount<Currency>
  market: KashiMarket
}

type UseMaxBorrow = (x: UseMaxBorrowPayload) => CurrencyAmount<Currency> | undefined
const useMaxBorrow: UseMaxBorrow = ({ leveraged, collateralAmount, borrowAmount, market }) => {
  const trade = useV2TradeExactIn(borrowAmount, collateralAmount?.currency, { maxHops: 3 })
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_BORROW_SLIPPAGE_TOLERANCE)
  const swapCollateralAmount = leveraged ? trade?.minimumAmountOut(allowedSlippage) : undefined

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

  console.log(swapCollateralAmount?.quotient.toString())
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
