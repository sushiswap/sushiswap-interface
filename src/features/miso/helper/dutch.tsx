import { formatUnits } from '@ethersproject/units'
import { e10 } from '../../../functions'

export const tokenPrice = (auctionInfo) => {
  return parseFloat(
    formatUnits(
      auctionInfo.commitmentsTotal.mulDiv(e10(auctionInfo.tokenInfo.decimals), auctionInfo.totalTokens),
      auctionInfo.paymentCurrencyInfo.decimals
    )
  )
}

export const clearingPrice = (auctionInfo, currentTimestamp) => {
  const tPrice = tokenPrice(auctionInfo)
  const fPrice = priceFunction(auctionInfo, currentTimestamp)
  if (tPrice > fPrice) {
    return tPrice
  }
  return fPrice
}
export const priceFunction = (auctionInfo, currentTimestamp) => {
  const startPrice = parseFloat(formatUnits(auctionInfo.startPrice, auctionInfo.paymentCurrencyInfo.decimals))
  const minimumPrice = parseFloat(formatUnits(auctionInfo.minimumPrice, auctionInfo.paymentCurrencyInfo.decimals))
  const startTime = parseInt(auctionInfo.startTime)
  const endTime = parseInt(auctionInfo.endTime)

  if (currentTimestamp <= startTime) {
    return startPrice
  }
  if (currentTimestamp >= endTime) {
    return minimumPrice
  }

  const priceDiff = (currentTimestamp - startTime) * ((startPrice - minimumPrice) / (endTime - startTime))

  return startPrice - priceDiff
}
