import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import {
    FACTOR_PRECISION,
    FULL_UTILIZATION_MINUS_MAX,
    getCurrency,
    INTEREST_ELASTICITY,
    MAXIMUM_INTEREST_PER_YEAR,
    MAXIMUM_TARGET_UTILIZATION,
    MINIMUM_INTEREST_PER_YEAR,
    MINIMUM_TARGET_UTILIZATION,
    PROTOCOL_FEE,
    PROTOCOL_FEE_DIVISOR,
    STARTING_INTEREST_PER_YEAR
} from 'kashi/constants'
import { e10, ZERO } from './math'

export function accrue(pair: any, amount: BigNumber, includePrincipal = false) {
    return amount
        .mul(pair.accrueInfo.interestPerSecond)
        .mul(pair.elapsedSeconds)
        .div(e10(18))
        .add(includePrincipal ? amount : ZERO)
}

export function accrueTotalAssetWithFee(pair: any) {
    const extraAmount = pair.totalBorrow.elastic
        .mul(pair.accrueInfo.interestPerSecond)
        .mul(pair.elapsedSeconds.add('3600')) // Project an hour into the future
        .div(e10(18))
    const feeAmount = extraAmount.mul(PROTOCOL_FEE).div(PROTOCOL_FEE_DIVISOR) // % of interest paid goes to fee
    const feeFraction = feeAmount.muldiv(pair.totalAsset.base, pair.currentAllAssets.value)
    return {
        elastic: pair.totalAsset.elastic,
        base: pair.totalAsset.base.add(feeFraction)
    }
}

export function interestAccrue(pair: any, interest: BigNumber) {
    if (pair.totalBorrow.base.eq(0)) {
        return STARTING_INTEREST_PER_YEAR
    }
    if (pair.elapsedSeconds.lte(0)) {
        return interest
    }

    let currentInterest = interest
    if (pair.utilization.lt(MINIMUM_TARGET_UTILIZATION)) {
        const underFactor = MINIMUM_TARGET_UTILIZATION.sub(pair.utilization).muldiv(
            FACTOR_PRECISION,
            MINIMUM_TARGET_UTILIZATION
        )
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
    return BigNumber.from(amount)
        .mul(token.usd)
        .div(e10(token.decimals))
}

export function getUSDString(amount: BigNumberish, token: any) {
    return BigNumber.from(amount)
        .mul(token.usd)
        .div(e10(token.decimals))
        .toFixed(getCurrency(token.chainId).decimals)
}

export function easyAmount(
    amount: BigNumber,
    token: any
): { value: BigNumber; string: string; usdValue: BigNumber; usd: string } {
    return {
        value: amount,
        string: amount.toFixed(token.decimals),
        usdValue: getUSDValue(amount, token),
        usd: getUSDString(amount, token)
    }
}

export function takeFee(amount: BigNumber) {
    return amount.mul(BigNumber.from(9)).div(BigNumber.from(10))
}

export function addBorrowFee(amount: BigNumber) {
    return amount.mul(BigNumber.from(10005)).div(BigNumber.from(10000))
}
