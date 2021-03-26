import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'

import { TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { BaseCard, OutlineCard } from '../../components/Card'
import { CardSection, DataCard } from '../../components/earn/styled'
import { transparentize } from 'polished'

import KashiCard from './KashiCard'

import { useActiveWeb3React } from '../../hooks'
import Web3Status from 'components/Web3Status'

import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

// max-width: 640px;
const PageWrapper = styled(AutoColumn)`
  max-width: 500px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  overflow: hidden;
`

const StyledBaseCard = styled(BaseCard)`
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
`

export default function Bento() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  return (
    <>
      <PageWrapper>
        <AutoColumn gap="md" justify="center">
          <AutoColumn gap="md" style={{ width: '100%' }}>
            <div className="px-6 md:px-4 flex justify-between pb-2 items-center">
              <div className="text-2xl font-semibold">
                <div className="hidden md:block">BentoBox Apps</div>
              </div>
              {account ? (
                <Link to="/bento/balances" className="inline-block flex float-right text-right items-center">
                  <img src={BentoBoxLogo} className="block w-10 mr-2" />
                  <div className="font-normal">My Bento</div>
                </Link>
              ) : (
                <div>Connect Wallet</div>
              )}
            </div>
            <div className="px-4 pb-2 md:px-0 md:pb-4">
              <VoteCard>
                <CardSection>
                  <AutoColumn gap="md">
                    <RowBetween>
                      <TYPE.white fontSize={14} color={theme.highEmphesisText}>
                        {`BentoBox is a revolutionary new way from SUSHI to interact with dapps on L1 in a highly gas efficient manner. In order to use any one of the decentralized apps below you'll need to first enable them and deposit any ERC20 asset to your BentoBox balance.`}
                      </TYPE.white>
                    </RowBetween>
                  </AutoColumn>
                </CardSection>
              </VoteCard>
            </div>
            {/* List of Apps */}
            <StyledBaseCard style={{ minHeight: '20rem' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <KashiCard />
                <OutlineCard minHeight="14rem" height="100%" />
                <div className="hidden sm:block">
                  <OutlineCard height="10rem" />
                </div>
                <div className="hidden sm:block">
                  <OutlineCard height="10rem" />
                </div>
              </div>
            </StyledBaseCard>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
