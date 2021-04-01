import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'

import { useHistory } from 'react-router-dom'

import { TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { BaseCard, OutlineCard } from '../../components/Card'
import { CardSection, DataCard } from '../../components/earn/styled'
import { transparentize } from 'polished'

import { useActiveWeb3React } from '../../hooks'
import Web3Status from 'components/Web3Status'

import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'
import { ChevronLeft } from 'react-feather'

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

const BentoUpdates = () => {
  const history = useHistory()
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  return (
    <>
      <PageWrapper>
        <AutoColumn gap="md" justify="center">
          <AutoColumn gap="md" style={{ width: '100%' }}>
            <div className="px-6 md:px-4 flex justify-between pb-2 items-center">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (history.length < 3) {
                      history.push('/bento')
                    } else {
                      history.goBack()
                    }
                  }}
                  className="mr-4 p-2 rounded-full"
                  style={{ background: theme.baseCard }}
                >
                  <ChevronLeft strokeWidth={2} size={24} />
                </button>
                <div className="text-2xl font-semibold">
                  <div className="hidden md:block">BentoBox Updates</div>
                </div>
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
            {/* List of Apps */}
            <StyledBaseCard>{'Alpha release of Kashi and BentoBox on Sushi Staging'}</StyledBaseCard>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default BentoUpdates
