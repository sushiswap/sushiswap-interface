// Bootstrap...

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { Fraction } from './entities'

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
