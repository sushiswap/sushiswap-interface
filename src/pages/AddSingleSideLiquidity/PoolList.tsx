import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { Text } from 'rebass'

import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimaryNormal, ButtonSecondary, ButtonEmpty } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { LightCard } from '../../components/Card'
import DoubleCurrencyLogo from '../../components/DoubleLogo'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const StyledPositionCard = styled(LightCard)`
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  /* background: ${({ theme }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, theme.bg3)} 0%, ${theme.bg3} 100%) `}; */
  position: relative;
  overflow: hidden;
  margin: 6px 0; 
`

const PoolList = () => {
  console.log('rendering')
  const theme = useContext(ThemeContext)
  const mockData = [
    {
      poolName: 'ETH-WEENUS',
      poolAddress: '0x37f4d05b879c364187caa02678ba041f7b5f5c71',
      asset0: {
        address: '0x37f4d05b879c364187caa02678ba041f7b5f5c71',
        symbol: 'ETH',
        decimals: 18,
        getSymbol: () => '',
        getName: () => ''
      },
      asset1: {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'WBTC',
        decimals: 18,
        getSymbol: () => '',
        getName: () => ''
      }
    },
    {
      poolName: 'ETH-UNI',
      poolAddress: '0x4fc5a04948935f850ef3504bf69b2672f5b4bdc6',
      asset0: {
        address: '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5',
        symbol: 'WETH',
        decimals: 18,
        getSymbol: () => 'WETH',
        getName: () => 'Wrapped Ether'
      },
      asset1: {
        address: '0x71d82eb6a5051cff99582f4cdf2ae9cd402a4882',
        symbol: 'UNI',
        decimals: 18,
        getSymbol: () => 'UNI',
        getName: () => 'Uniswap'
      }
    }
  ]

  return (
    <PageWrapper>
      <Text>Select a pool to zap into</Text>
      {mockData.map(pool => {
        return (
          <StyledPositionCard>
            <AutoColumn gap="12px">
              <FixedHeightRow>
                <RowFixed>
                  <Text fontWeight={500} fontSize={16}>
                    {pool.poolName}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={pool.asset0} currency1={pool.asset1} margin={true} size={20} />
                </RowFixed>
                <RowFixed>
                  <ButtonEmpty
                    padding="6px 8px"
                    borderRadius="20px"
                    width="fit-content"
                    as={Link}
                    to={`/zap/${pool.poolAddress}/ETH`}
                  >
                    Add Liquidity
                  </ButtonEmpty>
                </RowFixed>
              </FixedHeightRow>
            </AutoColumn>
          </StyledPositionCard>
        )
      })}
    </PageWrapper>
  )
}

export default PoolList
