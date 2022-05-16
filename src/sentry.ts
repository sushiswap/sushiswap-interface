/**
 * @filename Sentry
 * @summary Capture wallet failures and send to sentry tracing infra.
 * @env NEXT_PUBLIC_SENTRY_DSN
 * @env NEXT_PUBLIC_RELEASE_VERSION
 * @env NEXT_PUBLIC_SENTRY_ENV
 * @since 2022.05.16
 */

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

export const initSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
        // @note fallback is Sushi's DSN ingest point
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://e852f945bc774d718d25aa807d8417dd@o960777.ingest.sentry.io/5909166',
      // NEXT_PUBLIC_RELEASE_VERSION: Set in production script when releasing, see `git-hash.sh`
      release: process.env.NEXT_PUBLIC_RELEASE_VERSION,
      // fall back production 
      environment: process.env.NEXT_PUBLIC_SENTRY_ENV || 'production',
      integrations: [
        new Integrations.BrowserTracing(),
        new Sentry.Integrations.Breadcrumbs({
            // disable console logoutput for end users, not need to report errors to them
          console: false
        })
      ]
    })
  }
};


export const sentryLog = (msg: string, walletName?: string): any => {
// @note Sentry.withScope(function (scope: { setTag: (arg0: string, arg1: string) => void; setContext: (arg0: string, arg1: { name: string; }) => void; }) {
  Sentry.withScope(function (scope) {
    if (walletName) {
      scope.setTag('web3', walletName)
      scope.setContext('wallet', {
        name: walletName
      })
    }
    Sentry.captureMessage(msg)
  })
};