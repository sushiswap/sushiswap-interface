import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

//import { WrapperNoPadding } from '../../components/swap/styleds'
//import { useDarkModeManager } from '../../state/user/hooks'
import AppBody from '../AppBody'
import SaaveHeader from './SushiBarHeader'
import { Wrapper } from '../../components/swap/styleds'

import SushiDepositPanel from './SushiDepositPanel'
import XSushiWithdrawlPanel from './XSushiWithdrawlPanel'

import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { TYPE, ExternalLink } from '../../theme'
import { transparentize } from 'polished'

import { useActiveWeb3React } from '../../hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 420px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  overflow: hidden;
  margin-bottom: 10px;
`

export default function Saave() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  //const darkMode = useDarkModeManager()

  return (
    <>
      <PageWrapper>
        <div style={{ padding: '16px' }}>
          <VoteCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600} color={theme.text1}>
                    SushiBar: Make SUSHI work for you
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <div>
                    <TYPE.white fontSize={14} color={theme.text2} style={{ paddingBottom: '10px' }}>
                      {`Stake your SUSHI into xSUSHI for ~15% APY. No impermanent loss, no loss of governance rights. Continuously compounding.`}
                    </TYPE.white>
                    <TYPE.white fontSize={14} color={theme.text2} style={{ paddingBottom: '10px' }}>
                      {`xSUSHI automatically earn fees (0.05% of all swaps, including multichain swaps) proportional to your share of the SushiBar.`}
                    </TYPE.white>
                  </div>
                </RowBetween>
                <ExternalLink
                  style={{ color: 'white', textDecoration: 'underline' }}
                  target="_blank"
                  href="https://analytics.sushi.com/bar"
                >
                  <TYPE.white fontSize={14} color={theme.text1}>
                    View SushiBar Stats <span style={{ fontSize: '11px' }}>↗</span>
                  </TYPE.white>
                </ExternalLink>
                {account && (
                  <ExternalLink
                    style={{ color: 'white', textDecoration: 'underline' }}
                    target="_blank"
                    href={'http://analytics.sushi.com/users/' + account}
                  >
                    <TYPE.white fontSize={14} color={theme.text1}>
                      View your SushiBar Portfolio <span style={{ fontSize: '11px' }}>↗</span>
                    </TYPE.white>
                  </ExternalLink>
                )}
              </AutoColumn>
            </CardSection>
          </VoteCard>
        </div>
        <AppBody>
          <SaaveHeader />
          <Wrapper id="swap-page">
            <AutoColumn style={{ paddingBottom: '10px' }}>
              <SushiDepositPanel
                label={''}
                disableCurrencySelect={true}
                customBalanceText={'Available to deposit: '}
                id="stake-liquidity-token"
                buttonText="Deposit"
                cornerRadiusBottomNone={true}
              />
              <XSushiWithdrawlPanel
                label={''}
                disableCurrencySelect={true}
                customBalanceText={'Available to withdraw: '}
                id="withdraw-liquidity-token"
                buttonText="Withdraw"
                cornerRadiusTopNone={true}
              />
            </AutoColumn>
          </Wrapper>
        </AppBody>
      </PageWrapper>
    </>
  )
}
