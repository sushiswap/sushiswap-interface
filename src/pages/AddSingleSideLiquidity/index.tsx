import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@sushiswap/sdk'
import React, { useContext, useMemo, useCallback } from 'react'
import { Link, useParams, RouteComponentProps } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { Text } from 'rebass'
import { ArrowLeft } from 'react-feather'
import { useDispatch } from 'react-redux'

import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimaryNormal, ButtonSecondary, ButtonEmpty } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { LightCard } from '../../components/Card'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import Settings from '../../components/Settings'
import PoolList from './PoolList';

import { AppDispatch } from 'state'
import { useCurrency } from '../../hooks/Tokens'
import { Field, resetZapState } from '../../state/zap/actions'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from '../../state/zap/hooks'

import { TYPE } from '../../theme'
import { currencyId as getCurrencyId } from '../../utils/currencyId'
import AppBody from 'pages/AppBody'
import { maxAmountSpend } from 'utils/maxAmountSpend'


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

const StyledZapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`

const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`

const PoolAllocationWrapper = styled.div`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 4px;
  padding: 1rem
`

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

const ZapHeader = () => (
  <StyledZapHeader>
    <RowBetween>
      <Settings />
    </RowBetween>
  </StyledZapHeader>
)

const PoolInfo = () => {
  const currency0 = useCurrency('ETH')
  const currency1 = useCurrency('0x6B175474E89094C44Da98b954EedeAC495271d0F')

  return (
    <PoolAllocationWrapper>
      <RowBetween style={{ marginBottom: '12px' }}>
        <TYPE.darkGray fontSize="14px">To</TYPE.darkGray>
        <DoubleCurrencyLogo 
          currency0={currency0 ?? undefined} currency1={currency1 ?? undefined}
          margin={false} 
          size={20}
        />
      </RowBetween>
      <RowBetween>
        <TYPE.white fontWeight={500} fontSize="22px">0</TYPE.white>
        <TYPE.white fontWeight={500} fontSize="22px">DAI/ETH</TYPE.white>
      </RowBetween>
    </PoolAllocationWrapper>
  )
}

const CardHeader = () => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
        <Link
          to="/zap"
          onClick={() => {
            dispatch(resetZapState())
          }}
        >
          <StyledArrowLeft />
        </Link>
        <TYPE.white fontWeight={500} fontSize="22px">Zap Liquidity</TYPE.white>
        <Settings />
      </RowBetween>
    </Tabs>
  )
}

const AddSingleSideLiquidity = ({ 
  match: { 
    params: { poolAddress, currencyId }
  },
  history
}: RouteComponentProps<{ poolAddress?: string; currencyId?: string }>) => {
  const theme = useContext(ThemeContext)
  // const { account, chainId, library } = useActiveWeb3React()

  const currency = useCurrency(currencyId)
  const { onFieldInput } = useZapActionHandlers(false)
  const { currencyBalance, noLiquidity, parsedAmount } = useDerivedZapInfo(currency ?? undefined, undefined)
  const formattedAmount = parsedAmount?.toSignificant(6);


  // get formatted amounts
  // const formattedAmounts = {
  //   [independentField]: typedValue,
  //   [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  // }
  // const formattedAmount = noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyId = getCurrencyId(currencyA)
      console.log(poolAddress, 'here is the pool Address')
      history.push(`/zap/${poolAddress}/${newCurrencyId}`)
    },
    [history, poolAddress]
  )


  return (
    <>
      { !poolAddress ? (
        <PoolList />
      ) : (
        <AppBody>
          {/* <ZapHeader /> */}
          <CardHeader />
          <Wrapper>
            <AutoColumn>
              <CurrencyInputPanel
                  label={'From'}
                  showMaxButton={true}
                  onMax={() => {
                    onFieldInput(maxAmountSpend(currencyBalance)?.toExact() ?? '') 
                  }}
                  value={formattedAmount ?? '0'}
                  currency={currency}
                  onUserInput={onFieldInput}
                  onCurrencySelect={handleCurrencyASelect}
                  id="swap-currency-input"
                  cornerRadiusBottomNone={false}
              />
              <PoolInfo />
            </AutoColumn>
          </Wrapper>
        </AppBody>
      )}
    </>
  )
}

export default AddSingleSideLiquidity