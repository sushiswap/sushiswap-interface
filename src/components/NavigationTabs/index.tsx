import { darken } from 'polished'
import React from 'react'
import { ArrowLeft } from 'react-feather'
import { t } from '@lingui/macro'
import { useDispatch } from 'react-redux'
import { Link as HistoryLink, NavLink } from 'react-router-dom'
import { AppDispatch } from 'state'
import { resetMintState } from 'state/mint/actions'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import Settings from '../Settings'
import { useLingui } from '@lingui/react'

const Tabs = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    border-radius: 3rem;
    justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
    activeClassName
})`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    justify-content: center;
    height: 3rem;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: ${({ theme }) => theme.text3};
    font-size: 20px;

    &.${activeClassName} {
        border-radius: ${({ theme }) => theme.borderRadius};
        font-weight: 500;
        color: ${({ theme }) => theme.text1};
    }

    :hover,
    :focus {
        color: ${({ theme }) => darken(0.1, theme.text1)};
    }
`

const ActiveText = styled.div`
    font-weight: 500;
    font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
    color: ${({ theme }) => theme.text1};
`

// This seems to be legacy code, should we remove this? Notice the display: 'none'
export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
    const { i18n } = useLingui()

    return (
        <Tabs style={{ marginBottom: '20px', display: 'none' }}>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
                {i18n._(t`Swap`)}
            </StyledNavLink>
            <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
                {i18n._(t`Pool`)}
            </StyledNavLink>
        </Tabs>
    )
}

export function FindPoolTabs() {
    const { i18n } = useLingui()

    return (
        <Tabs>
            <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
                <HistoryLink to="/pool">
                    <StyledArrowLeft />
                </HistoryLink>
                <ActiveText>{i18n._(t`Import Pool`)}</ActiveText>
                <Settings />
            </RowBetween>
        </Tabs>
    )
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
    const { i18n } = useLingui()

    // reset states on back
    const dispatch = useDispatch<AppDispatch>()

    return (
        <Tabs>
            <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
                <HistoryLink
                    to="/pool"
                    onClick={() => {
                        adding && dispatch(resetMintState())
                    }}
                >
                    <StyledArrowLeft />
                </HistoryLink>
                <ActiveText>
                    {creating
                        ? i18n._(t`Create a pair`)
                        : adding
                        ? i18n._(t`Add Liquidity`)
                        : i18n._(t`Remove Liquidity`)}
                </ActiveText>
                <Settings />
            </RowBetween>
        </Tabs>
    )
}
