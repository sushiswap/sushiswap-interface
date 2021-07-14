import { Trade, TradeType, ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { ExternalLink } from '../Link'
import { ANALYTICS_URL } from '../../constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
    const { i18n } = useLingui()

    const { chainId } = useActiveWeb3React()
    const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
    const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
    const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

    return (
        <>
            <AutoColumn style={{ padding: '0 16px' }}>
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary text-sm">
                            {isExactIn ? i18n._(t`Minimum received`) : i18n._(t`Maximum sold`)}
                        </div>
                        <QuestionHelper
                            text={i18n._(
                                t`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`
                            )}
                        />
                    </RowFixed>
                    <RowFixed>
                        <div className="text-sm font-bold text-high-emphesis">
                            {isExactIn
                                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(
                                      4
                                  )} ${trade.outputAmount.currency.getSymbol(chainId)}` ?? '-'
                                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(
                                      4
                                  )} ${trade.inputAmount.currency.getSymbol(chainId)}` ?? '-'}
                        </div>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary text-sm">{i18n._(t`Price Impact`)}</div>
                        <QuestionHelper
                            text={i18n._(
                                t`The difference between the market price and estimated price due to trade size.`
                            )}
                        />
                    </RowFixed>
                    <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </RowBetween>

                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary text-sm">{i18n._(t`Liquidity Provider Fee`)}</div>
                        <QuestionHelper
                            text={i18n._(
                                t`A portion of each trade (0.25%) goes to liquidity providers as a protocol incentive.`
                            )}
                        />
                    </RowFixed>
                    <div className="text-sm font-bold text-high-emphesis">
                        {realizedLPFee
                            ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.getSymbol(chainId)}`
                            : '-'}
                    </div>
                </RowBetween>
            </AutoColumn>
        </>
    )
}

export interface AdvancedSwapDetailsProps {
    trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()

    const [allowedSlippage] = useUserSlippageTolerance()

    const showRoute = Boolean(trade && trade.route.path.length > 2)

    return (
        <AutoColumn gap="0px">
            {trade && (
                <>
                    <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
                    {showRoute && (
                        <>
                            <RowBetween style={{ padding: '0 16px' }}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="text-secondary text-sm">{i18n._(t`Route`)}</div>
                                    <QuestionHelper
                                        text={i18n._(
                                            t`Routing through these tokens resulted in the best price for your trade.`
                                        )}
                                    />
                                </span>
                                <SwapRoute trade={trade} />
                            </RowBetween>
                        </>
                    )}

                    {!showRoute &&
                        chainId &&
                        [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.XDAI, ChainId.MATIC].includes(
                            chainId
                        ) && (
                            <div className="flex justify-center pt-3 px-4">
                                <ExternalLink
                                    href={`${
                                        chainId && ANALYTICS_URL[chainId]
                                            ? ANALYTICS_URL[chainId]
                                            : 'https://analytics.sushi.com'
                                    }/pairs/${trade.route.pairs[0].liquidityToken.address}`}
                                >
                                    {i18n._(t`View pair analytics`)}
                                </ExternalLink>
                            </div>
                        )}
                </>
            )}
        </AutoColumn>
    )
}
