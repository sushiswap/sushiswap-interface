export const tokenPrice = (marketInfo: any) => {
    return (marketInfo.commitmentsTotal * 1e18) / marketInfo.totalTokens
}

export const clearingPrice = (marketInfo: any) => {
    marketInfo.startTime = parseFloat(marketInfo.startTime)
    marketInfo.endTime = parseFloat(marketInfo.endTime)
    const tPrice = tokenPrice(marketInfo)
    const fPrice = priceFunction(marketInfo)
    if (tPrice > fPrice) {
        return tPrice
    }
    return fPrice
}

export const priceFunction = (marketInfo: any) => {
    if (marketInfo.currentTimestamp <= marketInfo.startTime) {
        return marketInfo.startPrice
    }
    if (marketInfo.currentTimestamp >= marketInfo.endTime) {
        return marketInfo.minimumPrice
    }
    return currentPrice(marketInfo)
}

const currentPrice = (marketInfo: any) => {
    const priceDiff = (marketInfo.currentTimestamp - marketInfo.startTime) * priceDrop(marketInfo)

    return marketInfo.startPrice - priceDiff
}

const priceDrop = (marketInfo: any) => {
    const numerator = marketInfo.startPrice - marketInfo.minimumPrice
    const denominator = marketInfo.endTime - marketInfo.startTime
    return parseInt((numerator / denominator).toString())
}
