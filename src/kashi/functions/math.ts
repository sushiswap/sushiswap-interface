import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { Fraction } from '../../entities'

String.prototype.toBigNumber = function(decimals: BigNumberish): BigNumber {
    try {
        return parseUnits(this as string, decimals)
    } catch (error) {
        console.debug(`Failed to parse input amount: "${this}"`, error)
    }
    return BigNumber.from(0)
}

BigNumber.prototype.muldiv = function(multiplier: BigNumberish, divisor: BigNumberish): BigNumber {
    return BigNumber.from(divisor).gt(0)
        ? BigNumber.from(this)
              .mul(multiplier)
              .div(divisor)
        : Zero
}

BigNumber.prototype.toFixed = function(decimals: BigNumberish = 18, maxFractions: BigNumberish = 8): string {
    return this.toFraction(decimals, 10).toString(BigNumber.from(maxFractions).toNumber())
}

BigNumber.prototype.toFraction = function(decimals: BigNumberish = 18): Fraction {
    return Fraction.from(this, decimals ? BigNumber.from(10).pow(decimals) : Zero)
}

export const ZERO = BigNumber.from('0')

export function e10(exponent: BigNumber | Number | string): BigNumber {
    return BigNumber.from('10').pow(BigNumber.from(exponent))
}

export function minimum(...values: BigNumberish[]): BigNumber {
    let lowest = BigNumber.from(values[0])
    for (let i = 1; i < values.length; i++) {
        const value = BigNumber.from(values[i])
        if (value.lt(lowest)) {
            lowest = value
        }
    }
    return lowest
}

export function maximum(...values: BigNumberish[]): BigNumber {
    let highest = BigNumber.from(values[0])
    for (let i = 1; i < values.length; i++) {
        const value = BigNumber.from(values[i])
        if (value.gt(highest)) {
            highest = value
        }
    }
    return highest
}
