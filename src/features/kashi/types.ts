import { BigNumber } from '@ethersproject/bignumber'
import { WrappedTokenInfo } from 'app/state/lists/wrappedTokenInfo'

export interface Version {
  major: number
  minor: number
  patch: number
}

export interface Tags {}

export interface Token {
  address: string
  chainId: any
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export interface List {
  name: string
  timestamp: Date
  version: Version
  tags: Tags
  logoURI: string
  keywords: string[]
  tokens: Token[]
}

export interface TokenInfo {
  address: string
  chainId: number
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export type TotalSupply = BigNumber

export type Balance = BigNumber

export type BentoBalance = BigNumber

export type BentoAllowance = BigNumber

export type Nonce = BigNumber

export type BentoAmount = BigNumber

export type BentoShare = BigNumber

export type Rate = BigNumber

export type Elastic = BigNumber

export type Base = BigNumber

export interface Strategy {
  token: string
  apy: number
  targetPercentage: number
  utilization: number
}

export type Usd = BigNumber

export interface Collateral {
  isNative: boolean
  isToken: boolean
  list: List
  tokenInfo: TokenInfo
  _checksummedAddress: string
  _tags?: any
  token: TokenInfo
  totalSupply: TotalSupply
  balance: Balance
  bentoBalance: BentoBalance
  bentoAllowance: BentoAllowance
  nonce: Nonce
  bentoAmount: BentoAmount
  bentoShare: BentoShare
  rate: Rate
  address: string
  elastic: Elastic
  base: Base
  strategy: Strategy
  usd: Usd
  symbol: string
}

export interface Version2 {
  major: number
  minor: number
  patch: number
}

export interface Tags2 {}

export interface Token2 {
  address: string
  chainId: any
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export interface List2 {
  name: string
  timestamp: Date
  version: Version2
  tags: Tags2
  logoURI: string
  keywords: string[]
  tokens: Token2[]
}

export interface TokenInfo2 {
  address: string
  chainId: number
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export type TotalSupply2 = BigNumber

export type Balance2 = BigNumber

export type BentoBalance2 = BigNumber

export type BentoAllowance2 = BigNumber

export type Nonce2 = BigNumber

export type BentoAmount2 = BigNumber

export type BentoShare2 = BigNumber

export type Rate2 = BigNumber

export type Elastic2 = BigNumber

export type Base2 = BigNumber

export interface Strategy2 {
  token: string
  apy: number
  targetPercentage: number
  utilization: number
}

export type Usd2 = BigNumber

export interface Asset {
  isNative: boolean
  isToken: boolean
  list: List2
  tokenInfo: TokenInfo2
  _checksummedAddress: string
  _tags?: any
  token: WrappedTokenInfo
  totalSupply: TotalSupply2
  balance: Balance2
  bentoBalance: BentoBalance2
  bentoAllowance: BentoAllowance2
  nonce: Nonce2
  bentoAmount: BentoAmount2
  bentoShare: BentoShare2
  rate: Rate2
  address: string
  elastic: Elastic2
  base: Base2
  strategy: Strategy2
  usd: Usd2
  symbol: string
}

export interface Oracle {
  chainId: number
  address: string
  name: string
  warning: string
  error: string
}

export type TotalCollateralShare = BigNumber

export type UserCollateralShare = BigNumber

export type TotalAsset = BigNumber

export type UserAssetFraction = BigNumber

export type TotalBorrow = BigNumber

export type UserBorrowPart = BigNumber

export type CurrentExchangeRate = BigNumber

export type SpotExchangeRate = BigNumber

export type OracleExchangeRate = BigNumber

export type AccrueInfo = BigNumber

export type ElapsedSeconds = BigNumber

export type Value = BigNumber

export interface InterestPerYear {
  value: Value
  string: string
}

export type Value2 = BigNumber

export type UsdValue = BigNumber

export interface TotalCollateralAmount {
  value: Value2
  string: string
  usdValue: UsdValue
  usd: string
}

export type Value3 = BigNumber

export type UsdValue2 = BigNumber

export interface TotalAssetAmount {
  value: Value3
  string: string
  usdValue: UsdValue2
  usd: string
}

export type Value4 = BigNumber

export type UsdValue3 = BigNumber

export interface CurrentBorrowAmount {
  value: Value4
  string: string
  usdValue: UsdValue3
  usd: string
}

export type Value5 = BigNumber

export type UsdValue4 = BigNumber

export interface CurrentAllAssets {
  value: Value5
  string: string
  usdValue: UsdValue4
  usd: string
}

export type MarketHealth = BigNumber

export type Elastic3 = BigNumber

export type Base3 = BigNumber

export interface CurrentTotalAsset {
  elastic: Elastic3
  base: Base3
}

export type CurrentAllAssetShares = BigNumber

export type MaxAssetAvailable = BigNumber

export type MaxAssetAvailableFraction = BigNumber

export type Value6 = BigNumber

export interface Utilization {
  value: Value6
  string: string
}

export type Value7 = BigNumber

export type ValueWithStrategy = BigNumber

export interface SupplyAPR {
  value: Value7
  valueWithStrategy: ValueWithStrategy
  string: string
  stringWithStrategy: string
}

export type Value8 = BigNumber

export interface CurrentInterestPerYear {
  value: Value8
  string: string
}

export type Value9 = BigNumber

export type ValueWithStrategy2 = BigNumber

export interface CurrentSupplyAPR {
  value: Value9
  valueWithStrategy: ValueWithStrategy2
  string: string
  stringWithStrategy: string
}

export type Value10 = BigNumber

export type UsdValue5 = BigNumber

export interface UserCollateralAmount {
  value: Value10
  string: string
  usdValue: UsdValue5
  usd: string
}

export type Value11 = BigNumber

export type UsdValue6 = BigNumber

export interface CurrentUserAssetAmount {
  value: Value11
  string: string
  usdValue: UsdValue6
  usd: string
}

export type Value12 = BigNumber

export type UsdValue7 = BigNumber

export interface CurrentUserBorrowAmount {
  value: Value12
  string: string
  usdValue: UsdValue7
  usd: string
}

export type Value13 = BigNumber

export type UsdValue8 = BigNumber

export interface CurrentUserLentAmount {
  value: Value13
  string: string
  usdValue: UsdValue8
  usd: string
}

export type Value14 = BigNumber

export type UsdValue9 = BigNumber

export interface FeesEarned {
  value: Value14
  string: string
  usdValue: UsdValue9
  usd: string
}

export type Value15 = BigNumber

export type UsdValue10 = BigNumber

export interface Oracle2 {
  value: Value15
  string: string
  usdValue: UsdValue10
  usd: string
}

export type Value16 = BigNumber

export type UsdValue11 = BigNumber

export interface Spot {
  value: Value16
  string: string
  usdValue: UsdValue11
  usd: string
}

export type Value17 = BigNumber

export type UsdValue12 = BigNumber

export interface Stored {
  value: Value17
  string: string
  usdValue: UsdValue12
  usd: string
}

export type Value18 = BigNumber

export type UsdValue13 = BigNumber

export interface Minimum {
  value: Value18
  string: string
  usdValue: UsdValue13
  usd: string
}

export type Value19 = BigNumber

export type UsdValue14 = BigNumber

export interface Safe {
  value: Value19
  string: string
  usdValue: UsdValue14
  usd: string
}

export type Value20 = BigNumber

export type UsdValue15 = BigNumber

export interface Possible {
  value: Value20
  string: string
  usdValue: UsdValue15
  usd: string
}

export interface MaxBorrowable {
  oracle: Oracle2
  spot: Spot
  stored: Stored
  minimum: Minimum
  safe: Safe
  possible: Possible
}

export type Value21 = BigNumber

export type UsdValue16 = BigNumber

export interface SafeMaxRemovable {
  value: Value21
  string: string
  usdValue: UsdValue16
  usd: string
}

export type Value22 = BigNumber

export type Numerator = BigNumber

export type Denominator = BigNumber

export interface String {
  numerator: Numerator
  denominator: Denominator
}

export interface Health {
  value: Value22
  string: String
}

export type NetWorth = BigNumber

export type Value23 = BigNumber

export interface Asset2 {
  value: Value23
  string: string
}

export type Value24 = BigNumber

export interface Collateral2 {
  value: Value24
  string: string
}

export interface StrategyAPY {
  asset: Asset2
  collateral: Collateral2
}

export interface KashiMarket {
  collateral: Collateral
  asset: Asset
  oracle: Oracle
  oracleData: string
  totalCollateralShare: TotalCollateralShare
  userCollateralShare: UserCollateralShare
  totalAsset: TotalAsset[]
  userAssetFraction: UserAssetFraction
  totalBorrow: TotalBorrow[]
  userBorrowPart: UserBorrowPart
  currentExchangeRate: CurrentExchangeRate
  spotExchangeRate: SpotExchangeRate
  oracleExchangeRate: OracleExchangeRate
  accrueInfo: AccrueInfo
  address: string
  elapsedSeconds: ElapsedSeconds
  interestPerYear: InterestPerYear
  totalCollateralAmount: TotalCollateralAmount
  totalAssetAmount: TotalAssetAmount
  currentBorrowAmount: CurrentBorrowAmount
  currentAllAssets: CurrentAllAssets
  marketHealth: MarketHealth
  currentTotalAsset: CurrentTotalAsset
  currentAllAssetShares: CurrentAllAssetShares
  maxAssetAvailable: MaxAssetAvailable
  maxAssetAvailableFraction: MaxAssetAvailableFraction
  utilization: Utilization
  supplyAPR: SupplyAPR
  currentInterestPerYear: CurrentInterestPerYear
  currentSupplyAPR: CurrentSupplyAPR
  userCollateralAmount: UserCollateralAmount
  currentUserAssetAmount: CurrentUserAssetAmount
  currentUserBorrowAmount: CurrentUserBorrowAmount
  currentUserLentAmount: CurrentUserLentAmount
  feesEarned: FeesEarned
  maxBorrowable: MaxBorrowable
  safeMaxRemovable: SafeMaxRemovable
  health: Health
  netWorth: NetWorth
  search: string
  strategyAPY: StrategyAPY
}
