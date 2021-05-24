import { AppDispatch } from '../../state'
import { ArrowLeft } from 'react-feather'
import ExchangeHeader from '../ExchangeHeader'
import HistoryLink from 'next/link'
import NavLink from '../NavLink'
import React from 'react'
import { RowBetween } from '../Row'
import Settings from '../Settings'
import { darken } from 'polished'
import { resetMintState } from '../../state/mint/actions'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useDispatch } from 'react-redux'
import { useLingui } from '@lingui/react'

const Tabs = styled.div`
    // ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    border-radius: 3rem;
    justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
    activeClassName
})`
    // ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    justify-content: center;
    height: 3rem;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    // color: ${({ theme }) => theme.text3};
    font-size: 20px;

    &.${activeClassName} {
        // border-radius: ${({ theme }) => theme.borderRadius};
        font-weight: 500;
        // color: ${({ theme }) => theme.text1};
    }

    :hover,
    :focus {
        // color: ${({ theme }) => darken(0.1, theme.text1)};
    }
`

const ActiveText = styled.div`
    font-weight: 500;
    font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
    color: ${({ theme }) => theme.text1};
`

export function FindPoolTabs() {
    const { i18n } = useLingui()

    return (
        <Tabs>
            <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
                <HistoryLink href="/pool">
                    <a>
                        <StyledArrowLeft />
                    </a>
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
                <HistoryLink href="/pool">
                    <a
                        onClick={() => {
                            adding && dispatch(resetMintState())
                        }}
                    >
                        <StyledArrowLeft />
                    </a>
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
