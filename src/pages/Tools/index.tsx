import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import { ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimaryNormal, ButtonSecondary, ButtonEmpty } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { CardSection, DataCard } from '../../components/earn/styled'
import { transparentize } from 'polished'

import { LightCard } from '../../components/Card'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
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
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  /* background: ${({ theme }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, theme.bg3)} 0%, ${theme.bg3} 100%) `}; */
  position: relative;
  overflow: hidden;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <VoteCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600} color={theme.text1}>
                  Helpful Sushi Tools
                </TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14} color={theme.text2}>
                  {`Use any tool below to optimize your workflow. Please note, some tools are experimental so use with discretion. If theres a smart contract involved for the tool, read the code and confirm the keys have been burned.`}
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </VoteCard>

        <AutoColumn gap="md" justify="center">
          <AutoColumn gap="md" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem', marginBottom: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>Tools</TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveExternalLink href={''}>
                  <ButtonSecondary padding="6px 8px" borderRadius="20px">
                    Request Tool
                  </ButtonSecondary>
                </ResponsiveExternalLink>
                <ResponsiveExternalLink href={''}>
                  <ButtonPrimaryNormal padding="6px 8px" borderRadius="20px">
                    <Text fontWeight={500} fontSize={16}>
                      Submit Tool
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
                      One click SUSHI → xSUSHI → aXSUSHI
                    </Text>
                  </RowFixed>
                  <RowFixed>
                    <ButtonEmpty padding="6px 8px" borderRadius="20px" width="fit-content" as={Link} to={`/saave`}>
                      Manage
                    </ButtonEmpty>
                  </RowFixed>
                </FixedHeightRow>
              </AutoColumn>
            </StyledPositionCard>
            <StyledPositionCard>
              <AutoColumn gap="12px">
                <FixedHeightRow>
                  <RowFixed>
                    <Text fontWeight={500} fontSize={16}>
                      LP ZAP
                    </Text>
                  </RowFixed>
                </FixedHeightRow>
                <FixedHeightRow>
                  <RowFixed>
                    {/* <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} /> */}
                    <Text fontWeight={500} fontSize={14}>
                      Zap into an LP position for any pool using any asset
                    </Text>
                  </RowFixed>
                  <RowFixed>
                    <ButtonEmpty padding="6px 8px" borderRadius="20px" width="fit-content" as={Link} to={`/zap`}>
                      Manage
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
