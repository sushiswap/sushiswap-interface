// Bootstrap...

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import Fraction from './entities/Fraction'
import React from 'react'
import { Zero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'

BigNumber.prototype.mulDiv = function (multiplier: BigNumberish, divisor: BigNumberish): BigNumber {
  return BigNumber.from(divisor).gt(0) ? BigNumber.from(this).mul(multiplier).div(divisor) : Zero
}

BigNumber.prototype.toFraction = function (decimals: BigNumberish = 18): Fraction {
  return Fraction.from(this, decimals ? BigNumber.from(10).pow(decimals) : Zero)
}

BigNumber.prototype.toFixed = function (decimals: BigNumberish = 18, maxFractions: BigNumberish = 8): string {
  return this.toFraction(decimals, 10).toString(BigNumber.from(maxFractions).toNumber())
}

String.prototype.toBigNumber = function (decimals: BigNumberish): BigNumber {
  try {
    return parseUnits(this as string, decimals)
  } catch (error) {
    console.debug(`Failed to parse input amount: "${this}"`, error)
  }
  return BigNumber.from(0)
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')

  // See https://github.com/welldone-software/why-did-you-render#options
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOwnerReasons: true,
    collapseGroups: true,
  })
}
