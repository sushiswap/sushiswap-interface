import { CurrencyAmount, Token } from '@sushiswap/sdk'

export interface Pool {
  amounts: CurrencyAmount<Token>[]
  tokens: Token[]
  tvl: string
  apy: string
  fee: string
}
