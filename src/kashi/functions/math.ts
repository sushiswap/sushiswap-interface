import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { Fraction } from '../../entities'

declare global {
    interface String {
        toBigNumber(decimals: number): BigNumber
    }
}

declare module '@ethersproject/bignumber' {
    interface BigNumber {
        muldiv(multiplier: BigNumberish, divisor: BigNumberish): BigNumber
        toFixed(decimals: BigNumberish): string
    }
}

String.prototype.toBigNumber = function(decimals: BigNumberish): BigNumber {
    try {
        return ethers.utils.parseUnits(String(this), decimals)
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
        : ZERO
}

BigNumber.prototype.toFixed = function(decimals?: BigNumberish): string {
    return Fraction.from(this, decimals ? BigNumber.from(10).pow(BigNumber.from(decimals)) : ZERO).toString(
        BigNumber.from(decimals).toNumber()
    )
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
