import { ChainId, Currency } from '@sushiswap/sdk'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Logo from '../assets/images/logo.png'
import { useActiveWeb3React } from '../hooks'
import { useETHBalances } from '../state/wallet/hooks'
import { ReactComponent as Burger } from '../assets/images/burger.svg'
import { ReactComponent as X } from '../assets/images/x.svg'
import Sushi from '../assets/kashi/tokens/sushi-square.jpg'
import xSushi from '../assets/kashi/tokens/xsushi-square.jpg'
import Web3Network from './Web3Network'
import Web3Status from './Web3Status'
import MoreMenu from './Menu'
import { ExternalLink, NavLink } from './Link'
import { Disclosure } from '@headlessui/react'

function AppBar(): JSX.Element {
    const { account, chainId, library } = useActiveWeb3React()
    const { t } = useTranslation()

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

    return (
        <header className="flex flex-row flex-nowrap justify-between w-screen">
            <Disclosure as="nav" className="w-screen bg-transparent gradiant-border-bottom z-10">
                {({ open }) => (
                    <>
                        <div className="px-4 py-1.5">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img src={Logo} alt="Sushi" className="h-10 w-auto" />
                                    </div>
                                    <div className="hidden sm:block sm:ml-4">
                                        <div className="flex space-x-2">
                                            <NavLink id={`swap-nav-link`} to={'/swap'}>
                                                {t('swap')}
                                            </NavLink>
                                            <NavLink
                                                id={`pool-nav-link`}
                                                to={'/pool'}
                                                isActive={(match, { pathname }) =>
                                                    Boolean(match) ||
                                                    pathname.startsWith('/add') ||
                                                    pathname.startsWith('/remove') ||
                                                    pathname.startsWith('/create') ||
                                                    pathname.startsWith('/find')
                                                }
                                            >
                                                {t('pool')}
                                            </NavLink>
                                            {chainId && [ChainId.MAINNET, ChainId.MATIC].includes(chainId) && (
                                                <NavLink id={`yield-nav-link`} to={'/yield'}>
                                                    Yield
                                                </NavLink>
                                            )}
                                            {chainId === ChainId.MAINNET && (
                                                <NavLink id={`stake-nav-link`} to={'/stake'}>
                                                    Stake
                                                </NavLink>
                                            )}
                                            {chainId === ChainId.MAINNET && (
                                                <NavLink id={`vesting-nav-link`} to={'/vesting'}>
                                                    Vesting
                                                </NavLink>
                                            )}
                                            {chainId &&
                                                [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC].includes(
                                                    chainId
                                                ) && (
                                                    <NavLink id={`bento-nav-link`} to={'/bento'}>
                                                        Apps
                                                    </NavLink>
                                                )}
                                            {chainId && (
                                                <ExternalLink
                                                    id={`analytics-nav-link`}
                                                    href={'https://analytics.sushi.com'}
                                                >
                                                    Analytics
                                                </ExternalLink>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row items-center justify-center w-full p-4 fixed left-0 bottom-0 bg-dark-1000 lg:relative lg:p-0 lg:bg-transparent">
                                    <div className="flex items-center justify-between sm:justify-end space-x-2 w-full">
                                        {chainId &&
                                            chainId === ChainId.MAINNET &&
                                            library &&
                                            library.provider.isMetaMask && (
                                                <>
                                                    <div
                                                        className="hidden sm:inline-block rounded-md bg-dark-900 hover:bg-dark-800 p-0.5 cursor-pointer"
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
                                                        <img
                                                            src={xSushi}
                                                            alt="Switch Network"
                                                            style={{
                                                                minWidth: 36,
                                                                minHeight: 36,
                                                                maxWidth: 36,
                                                                maxHeight: 36
                                                            }}
                                                            className="rounded-md object-contain"
                                                        />
                                                    </div>
                                                    <div
                                                        className="hidden sm:inline-block rounded-md bg-dark-900 hover:bg-dark-800 p-0.5 cursor-pointer"
                                                        onClick={() => {
                                                            const params: any = {
                                                                type: 'ERC20',
                                                                options: {
                                                                    address:
                                                                        '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
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
                                                        <img
                                                            src={Sushi}
                                                            alt="Switch Network"
                                                            style={{
                                                                minWidth: 36,
                                                                minHeight: 36,
                                                                maxWidth: 36,
                                                                maxHeight: 36
                                                            }}
                                                            className="rounded-md object-contain"
                                                        />
                                                    </div>
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
                                                    <div className="py-2 px-3 text-primary text-bold">
                                                        {userEthBalance?.toSignificant(4)}{' '}
                                                        {Currency.getNativeCurrencySymbol(chainId)}
                                                    </div>
                                                </>
                                            )}
                                            <Web3Status />
                                        </div>
                                        <MoreMenu />
                                    </div>
                                </div>
                                <div className="-mr-2 flex sm:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <X title="Close" className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Burger title="Burger" className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                {/* <a
                                href="#"
                                className="bg-gray-1000 text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Dashboard
                            </a> */}

                                <NavLink id={`swap-nav-link`} to={'/swap'}>
                                    {t('swap')}
                                </NavLink>
                                <NavLink
                                    id={`pool-nav-link`}
                                    to={'/pool'}
                                    isActive={(match, { pathname }) =>
                                        Boolean(match) ||
                                        pathname.startsWith('/add') ||
                                        pathname.startsWith('/remove') ||
                                        pathname.startsWith('/create') ||
                                        pathname.startsWith('/find')
                                    }
                                >
                                    {t('pool')}
                                </NavLink>
                                {chainId === ChainId.MAINNET && (
                                    <NavLink id={`yield-nav-link`} to={'/yield'}>
                                        Yield
                                    </NavLink>
                                )}
                                {chainId === ChainId.MAINNET && (
                                    <NavLink id={`stake-nav-link`} to={'/stake'}>
                                        Stake
                                    </NavLink>
                                )}
                                {chainId === ChainId.MAINNET && (
                                    <NavLink id={`vesting-nav-link`} to={'/vesting'}>
                                        Vesting
                                    </NavLink>
                                )}
                                {chainId && [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC].includes(chainId) && (
                                    <NavLink id={`bento-nav-link`} to={'/bento'}>
                                        Apps
                                    </NavLink>
                                )}
                                {chainId && (
                                    <ExternalLink id={`analytics-nav-link`} href={'https://analytics.sushi.com'}>
                                        Analytics
                                    </ExternalLink>
                                )}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </header>
    )
}

export default AppBar
