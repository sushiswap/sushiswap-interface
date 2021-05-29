import { ChainId, Currency } from '@sushiswap/sdk'
import React, { useEffect, useState } from 'react'

import { ANALYTICS_URL } from '../../constants'
import ExternalLink from '../ExternalLink'
import Image from 'next/image'
import LanguageSwitch from '../LanguageSwitch'
import Link from 'next/link'
import More from './More'
import { Popover } from '@headlessui/react'
import QuestionHelper from '../QuestionHelper'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useETHBalances } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react'

// import { ExternalLink, NavLink } from "./Link";
// import { ReactComponent as Burger } from "../assets/images/burger.svg";

function AppBar(): JSX.Element {
    const { i18n } = useLingui()
    const { account, chainId, library } = useActiveWeb3React()

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

    return (
        //     // <header className="flex flex-row justify-between w-screen flex-nowrap">
        <header className="flex-shrink-0 w-full">
            <Popover as="nav" className="z-10 w-full bg-transparent gradiant-border-bottom">
                {({ open }) => (
                    <>
                        <div className="px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image src="/logo.png" alt="Sushi" width="32px" height="32px" />
                                    <div className="hidden sm:block sm:ml-4">
                                        <div className="flex space-x-2">
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
                                            {chainId && [ChainId.MAINNET, ChainId.MATIC].includes(chainId) && (
                                                <Link href={'/farm'}>
                                                    <a
                                                        id={`farm-nav-link`}
                                                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    >
                                                        {i18n._(t`Farm`)}
                                                    </a>
                                                </Link>
                                            )}
                                            {chainId &&
                                                [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(
                                                    chainId
                                                ) && (
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
                                                        {/* <Link href={'/bento'}>
                                                            <a
                                                                id={`bento-nav-link`}
                                                                className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                            >
                                                                {i18n._(t`BentoBox`)}
                                                            </a>
                                                        </Link> */}
                                                    </>
                                                )}
                                            {/* {chainId === ChainId.MAINNET && (
                                                <Link href={'/vesting'}>
                                                    <a
                                                        id={`vesting-nav-link`}
                                                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                                    >
                                                        {i18n._(t`Vesting`)}
                                                    </a>
                                                </Link>
                                            )} */}
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
                                        </div>
                                    </div>
                                </div>

                                <div className="fixed bottom-0 left-0 flex flex-row items-center justify-center w-full p-4 lg:w-auto bg-dark-1000 lg:relative lg:p-0 z-2 border-top-1">
                                    <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                                        {chainId &&
                                            [ChainId.MAINNET].includes(chainId) &&
                                            library &&
                                            library.provider.isMetaMask && (
                                                <>
                                                    <QuestionHelper
                                                        text={i18n._(t`Add xSUSHI to your MetaMask wallet`)}
                                                    >
                                                        <div
                                                            className="hidden p-0.5 rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800"
                                                            onClick={() => {
                                                                const params: any = {
                                                                    type: 'ERC20',
                                                                    options: {
                                                                        address:
                                                                            '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
                                                                        symbol: 'XSUSHI',
                                                                        decimals: 18,
                                                                        image:
                                                                            'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272/logo.png'
                                                                    }
                                                                }

                                                                if (
                                                                    library &&
                                                                    library.provider.isMetaMask &&
                                                                    library.provider.request
                                                                ) {
                                                                    library.provider
                                                                        .request({
                                                                            method: 'wallet_watchAsset',
                                                                            params
                                                                        })
                                                                        .then(success => {
                                                                            if (success) {
                                                                                console.log(
                                                                                    'Successfully added XSUSHI to MetaMask'
                                                                                )
                                                                            } else {
                                                                                throw new Error('Something went wrong.')
                                                                            }
                                                                        })
                                                                        .catch(console.error)
                                                                }
                                                            }}
                                                        >
                                                            <Image
                                                                src="/images/tokens/xsushi-square.jpg"
                                                                alt="xSUSHI"
                                                                width="38px"
                                                                height="38px"
                                                                objectFit="contain"
                                                                className="rounded-md"
                                                            />
                                                        </div>
                                                    </QuestionHelper>
                                                </>
                                            )}

                                        {chainId &&
                                            [ChainId.MAINNET, ChainId.BSC, ChainId.MATIC].includes(chainId) &&
                                            library &&
                                            library.provider.isMetaMask && (
                                                <>
                                                    <QuestionHelper text={i18n._(t`Add SUSHI to your MetaMask wallet`)}>
                                                        <div
                                                            className="hidden rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
                                                            onClick={() => {
                                                                let address: string | undefined
                                                                switch (chainId) {
                                                                    case ChainId.MAINNET:
                                                                        address =
                                                                            '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'
                                                                        break
                                                                    case ChainId.BSC:
                                                                        address =
                                                                            '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4'
                                                                        break
                                                                    case ChainId.MATIC:
                                                                        address =
                                                                            '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a'
                                                                        break
                                                                }
                                                                const params: any = {
                                                                    type: 'ERC20',
                                                                    options: {
                                                                        address: address,
                                                                        symbol: 'SUSHI',
                                                                        decimals: 18,
                                                                        image:
                                                                            'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png'
                                                                    }
                                                                }

                                                                if (
                                                                    library &&
                                                                    library.provider.isMetaMask &&
                                                                    library.provider.request
                                                                ) {
                                                                    library.provider
                                                                        .request({
                                                                            method: 'wallet_watchAsset',
                                                                            params
                                                                        })
                                                                        .then(success => {
                                                                            if (success) {
                                                                                console.log(
                                                                                    'Successfully added SUSHI to MetaMask'
                                                                                )
                                                                            } else {
                                                                                throw new Error('Something went wrong.')
                                                                            }
                                                                        })
                                                                        .catch(console.error)
                                                                }
                                                            }}
                                                        >
                                                            <Image
                                                                src="/images/tokens/sushi-square.jpg"
                                                                alt="SUSHI"
                                                                width="38px"
                                                                height="38px"
                                                                objectFit="contain"
                                                                className="rounded-md"
                                                            />
                                                        </div>
                                                    </QuestionHelper>
                                                </>
                                            )}

                                        {library && library.provider.isMetaMask && (
                                            <div className="hidden sm:inline-block">
                                                <Web3Network />
                                            </div>
                                        )}

                                        <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                                            {account && chainId && userEthBalance && (
                                                <>
                                                    <div className="px-3 py-2 text-primary text-bold">
                                                        {userEthBalance?.toSignificant(4)}{' '}
                                                        {Currency.getNativeCurrencySymbol(chainId)}
                                                    </div>
                                                </>
                                            )}
                                            <Web3Status />
                                        </div>
                                        <LanguageSwitch />
                                        <More />
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
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
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

                                {chainId && [ChainId.MAINNET, ChainId.MATIC].includes(chainId) && (
                                    <Link href={'/farm'}>
                                        <a
                                            id={`yield-nav-link`}
                                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                        >
                                            {' '}
                                            {i18n._(t`Farm`)}
                                        </a>
                                    </Link>
                                )}
                                {chainId &&
                                    [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(chainId) && (
                                        <Link href={'/lend'}>
                                            <a id={`kashi-nav-link`}>{i18n._(t`Kashi Lending`)}</a>
                                        </Link>
                                    )}
                                {chainId &&
                                    [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(chainId) && (
                                        <Link href={'/bentobox'}>
                                            <a
                                                id={`bento-nav-link`}
                                                className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                            >
                                                {i18n._(t`BentoBox`)}
                                            </a>
                                        </Link>
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
                                {chainId === ChainId.MAINNET && (
                                    <Link href={'/vesting'}>
                                        <a
                                            id={`vesting-nav-link`}
                                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                        >
                                            {i18n._(t`Vesting`)}
                                        </a>
                                    </Link>
                                )}
                                {chainId &&
                                    [
                                        ChainId.MAINNET,
                                        ChainId.BSC,
                                        ChainId.XDAI,
                                        ChainId.FANTOM,
                                        ChainId.MATIC
                                    ].includes(chainId) && (
                                        <ExternalLink
                                            id={`analytics-nav-link`}
                                            href={ANALYTICS_URL[chainId] || 'https://analytics.sushi.com'}
                                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                        >
                                            {i18n._(t`Analytics`)}
                                        </ExternalLink>
                                    )}
                            </div>
                        </Popover.Panel>
                    </>
                )}
            </Popover>
        </header>
    )
}

export default AppBar
