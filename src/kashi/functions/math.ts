import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ethers } from 'ethers'

declare global {
  interface String {
    toBigNumber(decimals: number): BigNumber
  }
}

declare module '@ethersproject/bignumber' {
  interface BigNumber {
    muldiv(multiplier: BigNumberish, divisor: BigNumberish): BigNumber
  }
}

String.prototype.toBigNumber = function(decimals: number): BigNumber {
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

export const ZERO = BigNumber.from('0')

export function e10(exponent: BigNumber | Number | string) {
  return BigNumber.from('10').pow(BigNumber.from(exponent))
}

export function min(...values: BigNumberish[]) {
  let lowest = BigNumber.from(values[0])
  for (let i = 1; i < values.length; i++) {
    const value = BigNumber.from(values[i])
    if (value.lt(lowest)) {
      lowest = value
    }
  }
  return lowest
}

// try to parse a user entered amount for a number of decimals
export function toBN(value: string, decimals: number): BigNumber | undefined {
  try {
    return ethers.utils.parseUnits(value, decimals)
  } catch (error) {
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  return undefined
}