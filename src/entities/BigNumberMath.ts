import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

export interface BigNumberMath {
  min(...values: BigNumberish[]): BigNumber
  max(...values: BigNumberish[]): BigNumber
}

export class BigNumberMath implements BigNumberMath {
  static min(...values: BigNumberish[]): BigNumber {
    let lowest = BigNumber.from(values[0])
    for (let i = 1; i < values.length; i++) {
      const value = BigNumber.from(values[i])
      if (value.lt(lowest)) {
        lowest = value
      }
    }
    return lowest
  }
  static max(...values: BigNumberish[]): BigNumber {
    let highest = BigNumber.from(values[0])
    for (let i = 1; i < values.length; i++) {
      const value = BigNumber.from(values[i])
      if (value.gt(highest)) {
        highest = value
      }
    }
    return highest
  }
}

export default BigNumberMath
