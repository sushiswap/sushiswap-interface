import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { PoolType } from './pool/context/types'

export interface Pool {
  type: PoolType
  amounts: CurrencyAmount<Token>[]
  tokens: Token[]
  tvl: string
  apy: string
  fee: string
}
