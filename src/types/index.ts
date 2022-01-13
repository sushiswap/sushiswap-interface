import { Currency, TradeType } from '@sushiswap/core-sdk'
import { Trade as LegacyTrade } from '@sushiswap/core-sdk/dist/entities/Trade'
import { Trade } from '@sushiswap/trident-sdk'

export type TradeUnion =
  | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  | LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
