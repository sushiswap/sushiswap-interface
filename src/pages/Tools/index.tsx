import { transparentize } from 'polished'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonEmpty, ButtonPrimaryNormal, ButtonSecondary } from '../../components/ButtonLegacy'
import { LightCard } from '../../components/CardLegacy'
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RowBetween, RowFixed } from '../../components/Row'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ExternalLink, HideSmall, TYPE } from '../../theme'
import { Helmet } from 'react-helmet'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

const PageWrapper = styled(AutoColumn)`
    max-width: 640px;
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
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
    gap: 8px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveExternalLink = styled(ExternalLink)`
    width: fit-content;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const StyledPositionCard = styled(LightCard)`
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  border: none;
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  /* background: ${({ theme }) =>
      `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, theme.bg3)} 0%, ${theme.bg3} 100%) `}; */
  position: relative;
  overflow: hidden;
`

export default function Pool() {
    const { i18n } = useLingui()
    const theme = useContext(ThemeContext)
    const { account } = useActiveWeb3React()

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Tools`)} | Sushi</title>
            </Helmet>
            <PageWrapper>
                <SwapPoolTabs active={'pool'} />
                <VoteCard>
                    <CardSection>
                        <AutoColumn gap="md">
                            <RowBetween>
                                <TYPE.white fontWeight={600} color={theme.text1}>
                                    {i18n._(t`Helpful Sushi Tools`)}
                                </TYPE.white>
                            </RowBetween>
                            <RowBetween>
                                <TYPE.white fontSize={14} color={theme.text2}>
                                    {i18n._(
                                        t`Use any tool below to optimize your workflow. Please note, some tools are experimental so use with discretion. If theres a smart contract involved for the tool, read the code and confirm the keys have been burned.`
                                    )}
                                </TYPE.white>
                            </RowBetween>
                        </AutoColumn>
                    </CardSection>
                </VoteCard>

                <AutoColumn gap="md" justify="center">
                    <AutoColumn gap="md" style={{ width: '100%' }}>
                        <TitleRow style={{ marginTop: '1rem', marginBottom: '1rem' }} padding={'0'}>
                            <HideSmall>
                                <TYPE.mediumHeader
                                    style={{ marginTop: '0.5rem', justifySelf: 'flex-start', paddingLeft: '0.75rem' }}
                                >
                                    {i18n._(t`Tools`)}
                                </TYPE.mediumHeader>
                            </HideSmall>
                            <ButtonRow>
                                <ResponsiveExternalLink href={''}>
                                    <ButtonSecondary padding="6px 8px" borderRadius="20px">
                                        {i18n._(t`Request Tool`)}
                                    </ButtonSecondary>
                                </ResponsiveExternalLink>
                                <ResponsiveExternalLink href={''}>
                                    <ButtonPrimaryNormal padding="6px 8px" borderRadius="10px">
                                        <Text fontWeight={500} fontSize={16}>
                                            {i18n._(t`Submit Tool`)}
                                        </Text>
                                    </ButtonPrimaryNormal>
                                </ResponsiveExternalLink>
                            </ButtonRow>
                        </TitleRow>
                        {/* List of Tools */}
                        <StyledPositionCard>
                            <AutoColumn gap="12px">
                                <FixedHeightRow>
                                    <RowFixed>
                                        <Text fontWeight={500} fontSize={16}>
                                            SAAVE
                                        </Text>
                                    </RowFixed>
                                </FixedHeightRow>
                                <FixedHeightRow>
                                    <RowFixed>
                                        {/* <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} /> */}
                                        <Text fontWeight={500} fontSize={14}>
                                            {i18n._(t`One click SUSHI → xSUSHI → aXSUSHI`)}
                                        </Text>
                                    </RowFixed>
                                    <RowFixed>
                                        <ButtonEmpty
                                            padding="6px 8px"
                                            borderRadius="20px"
                                            width="fit-content"
                                            as={Link}
                                            to={`/saave`}
                                        >
                                            {i18n._(t`Manage`)}
                                        </ButtonEmpty>
                                    </RowFixed>
                                </FixedHeightRow>
                            </AutoColumn>
                        </StyledPositionCard>
                    </AutoColumn>
                </AutoColumn>
            </PageWrapper>
        </>
    )
}
