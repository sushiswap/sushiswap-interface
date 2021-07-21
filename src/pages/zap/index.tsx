import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import Button, { ButtonError } from '../../components/Button'
import { ChainId, Currency, Ether, JSBI, NATIVE, Percent, ROUTER_ADDRESS, Trade, WNATIVE } from '@sushiswap/sdk'
import Column, { AutoColumn } from '../../components/Column'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { computeRealizedLPFeePercent, warningSeverity } from '../../functions/prices'
import styled, { keyframes } from 'styled-components'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from '../../state/zap/hooks'
import { useUserSlippageTolerance, useUserSlippageToleranceWithDefault } from '../../state/user/hooks'

import Alert from '../../components/Alert'
import { AppDispatch } from '../../state'
import { ArrowLeft } from 'react-feather'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import FormattedPriceImpact from '../../features/swap/FormattedPriceImpact'
import Head from 'next/head'
import Link from 'next/link'
import Loader from '../../components/Loader'
import PoolList from '../../components/PoolList'
import ProgressSteps from '../../components/ProgressSteps'
import QuestionHelper from '../../components/QuestionHelper'
import Router from 'next/router'
import Settings from '../../components/Settings'
import SwapRoute from '../../features/swap/SwapRoute'
import { ZAPPER_ADDRESS } from '../../constants/addresses'
import { currencyId as getCurrencyId } from '../../functions/currency/currencyId'
import { maxAmountSpend } from '../../functions/currency/maxAmountSpend'
import { resetZapState } from '../../state/zap/actions'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useDefaultsFromURLSearch } from '../../state/zap/hooks'
import { useDispatch } from 'react-redux'
import { useLingui } from '@lingui/react'
import usePool from '../../hooks/usePool'
import { useRouterContract } from '../../hooks/useContract'
import { useWalletModalToggle } from '../../state/application/hooks'
import useZapper from '../../hooks/useZapper'
import DoubleGlowShadow from '../../components/DoubleGlowShadow'

const PoolAllocationWrapper = styled.div`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 0.625rem 0.625rem 0 0;
  padding: 1rem;
`

const PoolBreakDownWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  border-top: 1px solid rgba(42, 58, 80, 0.4);
  padding: 1rem
  border-radius: 0 0 0.625rem 0.625rem;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

const PoolTokenRow = styled.span`
  display: flex;
  margin: 10px 0;
`

const defaultHighlightColor = '#2b2f3e'
const defaultBaseColor = '#21262b'

const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const Skeleton = styled.span`
  background-color: ${defaultBaseColor};
  background-image: linear-gradient(90deg, ${defaultBaseColor}, ${defaultHighlightColor}, ${defaultBaseColor});
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
  animation: ${skeletonKeyframes} 2s infinite;
  display: inline-block;
  line-height: 1;
  width: 100%;
`

const CardHeader = () => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <AutoColumn>
      <RowBetween style={{ padding: '1rem 0rem 1rem' }}>
        <Link href="/zap">
          <a
            onClick={(e) => {
              dispatch(resetZapState())
            }}
          >
            <StyledArrowLeft />
          </a>
        </Link>
        <div
          style={{
            fontWeight: 500,
            fontSize: '22px',
            marginBottom: '20px',
          }}
        >
          Zap Liquidity
        </div>
        {/* <Settings /> */}
      </RowBetween>
      <RowBetween style={{ padding: '0rem 0rem 1rem' }}>
        <Alert
          showIcon={true}
          message={
            <>
              Zaps allow you to LP in any pool with any asset. Please be careful when zapping low liquidity tokens as
              there may be very high slippage. ETH, WBTC, USDC, DAI and SUSHI are the safest tokens to zap with. If
              price impact seems too high, try disabling multihop.
            </>
          }
          type="warning"
        />
      </RowBetween>
    </AutoColumn>
  )
}

const DEFAULT_ZAP_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export default function Zap() {
  const { i18n } = useLingui()

  const { account, chainId } = useActiveWeb3React()

  const loadedUrlParams = useDefaultsFromURLSearch()

  const [poolAddress, currencyId] = [loadedUrlParams?.poolAddress, loadedUrlParams?.currencyId]

  const currency = useCurrency(currencyId)

  const { onFieldInput } = useZapActionHandlers(false)
  const {
    typedValue,
    currency0,
    currency1,
    token0,
    token1,
    poolTokenPercentage,
    currencyBalance,
    parsedAmount,
    error,
    bestTrade,
    liquidityMinted,
    currencyOneOutput,
    currencyZeroOutput,
    isTradingUnderlying,
    encodeSwapData,
  } = useDerivedZapInfo(currency ?? undefined, poolAddress)
  const { zapIn } = useZapper(currency ?? undefined)
  const dispatch = useDispatch<AppDispatch>()

  const route = bestTrade?.route
  const noRoute = !route

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!bestTrade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(bestTrade)
    const realizedLPFee = bestTrade.inputAmount.multiply(realizedLpFeePercent)
    const priceImpact = bestTrade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [bestTrade])

  const priceImpactSeverity = warningSeverity(priceImpact)
  const zapperAddress = ZAPPER_ADDRESS[chainId]

  // // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(parsedAmount, zapperAddress)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // get custom setting values for user in bips
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ZAP_SLIPPAGE_TOLERANCE)

  // Get min pooltokens received based on user slippage preferences
  const minTokensReceived = JSBI.divide(
    // Take raw token (number * (10000 - ALLOWED_SLIPPAGE))/10000

    // JSBI.multiply(liquidityMinted?.quotient || JSBI.BigInt(0), JSBI.BigInt(10000 - allowedSlippage)),
    JSBI.multiply(liquidityMinted?.quotient || JSBI.BigInt(0), allowedSlippage.quotient),
    JSBI.BigInt(10000)
  )

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  const showApproveFlow =
    !error &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const handleCurrencyASelect = useCallback(
    (currency: Currency) => {
      const newCurrencyId = getCurrencyId(currency)
      Router.push(`zap?poolAddress=${poolAddress}&currencyId=${newCurrencyId}`)
    },
    [poolAddress]
  )

  const toggleWalletModal = useWalletModalToggle()

  const zapCallback = useCallback(() => {
    const swapData = encodeSwapData()

    zapIn(
      currency === NATIVE[chainId] ? '0x0000000000000000000000000000000000000000' : currencyId,
      poolAddress,
      parsedAmount,
      currency === NATIVE[chainId] && isTradingUnderlying
        ? WNATIVE[chainId || 1].address
        : isTradingUnderlying
        ? poolAddress
        : ROUTER_ADDRESS[chainId || 1],
      minTokensReceived.toString(),
      swapData
    ).then(
      () => dispatch(resetZapState()),
      (err) => console.log(err, 'zap error')
    )
  }, [
    encodeSwapData,
    zapIn,
    currency,
    currencyId,
    poolAddress,
    parsedAmount,
    isTradingUnderlying,
    chainId,
    minTokensReceived,
    dispatch,
  ])

  const showRoute = Boolean(bestTrade && bestTrade.route.path.length > 2)

  return (
    <>
      <Head>
        <title>{i18n._(t`Zap`)} | Sushi</title>
        <meta
          key="description"
          name="description"
          content="SushiSwap allows for swapping of ERC20 compatible tokens across multiple networks"
        />
      </Head>
      {!poolAddress ? (
        <PoolList />
      ) : (
        <DoubleGlowShadow>
          <div className="w-full max-w-xl p-4 rounded bg-dark-900">
            <CardHeader />
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
                showCommonBases
              />
              <PoolAllocationWrapper>
                <RowBetween style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px' }}>To</div>
                  {currency0 && currency1 ? (
                    <DoubleCurrencyLogo
                      currency0={currency0 ?? undefined}
                      currency1={currency1 ?? undefined}
                      margin={false}
                      size={20}
                    />
                  ) : (
                    <Skeleton
                      style={{
                        width: '60px',
                        height: '20px',
                      }}
                    />
                  )}
                </RowBetween>
                <RowBetween>
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: '22px',
                    }}
                  >
                    {liquidityMinted?.toSignificant(6) || '0'}
                  </div>
                  <div className="inline-flex">
                    {currency0 && currency1 ? (
                      <>
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: '22px',
                          }}
                        >
                          {`${currency0?.symbol}${' '}`}
                        </div>
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: '22px',
                          }}
                          className="mx-1"
                        >
                          /
                        </div>
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: '22px',
                          }}
                        >
                          {`${' '}${currency1?.symbol}`}
                        </div>
                      </>
                    ) : (
                      <Skeleton
                        style={{
                          width: '120px',
                          height: '26px',
                        }}
                      />
                    )}
                  </div>
                </RowBetween>
              </PoolAllocationWrapper>
              <PoolBreakDownWrapper>
                <RowBetween>
                  <div>
                    <div style={{ fontSize: '14px' }}>Est. Pool Allocation</div>
                    <PoolTokenRow>
                      <CurrencyLogo size="22px" currency={currency0 ?? undefined} style={{ marginRight: '6px' }} />
                      <div style={{ fontSize: '14px' }}>
                        {currencyZeroOutput?.toSignificant(6) || 0} {currency0?.symbol}
                      </div>
                    </PoolTokenRow>
                    <PoolTokenRow>
                      <CurrencyLogo size="22px" currency={currency1 ?? undefined} style={{ marginRight: '6px' }} />
                      <div style={{ fontSize: '14px' }}>
                        {currencyOneOutput?.toSignificant(6) || 0} {currency1?.symbol}
                      </div>
                    </PoolTokenRow>
                  </div>
                  <div style={{ height: '91px' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <QuestionHelper text="Your share of the total liquidity pool" />
                      <div
                        style={{
                          textAlign: 'right',
                          fontSize: '14px',
                          marginLeft: '0.25rem',
                        }}
                      >
                        Pool Share
                      </div>
                    </span>
                    <div
                      style={{
                        marginBottom: '8px',
                        textAlign: 'right',
                        fontSize: '14px',
                      }}
                    >
                      {poolTokenPercentage?.toSignificant(6) || '0'}%
                    </div>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <QuestionHelper text="The difference between the market price and the estimated price due to trade size." />
                      <div
                        style={{
                          fontSize: '14px',
                          textAlign: 'right',
                          marginLeft: '0.25rem',
                        }}
                      >
                        Price Impact
                      </div>
                    </span>
                    <div
                      style={{
                        textAlign: 'right',
                        fontSize: '14px',
                      }}
                    >
                      <FormattedPriceImpact priceImpact={bestTrade?.priceImpact} />
                    </div>
                  </div>
                </RowBetween>
                {showRoute && (
                  <RowBetween style={{ padding: '16px 0 0 0' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div className="text-sm text-secondary">Route</div>
                      <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                    </span>
                    {bestTrade && <SwapRoute trade={bestTrade} />}
                  </RowBetween>
                )}
              </PoolBreakDownWrapper>
              <>
                {!account ? (
                  <Button variant="outlined" color="blue" style={{ marginTop: '20px' }} onClick={toggleWalletModal}>
                    Connect Wallet
                  </Button>
                ) : noRoute && bestTrade?.inputAmount ? (
                  <ButtonError style={{ marginTop: '20px' }}>
                    <div>Insufficient liquidity for this trade.</div>
                  </ButtonError>
                ) : showApproveFlow ? (
                  <RowBetween>
                    <Button
                      color="gradient"
                      size="lg"
                      onClick={approveCallback}
                      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                      style={{
                        width: '48%',
                        marginTop: '20px',
                      }}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          Approving <Loader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                        'Approved'
                      ) : (
                        'Approve ' + currency?.symbol
                      )}
                    </Button>
                    <Button
                      color="gradient"
                      size="lg"
                      onClick={() => zapCallback()}
                      style={{
                        width: '48%',
                        marginTop: '20px',
                      }}
                      id="zap-button"
                      disabled={approval !== ApprovalState.APPROVED}
                    >
                      {error ?? 'Zap'}
                    </Button>
                  </RowBetween>
                ) : priceImpactSeverity > 1 && error === undefined ? (
                  <ButtonError
                    disabled={priceImpactSeverity > 3}
                    error={priceImpactSeverity > 1}
                    style={{ marginTop: '20px' }}
                    onClick={() => zapCallback()}
                  >
                    {priceImpactSeverity > 3
                      ? `Price Impact Too High`
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </ButtonError>
                ) : (
                  <Button
                    color="gradient"
                    size="lg"
                    style={{ marginTop: '20px' }}
                    disabled={!parsedAmount || error !== undefined || approval !== ApprovalState.APPROVED}
                    onClick={() => zapCallback()}
                  >
                    {error ?? 'Zap'}
                  </Button>
                )}
                {showApproveFlow && (
                  <Column style={{ marginTop: '1rem' }}>
                    <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                  </Column>
                )}
              </>
            </AutoColumn>
          </div>
        </DoubleGlowShadow>
      )}
    </>
  )
}
