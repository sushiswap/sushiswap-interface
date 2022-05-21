/**
* @implements Bootstrap
* @summary
*     - React
*     - BigInt/BigNumber
*     - Sentry Instrumentation
*     - Sentry Tracing
*     - Analytics
*     - Nextjs
*
*/
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import * as Sentry from '@sentry/nextjs'
import { Integrations } from '@sentry/tracing'
import { Fraction } from 'app/entities/bignumber'
import React from 'react'

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

BigNumber.prototype.mulDiv = function (multiplier: BigNumberish, divisor: BigNumberish): BigNumber {
  // console.log('mulDiv', multiplier, divisor)
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

BigNumber.prototype.min = function (...values: BigNumberish[]): BigNumber {
  let lowest = BigNumber.from(values[0])
  for (let i = 1; i < values.length; i++) {
    const value = BigNumber.from(values[i])
    if (value.lt(lowest)) {
      lowest = value
    }
  }
  return lowest
}

BigNumber.prototype.max = function (...values: BigNumberish[]): BigNumber {
  let highest = BigNumber.from(values[0])
  for (let i = 1; i < values.length; i++) {
    const value = BigNumber.from(values[i])
    if (value.gt(highest)) {
      highest = value
    }
  }
  return highest
}

export const initSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      // @note fallback is Sushi's DSN ingest point
      // prettier-ignore
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://e852f945bc774d718d25aa807d8417dd@o960777.ingest.sentry.io/5909166',
      // NEXT_PUBLIC_RELEASE_VERSION: Set in production script when releasing, see `git-hash.sh`
      //release: process.env.NEXT_PUBLIC_RELEASE_VERSION,
        release: 'sushiswap-2022.05.21-debug',
      // fall back production
      environment: process.env.NEXT_PUBLIC_SENTRY_ENV || 'production',
      integrations: [
        new Integrations.BrowserTracing({
          // default = ['localhost', /^\//],
         tracingOrigins: ['api.sushirelay.com/v1', '*.vercel.app', '*.sushi.com']
        }),
        new Sentry.Integrations.Breadcrumbs({
          // disable console logoutput for end users, not need to report errors to them
          console: true,
        }),
      ],
    })
  }
}


    new Sentry.BrowserTracing({
      tracingOrigins: ["api.sushirelay.com/v1"],
    }),

export const sentryLog = (msg: string, walletName?: string): any => {
  // @note Sentry.withScope(function (scope: { setTag: (arg0: string, arg1: string) => void; setContext: (arg0: string, arg1: { name: string; }) => void; }) {
  Sentry.withScope(function (scope) {
    if (walletName) {
      scope.setTag('web3', walletName)
      scope.setContext('wallet', {
        name: walletName,
      })
    }
    Sentry.captureMessage(msg)
  })
}

/**
export async function logError(err: Error) {
  Sentry.captureException(err)

  if (window.console && console.error) console.error(err)
}
*/
