import { ChainId } from '@sushiswap/sdk'

export enum OrderDirection {
    BUY = 'BUY',
    SELL = 'SELL'
}

export interface SwapMessageResponse {
    action: string
    start_time: string
    end_time: string
    name: string
    results: SwapMessage[]
}

export interface SwapMessage {
    chainId: ChainId
    amountBase: number
    side: OrderDirection
    timestamp: number
    price: number
    txHash: string
    priceBase: number
}

export interface UserHistoryResponse {
    action: string
    start_time: string
    end_time: string
    name: string
    results: UserHistoryMessage[]
}

export interface UserHistoryMessage {
    side: OrderDirection
    tokenBase: string
    tokenQuote: string
    pairName: string
    amountBase: string
    amountQuote: string
    priceBase: string
    price: string
    volumeUSD: string
    txHash: string
    maker: string
    to: string
    timestamp: number
    chainId: ChainId
}
