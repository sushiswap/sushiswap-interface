import { BigNumber } from '@ethersproject/bignumber'

export interface Rebase {
    base: BigNumber
    elastic: BigNumber
}

export interface AccrueInfo {
    interestPerSecond: BigNumber
    lastAccrued: BigNumber
    feesEarnedFraction: BigNumber
}

export interface KashiPollPair {
    address: string
    collateral: string
    asset: string
    oracle: string
    oracleData: string
    totalCollateralShare: BigNumber
    userCollateralShare: BigNumber
    totalAsset: Rebase
    userAssetFraction: BigNumber
    totalBorrow: Rebase
    userBorrowPart: BigNumber
    currentExchangeRate: BigNumber
    spotExchangeRate: BigNumber
    oracleExchangeRate: BigNumber
    accrueInfo: AccrueInfo
}

export default class KashiPair {
    address: string
    collateral: string
    asset: string

    constructor(address: string, collateral: string, asset: string) {
        this.address = address
        this.collateral = collateral
        this.asset = asset
    }
}
