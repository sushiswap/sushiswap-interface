import { transparentize } from 'polished'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { Wrapper } from '../../components/swap/styleds'
import { useDarkModeManager } from '../../state/user/hooks'
import { ExternalLink, TYPE } from '../../theme'
import AXSushiBalancePanel from './AXSushiBalancePanel'
import SaaveHeader from './SaaveHeader'
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

export default function Saave() {
    const { i18n } = useLingui()
    const theme = useContext(ThemeContext)
    const darkMode = useDarkModeManager()

    return (
        <>
            <Helmet>
                <title>Saave | Sushi</title>
                <meta name="description" content="Migrate SUSHI -> xSUSHI -> axSUSHI" />
            </Helmet>
            <PageWrapper>
                <VoteCard>
                    <CardSection>
                        <AutoColumn gap="md">
                            <RowBetween>
                                <TYPE.white fontWeight={600} color={theme.text1}>
                                    {i18n._(t`SAAVE: Stack your yields in one transaction`)}
                                </TYPE.white>
                            </RowBetween>
                            <RowBetween>
                                <TYPE.white fontSize={14} color={theme.text2}>
                                    {i18n._(
                                        t`Stake your SUSHI into xSUSHI for ~5% APY. Deposit your xSUSHI into Aave as aXSUSHI to earn collateral interest and borrowing power. All in one click.`
                                    )}
                                </TYPE.white>
                            </RowBetween>
                            <ExternalLink
                                style={{ color: `${darkMode ? 'white' : 'black'}`, textDecoration: 'underline' }}
                                target="_blank"
                                href="https://app.ens.domains/name/saave.eth"
                            >
                                <TYPE.white fontSize={14} color={theme.text1}>
                                    {i18n._(t`Keys Burned: 2022.03.04 at 22:05`)}
                                </TYPE.white>
                            </ExternalLink>
                            <ExternalLink
                                style={{ color: `${darkMode ? 'white' : 'black'}`, textDecoration: 'underline' }}
                                target="_blank"
                                href="https://etherscan.io/address/0x364762c00b32c4b448f39efaa9cefc67a25603ff#code"
                            >
                                <TYPE.white fontSize={14} color={theme.text1}>
                                    {i18n._(t`Read the contract`)}
                                </TYPE.white>
                            </ExternalLink>
                            <RowBetween>
                                <TYPE.white fontSize={14} color={theme.text2}>
                                    {i18n._(
                                        t`To withdraw into SUSHI, go to Aave and remove axSUSHI as collateral and then to SushiBar to unstake. A full unwind will be avaialble soon.`
                                    )}
                                </TYPE.white>
                            </RowBetween>
                        </AutoColumn>
                    </CardSection>
                </VoteCard>
                <div className="relative w-full max-w-lg rounded bg-dark-900">
                    <SaaveHeader />
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
                            <AXSushiBalancePanel
                                label={'aXSUSHI Balance'}
                                disableCurrencySelect={true}
                                id="ax-token-balance"
                                cornerRadiusTopNone={true}
                            />
                        </AutoColumn>
                    </Wrapper>
                </div>
            </PageWrapper>
        </>
    )
}
