import { CurrencyAmount, Token } from '@sushiswap/sdk'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>
