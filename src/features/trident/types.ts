import { CurrencyAmount, Token } from '@sushiswap/sdk'

export interface Pool {
  type: PoolType
  amounts: CurrencyAmount<Token>[]
  tokens: Token[]
  tvl: string
  apy: string
  fee: string
}

export enum PoolType {
  CLASSIC = 'CLASSIC',
  HYBRID = 'HYBRID',
  CONCENTRATED = 'CONCENTRATED',
  WEIGHTED = 'WEIGHTED',
}
