import { ChainId } from '@sushiswap/sdk'

export enum OrderDirection {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum OrderType {
    LIMIT = 'LIMIT',
    MARKET = 'MARKET',
}

export interface PairData {
    current: {
        id: string
        reserveUSD: string
        txCount: string
        untrackedVolumeUSD: string
        volumeUSD: string
    }
    oneDay: {
        id: string
        reserveUSD: string
        txCount: string
        untrackedVolumeUSD: string
        volumeUSD: string
    }
    twoDay: {
        id: string
        reserveUSD: string
        txCount: string
        untrackedVolumeUSD: string
        volumeUSD: string
    }
}

export interface SwapMessageResponse {
    action: string
    start_time: string
    end_time: string
    name: string
    results: SwapMessage[]
}

export interface SwapMessage {
    amountBase: number
    amountQuote: number
    chainId: ChainId
    maker: string
    price: number
    priceBase: number
    side: OrderDirection
    timestamp: number
    to: string
    txHash: string
    volumeUSD: string
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
    tokenBaseAddress: string
    tokenQuote: string
    tokenQuoteAddress: string
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

interface GlobalDataReducerAction<T, P> {
    type: T
    payload: P
}

interface PushHistoryMessagePayload {
    message: UserHistoryMessage
}

interface PushSwapMessagePayload {
    message: SwapMessage
}

export enum ActionType {
    PUSH_HISTORY_MESSAGE = 'PUSH_HISTORY_MESSAGE',
    PUSH_SWAP_MESSAGE = 'PUSH_SWAP_MESSAGE',
}

export interface State {
    lastSwap: SwapMessage | null
    userSwapHistory: UserHistoryMessage[]
    swapHistory: SwapMessage[]
    oneDayBlock: number
    twoDayBlock: number
    pairData: PairData | null
}

export type Action =
    | GlobalDataReducerAction<
          ActionType.PUSH_SWAP_MESSAGE,
          PushSwapMessagePayload
      >
    | GlobalDataReducerAction<
          ActionType.PUSH_HISTORY_MESSAGE,
          PushHistoryMessagePayload
      >
