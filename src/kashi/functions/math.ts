import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

declare module '@ethersproject/bignumber' {
  interface BigNumber {
    muldiv(multiplier: BigNumberish, divisor: BigNumberish): BigNumber
  }
}

BigNumber.prototype.muldiv = function muldiv(multiplier: BigNumberish, divisor: BigNumberish): BigNumber {
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
