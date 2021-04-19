import { ChainId, Currency } from '@sushiswap/sdk'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Logo from '../../assets/images/logo.png'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { ReactComponent as Burger } from '../../assets/images/burger.svg'
import { ReactComponent as Chef } from '../../assets/images/chef.svg'
import Sushi from '../../assets/kashi/tokens/sushi-square.jpg'
import xSushi from '../../assets/kashi/tokens/xsushi-square.jpg'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'

import { ExternalLink, NavLink } from '../Link'

export default function Header(): JSX.Element {
    const { account, chainId, library } = useActiveWeb3React()
    const { t } = useTranslation()
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 w-screen relative p-4 flex-row gradiant-border-bottom z-10">
            <div className="flex justify-between items-center lg:justify-start">
                <img width={'32px'} src={Logo} alt="logo" className="mr-4" />
                <div className="hidden sm:flex">
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
                <div className="sm:hidden p-2 text-primary hover:text-high-emphesis cursor-pointer">
                    <Burger title="Burger" className="w-5 h-5 fill-current" />
                </div>
            </div>
            <div className="flex flex-row items-center justify-center w-full p-4 gradiant-border-top fixed left-0 bottom-0 lg:relative lg:p-0 lg:bg-none">
                <div className="flex items-center justify-around sm:justify-end space-x-2 w-full">
                    {chainId && chainId === ChainId.MAINNET && (
                        <>
                            <div
                                className="rounded-md bg-dark-900 hover:bg-dark-800 p-0.5 cursor-pointer"
                                onClick={() => {
                                    const params: any = {
                                        type: 'ERC20',
                                        options: {
                                            address: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
                                            symbol: 'XSUSHI',
                                            decimals: 18,
                                            image:
                                                'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272/logo.png'
                                        }
                                    }

                                    if (library && library.provider.isMetaMask && library.provider.request) {
                                        library.provider
                                            .request({
                                                method: 'wallet_watchAsset',
                                                params
                                            })
                                            .then(success => {
                                                if (success) {
                                                    console.log('Successfully added XSUSHI to MetaMask')
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
                                    style={{ minWidth: 36, minHeight: 36, maxWidth: 36, maxHeight: 36 }}
                                    className="rounded-md object-contain"
                                />
                            </div>
                            <div
                                className="rounded-md bg-dark-900 hover:bg-dark-800 p-0.5 cursor-pointer"
                                onClick={() => {
                                    const params: any = {
                                        type: 'ERC20',
                                        options: {
                                            address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
                                            symbol: 'SUSHI',
                                            decimals: 18,
                                            image:
                                                'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png'
                                        }
                                    }

                                    if (library && library.provider.isMetaMask && library.provider.request) {
                                        library.provider
                                            .request({
                                                method: 'wallet_watchAsset',
                                                params
                                            })
                                            .then(success => {
                                                if (success) {
                                                    console.log('Successfully added SUSHI to MetaMask')
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
                                    style={{ minWidth: 36, minHeight: 36, maxWidth: 36, maxHeight: 36 }}
                                    className="rounded-md object-contain"
                                />
                            </div>
                        </>
                    )}
                    <Web3Network />
                    <div className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                        {account && chainId && userEthBalance && (
                            <>
                                <div className="py-2 px-3 text-primary text-bold">
                                    {userEthBalance?.toSignificant(4)} {Currency.getNativeCurrencySymbol(chainId)}
                                </div>
                            </>
                        )}
                        <Web3Status />
                    </div>
                </div>
            </div>
        </div>
    )
}
