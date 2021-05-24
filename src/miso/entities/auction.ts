import { BigNumber } from '@ethersproject/bignumber'

export interface TokenInfo {
    addr?: string
    decimals?: BigNumber
    name?: string
    symbol?: string
}

export interface MarketInfo {
    paymentCurrency?: TokenInfo
    startTime?: string
    endTime?: string
    startPrice?: string
    minimumPrice?: string
    finalized?: boolean
    commitmentsTotal?: string
    totalTokens?: string
    currentPrice?: string
}
