import { Popover } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ANALYTICS_URL } from 'app/constants'
import { Feature } from 'enums'
import { featureEnabled } from 'functions/feature'
import Link from 'next/link'
import React, { FC } from 'react'
import { useActiveWeb3React } from 'services/web3'

import ExternalLink from '../ExternalLink'
import { NAV_BASE_CLASS } from './styles'

export const MobileNav: FC = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  return (
    <Popover.Panel className="sm:hidden">
      <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
        <Link href="/trident/swap">
          <a id="swap-nav-link" className={NAV_BASE_CLASS}>
            {i18n._(t`Swap`)}
          </a>
        </Link>
        <Link href="/pool">
          <a id="pool-nav-link" className={NAV_BASE_CLASS}>
            {i18n._(t`Pool`)}
          </a>
        </Link>

        <Link href="/migrate">
          <a id="migrate-nav-link" className={NAV_BASE_CLASS}>
            {i18n._(t`Migrate`)}
          </a>
        </Link>

        {chainId && featureEnabled(Feature.LIQUIDITY_MINING, chainId) && (
          <Link href="/farm">
            <a id="farm-nav-link" className={NAV_BASE_CLASS}>
              {' '}
              {i18n._(t`Farm`)}
            </a>
          </Link>
        )}

        {chainId && featureEnabled(Feature.KASHI, chainId) && (
          <>
            <Link href="/lend">
              <a id="lend-nav-link" className={NAV_BASE_CLASS}>
                {i18n._(t`Lend`)}
              </a>
            </Link>

            <Link href="/borrow">
              <a id="borrow-nav-link" className={NAV_BASE_CLASS}>
                {i18n._(t`Borrow`)}
              </a>
            </Link>
          </>
        )}

        {chainId && featureEnabled(Feature.STAKING, chainId) && (
          <Link href="/stake">
            <a id="stake-nav-link" className={NAV_BASE_CLASS}>
              {i18n._(t`Stake`)}
            </a>
          </Link>
        )}

        {chainId && featureEnabled(Feature.ANALYTICS, chainId) && (
          <ExternalLink
            id="analytics-nav-link"
            href={ANALYTICS_URL[chainId] || 'https://analytics.sushi.com'}
            className={NAV_BASE_CLASS}
          >
            {i18n._(t`Analytics`)}
          </ExternalLink>
        )}
      </div>
    </Popover.Panel>
  )
}
