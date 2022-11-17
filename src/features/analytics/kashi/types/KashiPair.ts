import { Rebase } from '@sushiswap/core-sdk'

import { Token } from './Token'

export type KashiPair = {
  id: string
  type?: string
  owner?: string
  feeTo?: string
  name: string
  symbol: string
  oracle?: string
  asset?: Token
  collateral?: Token
  exchangeRate?: BigInt
  totalAssetElastic?: BigInt
  totalAssetBase?: BigInt
  totalAsset?: BigInt
  totalCollateralShare?: BigInt
  totalBorrowElastic?: BigInt
  totalBorrowBase?: BigInt
  totalBorrow?: BigInt
  interestPerSecond?: BigInt
  utilization?: BigInt
  feesEarnedFraction?: BigInt
  totalFeesEarnedFraction?: BigInt
  lastAccrued?: BigInt
  supplyAPR?: BigInt
  borrowAPR?: BigInt
  block?: BigInt
  timestamp?: BigInt
}

export type KashiPairKpi = {
  id: string
  supplyAPR?: BigInt
  borrowAPR?: BigInt
  utilization?: BigInt
  totalFeesEarnedFraction?: BigInt
}

export type KashiPairAccrueInfo = {
  id: string
  interestPerSecond?: BigInt
  lastAccrued?: BigInt
  feesEarnedFraction?: BigInt
}

export type KashiPairNew = {
  id: string
  type?: string
  owner?: string
  feeTo?: string
  name: string
  symbol: string
  oracle?: string
  asset?: Token
  collateral?: Token
  exchangeRate?: BigInt
  totalAsset?: Rebase
  totalCollateralShare?: BigInt
  totalBorrow?: Rebase
  accrueInfo?: KashiPairAccrueInfo
  kpi?: KashiPairKpi
  totalAssetAmount?: BigInt
  totalBorrowAmount?: BigInt
  block?: BigInt
  timestamp?: BigInt
}

export type KashiPairsByToken = {
  token: Token
  totalAsset: BigInt
  totalBorrow: BigInt
  kashiPairs: KashiPair[]
}

export type KashiPairsByTokenNew = {
  token: Token
  totalAsset: BigInt
  totalBorrow: BigInt
  kashiPairs: KashiPairNew[]
}
