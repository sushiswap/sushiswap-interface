import { KashiPair } from './KashiPair'
import { Token } from './Token'

export type KashiPairDayData = {
  id: string
  date: number
  pair: KashiPair
  totalAsset?: BigInt
  totalAssetElastic?: BigInt
  totalAssetBase?: BigInt
  totalCollateralShare?: BigInt
  totalBorrow?: BigInt
  totalBorrowElastic?: BigInt
  totalBorrowBase?: BigInt
  avgExchangeRate?: BigInt
  avgUtilization?: BigInt
  avgInterestPerSecond?: BigInt
}

export type KashiPairDayDataMap = {
  totalAsset: BigInt
  totalBorrow: BigInt
  avgExchangeRate: BigInt
  avgUtilization: BigInt
  avgInterestPerSecond: BigInt
  date: string
  kashiPairs: KashiPairDayData[]
}

export type KashiPairDayDataMapsCollateral = {
  collateral: Token
  kashiPairsMaps: KashiPairDayDataMap[]
}
