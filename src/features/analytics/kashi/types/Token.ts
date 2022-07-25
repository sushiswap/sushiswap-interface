import { Rebase } from '@sushiswap/core-sdk'

export type Token = {
  id: string
  name: string
  symbol: string
  decimals: BigInt
  totalSupply?: BigInt
  totalSupplyElastic?: BigInt
  totalSupplyBase?: BigInt
  price?: BigInt
  block?: BigInt
  timestamp?: BigInt
}

export type TokenNew = {
  id: string
  name: string
  symbol: string
  decimals: BigInt
  totalSupply?: BigInt
  rebase?: Rebase
  price?: BigInt
  block?: BigInt
  timestamp?: BigInt
}
