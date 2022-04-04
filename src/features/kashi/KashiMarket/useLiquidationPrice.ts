import { Currency, CurrencyAmount, Fraction, Price, ZERO } from '@sushiswap/core-sdk'
import { LTV } from 'app/features/kashi/constants'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import { unwrappedToken } from 'app/functions'
import { useUSDCPrice } from 'app/hooks'

interface Payload {
  borrowAmount?: CurrencyAmount<Currency>
  collateralAmount?: CurrencyAmount<Currency>
  multiplier?: Fraction
  invert: boolean
  reduce: boolean
}

type UseLiquidationPrice = (x: Payload) => string

export const useLiquidationPrice: UseLiquidationPrice = ({
  borrowAmount,
  collateralAmount,
  invert,
  multiplier = undefined,
  reduce,
}) => {
  const { market } = useKashiMarket()
  const currentCollateralAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )
  const currentBorrowedAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.asset.token),
    market.currentUserBorrowAmount
  )
  const collateralAssetPrice = useUSDCPrice(market.collateral.token)

  try {
    const extraCollateral =
      collateralAmount && multiplier
        ? collateralAmount[reduce ? 'subtract' : 'add'](collateralAmount.multiply(multiplier))
        : collateralAmount

    const totalCollateral = extraCollateral
      ? currentCollateralAmount[reduce ? 'subtract' : 'add'](extraCollateral)
      : currentCollateralAmount
    const totalBorrowed = borrowAmount
      ? currentBorrowedAmount[reduce ? 'subtract' : 'add'](borrowAmount)
      : currentBorrowedAmount

    if (totalBorrowed.equalTo(ZERO)) return 'None'

    const liquidationPrice =
      totalBorrowed && totalCollateral && totalBorrowed.greaterThan(ZERO)
        ? new Price({ baseAmount: totalBorrowed, quoteAmount: totalCollateral.multiply(LTV) })
        : undefined

    const liqPriceNumber = Number(liquidationPrice?.invert().toSignificant(6))
    const assetPriceNumber = Number(collateralAssetPrice?.toSignificant(6))

    if (liqPriceNumber > assetPriceNumber || Number(liquidationPrice?.invert().toSignificant(6)) < 0) {
      return 'Instant liquidation'
    } else if (!liqPriceNumber) {
      return 'None'
    }

    return invert
      ? `1 ${totalBorrowed?.currency.symbol} = ${liquidationPrice?.toSignificant(6)} ${
          totalCollateral?.currency.symbol
        }`
      : `1 ${totalCollateral?.currency.symbol} = ${liquidationPrice?.invert().toSignificant(6)} ${
          totalBorrowed?.currency.symbol
        }`
  } catch (e) {
    console.log(e)
    return 'Instant liquidation'
  }
}
