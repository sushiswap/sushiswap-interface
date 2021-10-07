import { ChainId, Currency, NATIVE, SUSHI_ADDRESS } from '@sushiswap/sdk';
import React, { useEffect, useState } from 'react';

import { ANALYTICS_URL, APP_NAME, APP_NAME_URL } from '../../constants';
import Buy from '../../features/ramp';
import ExternalLink from '../ExternalLink';
import Image from 'next/image';
import LanguageSwitch from '../LanguageSwitch';
import Link from 'next/link';
import More from './More';
import NavLink from '../NavLink';
import { Popover } from '@headlessui/react';
import QuestionHelper from '../QuestionHelper';
import Web3Network from '../Web3Network';
import Web3Status from '../Web3Status';
import { t } from '@lingui/macro';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useETHBalances } from '../../state/wallet/hooks';
import { useLingui } from '@lingui/react';
import Gas from '../Gas';

function AppBar(): JSX.Element {
  const { i18n } = useLingui();
  const { account, chainId, library } = useActiveWeb3React();

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];

  return (
    //     // <header className="flex flex-row justify-between w-screen flex-nowrap">
    <header className="flex-shrink-0 w-full">
      <Popover as="nav" className="z-10 w-full bg-transparent">
        {({ open }) => (
          <>
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Link href="/">
                    <a className="mt-5">
                      <Image layout="fixed" src="/logo7.png" alt={APP_NAME} width="185px" height="50px" />
                    </a>
                  </Link>
                  <span className="mt-2 ml-1 text-lg text-indigo-300 "> </span>
                  <div className="hidden mt-6 sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      <HeaderLinks />

                      <div>{/* <ShowGas chainId={chainId} /> */}</div>

                      {/* 
                      <NavLink href="/swap">
                        <a
                          id={`swap-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          {i18n._(t`Swap`)}
                        </a>
                      </NavLink>
                      <NavLink href="/pool">
                        <a
                          id={`pool-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          {i18n._(t`Pool`)}
                        </a>
                      </NavLink>
                      {chainId && [ChainId.MAINNET, ChainId.MATIC, ChainId.BSC].includes(chainId) && (
                        <NavLink href={'/migrate'}>
                          <a
                            id={`migrate-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            {i18n._(t`Migrate`)}
                          </a>
                        </NavLink>
                      )}
                      {chainId && [ChainId.MAINNET, ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY].includes(chainId) && (
                        <NavLink href={'/farm'}>
                          <a
                            id={`farm-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            {i18n._(t`Farm`)}
                          </a>
                        </NavLink>
                      )}
                      {chainId &&
                        [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC, ChainId.XDAI].includes(
                          chainId
                        ) && (
                          <>
                            <NavLink href={'/lend'}>
                              <a
                                id={`lend-nav-link`}
                                className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                              >
                                {i18n._(t`Lend`)}
                              </a>
                            </NavLink>
                            <NavLink href={'/borrow'}>
                              <a
                                id={`borrow-nav-link`}
                                className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                              >
                                {i18n._(t`Borrow`)}
                              </a>
                            </NavLink>
                          </>
                        )}
                      {chainId === ChainId.MAINNET && (
                        <NavLink href={'/stake'}>
                          <a
                            id={`stake-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            {i18n._(t`Stake`)}
                          </a>
                        </NavLink>
                      )}
                      {chainId === ChainId.MAINNET && (
                        <Link href={'/miso'}>
                          <a
                            id={`miso-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            {i18n._(t`Miso`)}
                          </a>
                        </Link>
                      )}
                      */}
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-4 mt-6 lg:w-auto bg-dark-1000 lg:relative lg:p-0 lg:bg-transparent">
                  <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                    {library && library.provider.isMetaMask && (
                      <div className="hidden sm:inline-block">
                        <Web3Network />
                      </div>
                    )}

                    <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                      {account && chainId && userEthBalance && (
                        <>
                          <div className="px-3 py-2 text-primary text-bold">
                            {userEthBalance?.toSignificant(4)} {NATIVE[chainId].symbol}
                          </div>
                        </>
                      )}
                      <Web3Status />
                    </div>
                    {/*
                    <div className="hidden md:block">
                      <LanguageSwitch />
                    </div>
                    <More />
                      */}
                  </div>
                </div>
                <div className="flex -mr-2 sm:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                    <span className="sr-only">{i18n._(t`Open main menu`)}</span>
                    {open ? (
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      // <X title="Close" className="block w-6 h-6" aria-hidden="true" />
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                      // <Burger title="Burger" className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
              </div>
            </div>

            <Popover.Panel className="sm:hidden">
              <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                <HeaderLinks />
                {/*
                <Link href={'/swap'}>
                  <a
                    id={`swap-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Swap`)}
                  </a>
                </Link>
                <Link href={'/pool'}>
                  <a
                    id={`pool-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Pool`)}
                  </a>
                </Link>

                <Link href={'/migrate'}>
                  <a
                    id={`migrate-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Migrate`)}
                  </a>
                </Link>

                {chainId && [ChainId.MAINNET, ChainId.MATIC, ChainId.HARMONY, ChainId.XDAI].includes(chainId) && (
                  <Link href={'/farm'}>
                    <a
                      id={`farm-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {' '}
                      {i18n._(t`Farm`)}
                    </a>
                  </Link>
                )}

                {chainId && [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(chainId) && (
                  <>
                    <Link href={'/lend'}>
                      <a
                        id={`lend-nav-link`}
                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      >
                        {i18n._(t`Lend`)}
                      </a>
                    </Link>

                    <Link href={'/borrow'}>
                      <a
                        id={`borrow-nav-link`}
                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      >
                        {i18n._(t`Borrow`)}
                      </a>
                    </Link>
                  </>
                )}
                {chainId === ChainId.MAINNET && (
                  <Link href={'/stake'}>
                    <a
                      id={`stake-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Stake`)}
                    </a>
                  </Link>
                )}
                {chainId &&
                  [ChainId.MAINNET, ChainId.BSC, ChainId.XDAI, ChainId.FANTOM, ChainId.MATIC].includes(chainId) && (
                    <ExternalLink
                      id={`analytics-nav-link`}
                      href={ANALYTICS_URL[chainId] || 'https://analytics.sushi.com'}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Analytics`)}
                    </ExternalLink>
                  )}

                {chainId === ChainId.MAINNET && (
                  <Link href={'/miso'}>
                    <a
                      id={`stake-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Miso`)}
                    </a>
                  </Link>
                )} */}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </header>
  );
}

export default AppBar;

const HeaderNavLink = ({ href, children }) => (
  <NavLink href={href}>
    <a id={href} className="p-2 text-gray-400 hover:text-gray-200 focus:text-high-emphesis md:p-3 whitespace-nowrap">
      {children}
    </a>
  </NavLink>
);

const HeaderLinks = () => (
  <>
    <HeaderNavLink href="/markets">Markets</HeaderNavLink>
    <HeaderNavLink href="/lend">Deposit</HeaderNavLink>
    <HeaderNavLink href="/lend">Borrow</HeaderNavLink>
    <HeaderNavLink href="/yield">Yield</HeaderNavLink>
    <HeaderNavLink href="/dashboard">Dashboard</HeaderNavLink>
  </>
);

const ShowGas = ({ chainId }) => {
  if (chainId === ChainId.MAINNET)
    return (
      <div className="items-center hidden w-full h-full px-3 space-x-2 rounded cursor-pointer text-green text-opacity-60 hover:text-opacity-90 md:flex hover:bg-dark-800">
        <svg
          className="opacity-60"
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5215 0.618164L12.6818 1.57302L15.933 4.37393V13.2435C15.9114 13.6891 15.5239 14.0498 15.0502 14.0286C14.6196 14.0074 14.2751 13.6679 14.2536 13.2435V7.28093C14.2536 6.21998 13.3923 5.37122 12.3158 5.37122H11.8421V2.67641C11.8421 1.61546 10.9808 0.766697 9.90428 0.766697H1.93779C0.861242 0.766697 0 1.61546 0 2.67641V18.4421C0 18.9089 0.387559 19.2909 0.861242 19.2909H10.9808C11.4545 19.2909 11.8421 18.9089 11.8421 18.4421V6.64436H12.3158C12.6818 6.64436 12.9617 6.92021 12.9617 7.28093V13.2435C13.0048 14.4105 13.9737 15.3017 15.1579 15.2805C16.2775 15.2381 17.1818 14.3469 17.2248 13.2435V3.80102L13.5215 0.618164ZM9.66744 8.89358H2.17464V3.10079H9.66744V8.89358Z"
            fill="#7CFF6B"
          />
        </svg>

        <div className="hidden md:block text-baseline">
          <Gas />
        </div>
      </div>
    );

  return null;
};
