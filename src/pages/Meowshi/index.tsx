import { transparentize } from 'polished'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { Wrapper } from '../../components/swap/styleds'
import { useDarkModeManager } from '../../state/user/hooks'
import { ExternalLink, TYPE } from '../../theme'
import NyanBalancePanel from './NyanBalancePanel'
import NyanHeader from './NyanHeader'
import SushiInputPanel from './SushiInputPanel'
import { Helmet } from 'react-helmet'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const PageWrapper = styled(AutoColumn)`
    max-width: 420px;
    width: 100%;
`

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
    padding: 1rem;
    z-index: 1;
    opacity: ${({ disabled }) => disabled && '0.4'};
`

export const DataCard = styled(AutoColumn)<{ disabled?: boolean }>`
    background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #0094ec 100%);
    border-radius: ${({ theme }) => theme.borderRadius};
    width: 100%;
    position: relative;
    overflow: hidden;
`

const VoteCard = styled(DataCard)`
    background: ${({ theme }) => transparentize(0.5, theme.bg1)};
    overflow: hidden;
    margin-bottom: 10px;
`

export default function Nyan() {
    const { i18n } = useLingui()
    const theme = useContext(ThemeContext)
    const darkMode = useDarkModeManager()

    return (
        <>
            <Helmet>
                <title>Meowshi | Sushi</title>
                <meta name="description" content="Migrate SUSHI -> xSUSHI -> NYAN" />
            </Helmet>
            <PageWrapper>
                <VoteCard>
                    <CardSection>
                        <AutoColumn gap="md">
                            <RowBetween>
                                <TYPE.white fontWeight={600} color={theme.text1}>
                                    {i18n._(t`NYAN: Stack your SUSHI with SushiBar & BentoBox`)}
                                </TYPE.white>
                            </RowBetween>
                            <RowBetween>
                                <TYPE.white fontSize={14} color={theme.text2}>
                                    {i18n._(
                                        t`Meowshi loves fresh fish. Meowshi NYANs and NYANs for more and more SUSHI from SushiBar and BentoBox. Chefs are happy to provide.`
                                    )}
                                </TYPE.white>
                            </RowBetween>
                            <ExternalLink
                                style={{ color: `${darkMode ? 'white' : 'black'}`, textDecoration: 'underline' }}
                                target="_blank"
                                href="https://etherscan.io/address/0xEb8B45EB9084D05b25B045Ff8fE4d18fb1248B38#code"
                            >
                                <TYPE.white fontSize={14} color={theme.text1}>
                                    {i18n._(t`Read the contract`)}
                                </TYPE.white>
                            </ExternalLink>
                        </AutoColumn>
                    </CardSection>
                </VoteCard>
                <div className="relative w-full max-w-lg rounded bg-dark-900">
                    <NyanHeader />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to deposit: '}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomNone={true}
                            />
                            <NyanBalancePanel
                                label={'NYAN Balance'}
                                disableCurrencySelect={true}
                                id="nyan-token-balance"
                                cornerRadiusTopNone={true}
                            />
                        </AutoColumn>
                    </Wrapper>
                </div>
            </PageWrapper>
        </>
    )
}
