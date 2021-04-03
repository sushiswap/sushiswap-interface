import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import Fraction from "constants/Fraction"
import { FACTOR_PRECISION, FULL_UTILIZATION_MINUS_MAX, INTEREST_ELASTICITY, MAXIMUM_INTEREST_PER_YEAR, MAXIMUM_TARGET_UTILIZATION, MINIMUM_INTEREST_PER_YEAR, MINIMUM_TARGET_UTILIZATION, STARTING_INTEREST_PER_YEAR } from "kashi/constants"
import { e10 } from "./math"

export function accrue(pair:any, amount: BigNumber) {
  return amount
    .mul(pair.accrueInfo.interestPerSecond)
    .mul(pair.elapsedSeconds)
    .div(e10(18))
}

export function interestAccrue(pair: any, interest: BigNumber) {
  if (pair.totalBorrowAmount.eq(0)) { return STARTING_INTEREST_PER_YEAR }
  if (pair.elapsedSeconds.lte(0)) { return interest }

  let currentInterest = interest
  if (pair.utilization.lt(MINIMUM_TARGET_UTILIZATION)) {
    const underFactor = MINIMUM_TARGET_UTILIZATION.sub(pair.utilization).muldiv(FACTOR_PRECISION, MINIMUM_TARGET_UTILIZATION)
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

export function getUSDValue(amount: BigNumberish, token: any) {
  return BigNumber.from(amount).mul(token.usd).div(e10(token.decimals))
}

export function easyAmount(amount: BigNumber, token: any) {
  return {
    value: amount,
    string: Fraction.from(amount, e10(token.decimals)).toString(),
    usd: Fraction.from(getUSDValue(amount, token), e10(6)).toString()
  }
}
  