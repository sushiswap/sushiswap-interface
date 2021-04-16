import { ChainId, Currency } from '@sushiswap/sdk'
import { darken } from 'polished'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '../../assets/images/logo.png'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { ExternalLink } from '../../theme'
import Web3Status from '../Web3Status'
import Mainnet from '../../assets/networks/mainnet-network.jpg'

import { ReactComponent as Burger } from '../../assets/images/burger.svg'
import { ReactComponent as Chef } from '../../assets/images/chef.svg'
import Web3Network from 'components/Web3Network'

const HeaderFrame = styled.div`
    display: grid;
    grid-template-columns: 1fr 120px;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    top: 0;
    position: relative;
    padding: 1rem;
    z-index: 2;
    ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    width: calc(100%);
    position: relative;
    padding: 0.75rem;
    padding-bottom: calc(0.75rem - 1px);
  `};
    padding-bottom: calc(1rem - 1px);
    background: linear-gradient(to right, rgba(39, 176, 230, 0.2) 0%, rgba(250, 82, 160, 0.2) 100%) left bottom
        no-repeat;
    background-size: 100% 1px;
`

const HeaderControls = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-self: flex-end;

    ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    // z-index: 99;
    height: 72px;

    background-color: ${({ theme }) => theme.bg1};
  `};

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 5px;
  `}
`

// const HeaderElement = styled.div`
//     display: flex;
//     align-items: center;

//     /* addresses safari's lack of support for "gap" */
//     & > *:not(:first-child) {
//         margin-left: 8px;
//     }

//     ${({ theme }) => theme.mediaWidth.upToMedium`
//     flex-direction: row-reverse;
//     align-items: center;

//     & > *:not(:first-child) {
//       margin-left: 4px;
//     }
//   `};
// `

const AccountElement = styled.div<{ active: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
    border-radius: ${({ theme }) => theme.borderRadius};
    white-space: nowrap;
    width: 100%;
    cursor: pointer;

    :focus {
        border: 1px solid blue;
    }
`

const HideSmall = styled.span`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
    activeClassName
})`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: left;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
    font-size: 1rem;
    width: fit-content;
    margin: 0 12px;

    font-weight: 500;

    &.${activeClassName} {
        border-radius: ${({ theme }) => theme.borderRadius};
        font-weight: 600;
        color: ${({ theme }) => theme.text1};
    }

    :hover,
    :focus {
        color: ${({ theme }) => darken(0.1, theme.text1)};
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 8px;
  `};
`

const StyledExternalLink = styled(ExternalLink).attrs({
    activeClassName
})<{ isActive?: boolean }>`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: left;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
    font-size: 1rem;
    width: fit-content;
    margin: 0 12px;
    font-weight: 500;

    &.${activeClassName} {
        border-radius: ${({ theme }) => theme.borderRadius};
        font-weight: 600;
        color: ${({ theme }) => theme.text1};
    }

    :hover,
    :focus {
        color: ${({ theme }) => darken(0.1, theme.text1)};
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
    [ChainId.RINKEBY]: 'Rinkeby',
    [ChainId.ROPSTEN]: 'Ropsten',
    [ChainId.GÖRLI]: 'Görli',
    [ChainId.KOVAN]: 'Kovan',
    [ChainId.FANTOM]: 'Fantom',
    [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
    [ChainId.MATIC]: 'Matic',
    [ChainId.MATIC_TESTNET]: 'Matic Testnet',
    [ChainId.XDAI]: 'xDai',
    [ChainId.BSC]: 'BSC',
    [ChainId.BSC_TESTNET]: 'BSC Testnet',
    [ChainId.MOONBASE]: 'Moonbase',
    [ChainId.AVALANCHE]: 'Avalanche',
    [ChainId.FUJI]: 'Fuji',
    [ChainId.HECO]: 'HECO',
    [ChainId.HECO_TESTNET]: 'HECO Testnet',
    [ChainId.HARMONY]: 'Harmony',
    [ChainId.HARMONY_TESTNET]: 'Harmony Testnet'
}

export default function Header() {
    const { account, chainId } = useActiveWeb3React()
    const { t } = useTranslation()
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    return (
        <HeaderFrame>
            <div className="flex justify-between items-center sm:justify-start w-full">
                <img width={'40px'} src={Logo} alt="logo" className="mr-4" />
                <div className="hidden sm:flex justify-end md:justify-center">
                    <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                        {t('swap')}
                    </StyledNavLink>
                    <StyledNavLink
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
                    </StyledNavLink>
                    {chainId === ChainId.MAINNET && (
                        <StyledNavLink id={`yield-nav-link`} to={'/yield'}>
                            Yield
                        </StyledNavLink>
                    )}
                    {chainId === ChainId.MAINNET && (
                        <StyledNavLink id={`stake-nav-link`} to={'/stake'}>
                            Stake
                        </StyledNavLink>
                    )}
                    {chainId === ChainId.MAINNET && (
                        <HideSmall>
                            <StyledNavLink id={`vesting-nav-link`} to={'/vesting'}>
                                Vesting
                            </StyledNavLink>
                        </HideSmall>
                    )}
                    {[ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC].indexOf(chainId || 1) != -1 && (
                        <StyledNavLink id={`bento-nav-link`} to={'/bento'}>
                            Apps
                        </StyledNavLink>
                    )}
                    {chainId && (
                        <StyledExternalLink id={`analytics-nav-link`} href={'https://analytics.sushi.com'}>
                            Analytics <span style={{ fontSize: '11px' }}>↗</span>
                        </StyledExternalLink>
                    )}
                </div>
                <div className="sm:hidden p-2 text-primary hover:text-high-emphesis cursor-pointer">
                    <Burger title="Burger" className="w-5 h-5 fill-current" />
                </div>
            </div>
            <HeaderControls>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 text-sm font-bold cursor-pointer select-none pointer-events-auto">
                        <Web3Network />
                    </div>
                    <div className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                        {account && chainId && userEthBalance && (
                            <>
                                <div className="py-2 px-3 text-primary text-bold">
                                    {userEthBalance?.toSignificant(4)} {Currency.getNativeCurrencySymbol(chainId)}
                                </div>
                                <Web3Status />
                            </>
                        )}
                    </div>
                </div>
            </HeaderControls>
        </HeaderFrame>
    )
}
