import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@sushiswap/sdk'
import React, { useContext, useMemo, useCallback } from 'react'
import { Link, useParams, RouteComponentProps } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { Text } from 'rebass'
import { ArrowLeft, Type } from 'react-feather'
import { useDispatch } from 'react-redux'

import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { LightCard } from '../../components/Card'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import Settings from '../../components/Settings'
import PoolList from './PoolList';
import { DataCard, CardSection } from 'components/earn/styled'

import { AppDispatch } from 'state'
import { useCurrency } from '../../hooks/Tokens'
import usePool from '../../sushi-hooks/queries/usePool'
import { Field, resetZapState } from '../../state/zap/actions'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from '../../state/zap/hooks'

import { TYPE } from '../../theme'
import { currencyId as getCurrencyId } from '../../utils/currencyId'
import AppBody from 'pages/AppBody'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import useZapper from 'sushi-hooks/useZapper'


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
  border-radius: 4px 4px 0 0;
  padding: 1rem
`

const PoolBreakDownWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  border-top: 1px solid ${({ theme }) => theme.bg3};
  padding: 1rem
  border-radius: 0 0 4px 4px;
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

const PoolTokenRow = styled.span`
  display: flex;
  margin: 10px 0;
`

// @ts-ignore
const TypeDefaultCursor = ({ children, ...props }) => (
  <TYPE.white {...props} style={{ cursor: "default" }}>
    {children}
  </TYPE.white>
)

// @ts-ignore
const TypeDefaultCursorRight = ({ children, ...props }) => (
  <TYPE.white {...props} style={{ cursor: "default", textAlign: 'right', marginTop: '10px' }}>
    {children}
  </TYPE.white>
)

const InfoCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
`

const PoolInfo = (
  { poolAddress, currency }: { poolAddress: string, currency: Currency | undefined }
) => {
  const { token0, token1, totalSupply, reserves } = usePool(poolAddress)
  const { liquidityMinted, poolTokenPercentage, currencyBalance, tradeAmount, currencyZeroOutput, currencyOneOutput, estimatedSlippage } = useDerivedZapInfo(currency ?? undefined, poolAddress)
  const currency0 = useCurrency(token0)
  const currency1 = useCurrency(token1)

  return (
    <>
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
          <TYPE.subHeader fontWeight={500} fontSize="22px">
            {liquidityMinted?.toSignificant(6) || '0'}
          </TYPE.subHeader>
          <TYPE.subHeader  fontWeight={500} fontSize="22px">
            { (currency0 && currency1) &&`${currency0?.symbol}/${currency1?.symbol}`}
            </TYPE.subHeader>
        </RowBetween>
      </PoolAllocationWrapper>
      <PoolBreakDownWrapper>
        <RowBetween>
            <div>
              <TYPE.darkGray fontSize="14px">Est. Pool Allocation</TYPE.darkGray>
              <PoolTokenRow>
                <CurrencyLogo size="22px"  currency={currency0 ?? undefined} style={{ marginRight: '6px' }} />
                <TYPE.small fontSize="14px">
                  {currencyZeroOutput?.toSignificant(6) || 0} {' '}
                  {currency0?.symbol}
                </TYPE.small>
              </PoolTokenRow>
              <PoolTokenRow>
                <CurrencyLogo size="22px" currency={currency1 ?? undefined} style={{ marginRight: '6px' }} />
                <TYPE.small fontSize="14px">
                  {currencyOneOutput?.toSignificant(6) || 0} {' '}
                  {currency1?.symbol}
                </TYPE.small>
              </PoolTokenRow>
            </div>
            <div style={{ height: '91px' }}>
              <TYPE.darkGray textAlign="right" marginBottom="2px" fontSize="14px">Pool Share</TYPE.darkGray>
              <TYPE.small  marginBottom="8px" textAlign="right" fontSize="14px">{poolTokenPercentage?.toSignificant(6) || '0'}%</TYPE.small>
              <TYPE.darkGray fontSize="14px" marginBottom="2px">Est. Slippage</TYPE.darkGray>
              <TYPE.small textAlign="right" fontSize="14px">{estimatedSlippage?.toSignificant(6) || '0'}%</TYPE.small>
            </div>
        </RowBetween>
      </PoolBreakDownWrapper>
    </>
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
        <TYPE.largeHeader fontWeight={500} fontSize="22px">Zap Liquidity</TYPE.largeHeader>
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
  const { account } = useActiveWeb3React()

  const currency = useCurrency(currencyId)
  const { typedValue } = useZapState()
  const { onFieldInput } = useZapActionHandlers(false)
  const { currencyBalance, noLiquidity, parsedAmount, error } = useDerivedZapInfo(currency ?? undefined, undefined)
  const formattedAmount = parsedAmount?.toSignificant(6) ?? '';
  const { zapIn } = useZapper()

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyId = getCurrencyId(currencyA)
      console.log(poolAddress, 'here is the pool Address')
      history.push(`/zap/${poolAddress}/${newCurrencyId}`)
    },
    [history, poolAddress]
  )

  const toggleWalletModal = useWalletModalToggle()

  return (
    <>
      { !poolAddress ? (
        <PoolList />
      ) : (
        <AppBody>
          <CardHeader />
          <Wrapper>
            <AutoColumn>
              <CurrencyInputPanel
                  label={'From'}
                  showMaxButton={true}
                  onMax={() => {
                    onFieldInput(maxAmountSpend(currencyBalance)?.toExact() ?? '') 
                  }}
                  value={typedValue ?? ''}
                  currency={currency}
                  onUserInput={onFieldInput}
                  onCurrencySelect={handleCurrencyASelect}
                  id="zap-currency-input"
                  cornerRadiusBottomNone={false}
                  showCommonBases
              />
              <PoolInfo poolAddress={poolAddress} currency={currency ?? undefined} />
              <>
                {!account ? (
                  <ButtonLight style={{ marginTop: '20px' }} onClick={toggleWalletModal}>
                    Connect Wallet
                  </ButtonLight>
                ) : (
                  <ButtonError
                    style={{ marginTop: '20px' }} 
                    // disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                    disabled={!parsedAmount || error !== undefined}
                    onClick={() => zapIn(
                      currencyId === 'ETH' ? '0x0000000000000000000000000000000000000000' : currencyId,
                      poolAddress, 
                      parsedAmount?.raw.toString(),
                      0,
                      // Hard coded WETH for now, this needs to be based on optimal routing I think
                      '0xc778417e063141139fce010982780140aa0cd5ab'
                    )}
                    // error={!parsedAmount || error !== undefined}
                  >
                  <Text fontSize={20} fontWeight={500}>
                    {error ?? 'Zap'}
                  </Text>
                </ButtonError>
                )}
              </>
            </AutoColumn>
          </Wrapper>
        </AppBody>
      )}
    </>
  )
}

export default AddSingleSideLiquidity