import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import { Feature } from 'enums'
import { featureEnabled } from 'functions/feature'
import Image from 'next/image'
import React, { FC } from 'react'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances } from 'state/wallet/hooks'

import LanguageSwitch from '../LanguageSwitch'
import NavLink from '../NavLink'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'
import MobileMenuToggle from './MobileMenuToggle'
import More from './More'
import { ACTIVE_NAV_LINK_CLASS, NAV_BASE_CLASS } from './styles'

interface DesktopNavProps {
  mobileMenuOpen: boolean
}

export const DesktopNav: FC<DesktopNavProps> = ({ mobileMenuOpen }) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  return (
    <div className="px-6 py-3 flex flex-col gap-3">
      <div className="grid grid-cols-2 items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-6">
            <Image src="/logo.svg" alt="Sushi logo" width="24px" height="24px" />
          </div>
          <div className="flex space-x-1.5 hidden sm:block">
            <NavLink
              href={chainId && featureEnabled(Feature.TRIDENT, chainId) ? '/trident/swap' : '/legacy/swap'}
              activeClassName={ACTIVE_NAV_LINK_CLASS}
            >
              <a id="swap-nav-link" className={NAV_BASE_CLASS}>
                {i18n._(t`Swap`)}
              </a>
            </NavLink>

            {chainId && featureEnabled(Feature.TRIDENT, chainId) && (
              <NavLink href="/trident/pools" activeClassName={ACTIVE_NAV_LINK_CLASS}>
                <a id="trident-nav-link" className={NAV_BASE_CLASS}>
                  {i18n._(t`Trident`)}
                </a>
              </NavLink>
            )}

            {chainId && featureEnabled(Feature.TRIDENT, chainId) && (
              <NavLink href="/trident/balances/wallet" activeClassName={ACTIVE_NAV_LINK_CLASS}>
                <a id="trident-nav-link" className={NAV_BASE_CLASS}>
                  {i18n._(t`Balances`)}
                </a>
              </NavLink>
            )}

            <NavLink href="/pool" activeClassName={ACTIVE_NAV_LINK_CLASS}>
              <a id="pool-nav-link" className={NAV_BASE_CLASS}>
                {i18n._(t`Pool`)}
              </a>
            </NavLink>

            {chainId &&
              (featureEnabled(Feature.TRIDENT, chainId) ? (
                <NavLink href="/trident/migrate" activeClassName={ACTIVE_NAV_LINK_CLASS}>
                  <a id="trident-migrate-nav-link" className={NAV_BASE_CLASS}>
                    {i18n._(t`Migrate`)}
                  </a>
                </NavLink>
              ) : (
                featureEnabled(Feature.MIGRATE, chainId) && (
                  <NavLink href={'/migrate'} activeClassName={ACTIVE_NAV_LINK_CLASS}>
                    <a id="migrate-nav-link" className={NAV_BASE_CLASS}>
                      {i18n._(t`Migrate`)}
                    </a>
                  </NavLink>
                )
              ))}

            {chainId && featureEnabled(Feature.LIQUIDITY_MINING, chainId) && (
              <NavLink href="/farm" activeClassName={ACTIVE_NAV_LINK_CLASS}>
                <a id="farm-nav-link" className={NAV_BASE_CLASS}>
                  {i18n._(t`Farm`)}
                </a>
              </NavLink>
            )}

            {chainId && featureEnabled(Feature.KASHI, chainId) && (
              <>
                <NavLink href="/lend" activeClassName={ACTIVE_NAV_LINK_CLASS}>
                  <a id="lend-nav-link" className={NAV_BASE_CLASS}>
                    {i18n._(t`Lend`)}
                  </a>
                </NavLink>

                <NavLink href="/borrow" activeClassName={ACTIVE_NAV_LINK_CLASS}>
                  <a id="borrow-nav-link" className={NAV_BASE_CLASS}>
                    {i18n._(t`Borrow`)}
                  </a>
                </NavLink>
              </>
            )}

            {chainId && featureEnabled(Feature.STAKING, chainId) && (
              <NavLink href="/stake">
                <a id="stake-nav-link" className={NAV_BASE_CLASS}>
                  {i18n._(t`Stake`)}
                </a>
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          {library && library.provider.isMetaMask && (
            <div className="hidden sm:inline-block">
              <Web3Network />
            </div>
          )}

          <div className="w-auto flex items-center rounded border border-dark-800 hover:border-dark-700 bg-dark-900 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
            {account && chainId && userEthBalance && (
              <>
                <div className="px-3 text-high-emphesis text-bold">
                  {userEthBalance?.toSignificant(4)} {NATIVE[chainId].symbol}
                </div>
              </>
            )}
            <Web3Status />
          </div>
          <div className="hidden lg:flex">
            <LanguageSwitch />
          </div>
          <More />
          <MobileMenuToggle isOpen={mobileMenuOpen} />
        </div>
      </div>
    </div>
  )
}
