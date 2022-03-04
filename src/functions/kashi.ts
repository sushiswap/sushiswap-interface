import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { USD } from '@sushiswap/core-sdk'
import {
  FACTOR_PRECISION,
  FULL_UTILIZATION_MINUS_MAX,
  INTEREST_ELASTICITY,
  MAXIMUM_INTEREST_PER_YEAR,
  MAXIMUM_TARGET_UTILIZATION,
  MINIMUM_INTEREST_PER_YEAR,
  MINIMUM_TARGET_UTILIZATION,
  PROTOCOL_FEE,
  PROTOCOL_FEE_DIVISOR,
  STARTING_INTEREST_PER_YEAR,
} from '@sushiswap/sdk'

import { e10, ZERO } from './math'

export function accrue(pair: any, amount: BigNumber, includePrincipal = false): BigNumber {
  return amount
    .mul(pair.accrueInfo.interestPerSecond)
    .mul(pair.elapsedSeconds)
    .div(e10(18))
    .add(includePrincipal ? amount : ZERO)
}

export function accrueTotalAssetWithFee(pair: any): {
  elastic: BigNumber
  base: BigNumber
} {
  const extraAmount = pair.totalBorrow.elastic
    .mul(pair.accrueInfo.interestPerSecond)
    .mul(pair.elapsedSeconds.add('3600')) // Project an hour into the future
    .div(e10(18))
  const feeAmount = extraAmount.mul(PROTOCOL_FEE).div(PROTOCOL_FEE_DIVISOR) // % of interest paid goes to fee
  const feeFraction = feeAmount.mulDiv(pair.totalAsset.base, pair.currentAllAssets.value)
  return {
    elastic: pair.totalAsset.elastic,
    base: pair.totalAsset.base.add(feeFraction),
  }
}

export function interestAccrue(pair: any, interest: BigNumber): BigNumber {
  if (pair.totalBorrow.base.eq(0)) {
    return STARTING_INTEREST_PER_YEAR
  }
  if (pair.elapsedSeconds.lte(0)) {
    return interest
  }

  let currentInterest = interest
  if (pair.utilization.lt(MINIMUM_TARGET_UTILIZATION)) {
    const underFactor = BigNumber.from(MINIMUM_TARGET_UTILIZATION)
      .sub(pair.utilization)
      .mulDiv(FACTOR_PRECISION, MINIMUM_TARGET_UTILIZATION)
    const scale = INTEREST_ELASTICITY.add(underFactor.mul(underFactor).mul(pair.elapsedSeconds))
    currentInterest = currentInterest.mul(INTEREST_ELASTICITY).div(scale)

    if (currentInterest.lt(MINIMUM_INTEREST_PER_YEAR)) {
      currentInterest = MINIMUM_INTEREST_PER_YEAR // 0.25% APR minimum
    }
  } else if (pair.utilization.gt(MAXIMUM_TARGET_UTILIZATION)) {
    const overFactor = pair.utilization
      .sub(MAXIMUM_TARGET_UTILIZATION)
      .mul(FACTOR_PRECISION.div(FULL_UTILIZATION_MINUS_MAX))
    const scale = INTEREST_ELASTICITY.add(overFactor.mul(overFactor).mul(pair.elapsedSeconds))
    currentInterest = currentInterest.mul(scale).div(INTEREST_ELASTICITY)
    if (currentInterest.gt(MAXIMUM_INTEREST_PER_YEAR)) {
      currentInterest = MAXIMUM_INTEREST_PER_YEAR // 1000% APR maximum
    }
  }
  return currentInterest
}

export function getUSDValue(amount: BigNumberish, token: any): BigNumber {
  return BigNumber.from(amount)
    .mul(token.usd)
    .div(e10(token?.decimals ? token.decimals : token.tokenInfo.decimals))
}

export function getUSDString(amount: BigNumberish, token: any): string {
  return BigNumber.from(amount)
    .mul(token.usd)
    .div(e10(token?.decimals ? token.decimals : token.tokenInfo.decimals))
    .toFixed(USD[token?.chainId ? token.chainId : token.tokenInfo.chainId].decimals)
}

export function easyAmount(
  amount: BigNumber,
  token: any
): { value: BigNumber; string: string; usdValue: BigNumber; usd: string } {
  // console.log('easyAmount', token)
  return {
    value: amount,
    string: amount.toFixed(token?.decimals ? token.decimals : token.tokenInfo.decimals),
    usdValue: getUSDValue(amount, token),
    usd: getUSDString(amount, token),
  }
}

export function takeFee(amount: BigNumber): BigNumber {
  return amount.mul(BigNumber.from(9)).div(BigNumber.from(10))
}

export function addBorrowFee(amount: BigNumber): BigNumber {
  return amount.mul(BigNumber.from(10005)).div(BigNumber.from(10000))
}

export function getFraction({
  // @ts-ignore TYPE NEEDS FIXING
  totalAssetBase,
  // @ts-ignore TYPE NEEDS FIXING
  totalAssetElastic,
  // @ts-ignore TYPE NEEDS FIXING
  totalBorrowElastic,
  // @ts-ignore TYPE NEEDS FIXING
  token0: { totalSupplyBase, totalSupplyElastic },
}) {
  return totalAssetBase / (Number(totalAssetElastic) + (totalBorrowElastic * totalSupplyBase) / totalSupplyElastic)
}
