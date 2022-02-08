import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, JSBI, Percent, Price, ZERO } from '@sushiswap/core-sdk'
import { KashiMarket } from 'app/features/kashi/types'
import { useV2TradeExactIn } from 'app/hooks/useV2Trades'
import { useUserSlippageToleranceWithDefault } from 'app/state/user/hooks'

export const getPriceEntityFromRate = (price: string, baseCurrency: Currency, quoteCurrency: Currency) => {
  const baseAmount = CurrencyAmount.fromRawAmount(baseCurrency, JSBI.BigInt(price))
  const quoteAmount = CurrencyAmount.fromRawAmount(
    quoteCurrency,
    JSBI.BigInt(parseUnits('1', quoteCurrency.decimals).toString())
  )
  return new Price({ baseAmount, quoteAmount })
}

const DEFAULT_BORROW_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
const LTV = new Percent(75, 100)
const PADDING = new Percent(95, 100)

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
  let totalCollateral = userCollateralAmount.add(collateralAmount)
  if (swapCollateralAmount) {
    totalCollateral = totalCollateral.add(swapCollateralAmount)
  }

  const oracleRate = getPriceEntityFromRate(
    market.oracleExchangeRate.toString(),
    collateralAmount.currency,
    borrowAmount.currency
  )
  console.log(market.oracleExchangeRate.toString())
  const spotRate = getPriceEntityFromRate(
    market.spotExchangeRate.toString(),
    collateralAmount.currency,
    borrowAmount.currency
  )

  const borrowableOracleRate = oracleRate.quote(totalCollateral).multiply(LTV)
  const borrowableSpotRate = spotRate.quote(totalCollateral).multiply(LTV)
  const borrowableMinimum = borrowableOracleRate.lessThan(borrowableSpotRate)
    ? borrowableOracleRate
    : borrowableSpotRate

  const borrowableMinimumPadded = borrowableMinimum
    .multiply(PADDING)
    .subtract(CurrencyAmount.fromRawAmount(borrowAmount.currency, market.currentUserBorrowAmount.string || '0'))

  const maxAvailableBorrow = CurrencyAmount.fromRawAmount(borrowAmount.currency, market.maxAssetAvailable.toString())

  console.log({
    userCollateralAmount: userCollateralAmount.quotient.toString(),
    totalCollateral: totalCollateral.quotient.toString(),
    oracleRate: oracleRate.quotient.toString(),
    spotRate: spotRate.quotient.toString(),
    borrowableOracleRate: borrowableOracleRate.quotient.toString(),
    borrowableSpotRate: borrowableSpotRate.quotient.toString(),
    borrowableMinimum: borrowableMinimum.quotient.toString(),
    borrowableMinimumPadded: borrowableMinimumPadded.quotient.toString(),
    maxAvailableBorrow: maxAvailableBorrow.quotient.toString(),
  })

  return borrowableMinimumPadded.greaterThan(ZERO)
    ? borrowableMinimumPadded.greaterThan(maxAvailableBorrow)
      ? maxAvailableBorrow
      : borrowableMinimumPadded
    : CurrencyAmount.fromRawAmount(borrowAmount.currency, '0')
}

export default useMaxBorrow
