import { Trade, TradeType } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE, ExternalLink } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

const InfoLink = styled(ExternalLink)`
    width: 100%;
    border: 1px solid ${({ theme }) => theme.bg3};
    padding: 6px 6px;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    color: ${({ theme }) => theme.text3};
`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade | undefined; allowedSlippage: number }) {
    const theme = useContext(ThemeContext)
    const { chainId } = useActiveWeb3React()
    const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
    const isExactIn = trade?.tradeType === TradeType.EXACT_INPUT
    const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

    return (
        <>
            <AutoColumn style={{ padding: '0 16px' }}>
                <RowBetween>
                    <RowFixed>
                        <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
                            {isExactIn ? 'Min Received' : 'Max Sold'}
                        </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                        <TYPE.black color={theme.text3} fontSize={14}>
                            {trade
                                ? isExactIn
                                    ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(
                                          4
                                      )} ${trade?.outputAmount.currency.getSymbol(chainId)}` ?? '-'
                                    : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(
                                          4
                                      )} ${trade?.inputAmount.currency.getSymbol(chainId)}` ?? '-'
                                : ''}
                        </TYPE.black>
                        <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
                            Price Impact
                        </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                        {priceImpactWithoutFee ? <FormattedPriceImpact priceImpact={priceImpactWithoutFee} /> : ''}
                        <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
                    </RowFixed>
                </RowBetween>

                <RowBetween>
                    <RowFixed>
                        <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
                            Fee
                        </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                        <TYPE.black fontSize={14} color={theme.text3}>
                            {realizedLPFee
                                ? realizedLPFee
                                    ? `${realizedLPFee.toSignificant(4)} ${trade?.inputAmount.currency.getSymbol(
                                          chainId
                                      )}`
                                    : '-'
                                : ''}
                        </TYPE.black>
                        <QuestionHelper text="A portion of each trade (0.25%) goes to liquidity providers (LP) as a protocol incentive, and (0.05%) to xSUSHI holders." />
                    </RowFixed>
                </RowBetween>
            </AutoColumn>
        </>
    )
}

export interface AdvancedSwapDetailsProps {
    trade?: Trade | undefined
}

export function AdvancedSwapDetailsFixed({ trade }: AdvancedSwapDetailsProps) {
    const { chainId } = useActiveWeb3React()

    const theme = useContext(ThemeContext)

    const [allowedSlippage] = useUserSlippageTolerance()

    const showRoute = Boolean(trade && trade.route.path.length > 2)

    return (
        <AutoColumn gap="0px">
            <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
            {chainId === 1 && trade && !showRoute ? (
                <AutoColumn style={{ padding: '12px 16px 0 16px' }}>
                    <InfoLink
                        href={'https://analytics.sushi.com/pairs/' + trade?.route.pairs[0].liquidityToken.address}
                        target="_blank"
                    >
                        View Pair Analytics ↗
                    </InfoLink>
                </AutoColumn>
            ) : (
                !showRoute && (
                    <AutoColumn style={{ padding: '12px 16px 0 16px' }}>
                        <InfoLink href={'https://analytics.sushi.com/'} target="_blank">
                            View Analytics ↗
                        </InfoLink>
                    </AutoColumn>
                )
            )}

            {trade && (
                <>
                    {/* <TradeSummary trade={trade} allowedSlippage={allowedSlippage} /> */}
                    {showRoute && (
                        <>
                            <RowBetween style={{ padding: '0 16px' }}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
                                        Route
                                    </TYPE.black>
                                </span>
                                <RowFixed>
                                    <SwapRoute trade={trade} />
                                    <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                                </RowFixed>
                            </RowBetween>
                        </>
                    )}
                </>
            )}
        </AutoColumn>
    )
}
