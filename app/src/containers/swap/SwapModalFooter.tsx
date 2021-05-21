import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import React, { useContext, useMemo, useState } from 'react'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { Trade, TradeType } from '@sushiswap/sdk'
import {
    computeSlippageAdjustedAmounts,
    computeTradePriceBreakdown,
    formatExecutionPrice,
    warningSeverity
} from '../../functions/prices'

import { AutoColumn } from '../../components/Column'
import { ButtonError } from '../../components/ButtonLegacy'
import { Field } from '../../state/swap/actions'
import FormattedPriceImpact from './FormattedPriceImpact'
import QuestionHelper from '../../components/QuestionHelper'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

export default function SwapModalFooter({
    trade,
    onConfirm,
    allowedSlippage,
    swapErrorMessage,
    disabledConfirm
}: {
    trade: Trade
    allowedSlippage: number
    onConfirm: () => void
    swapErrorMessage: string | undefined
    disabledConfirm: boolean
}) {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const [showInverted, setShowInverted] = useState<boolean>(false)
    const theme = useContext(ThemeContext)
    const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
        allowedSlippage,
        trade
    ])
    const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
    const severity = warningSeverity(priceImpactWithoutFee)

    return (
        <>
            <AutoColumn gap="0px">
                <RowBetween align="center">
                    <Text className="text-sm">{i18n._(t`Price`)}</Text>
                    <Text
                        className="text-sm font-medium"
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            textAlign: 'right',
                            paddingLeft: '10px'
                        }}
                    >
                        {formatExecutionPrice(trade, showInverted, chainId)}
                        <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                            <Repeat size={14} />
                        </StyledBalanceMaxMini>
                    </Text>
                </RowBetween>

                <RowBetween>
                    <RowFixed>
                        <div className="text-sm">
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? i18n._(t`Minimum received`)
                                : i18n._(t`Maximum sold`)}
                        </div>
                        <QuestionHelper
                            text={i18n._(
                                t`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`
                            )}
                        />
                    </RowFixed>
                    <RowFixed>
                        <div className="text-sm">
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
                        </div>
                        <div className="ml-1 text-sm">
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? trade.outputAmount.currency.getSymbol(chainId)
                                : trade.inputAmount.currency.getSymbol(chainId)}
                        </div>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <div className="text-sm">{i18n._(t`Price Impact`)}</div>
                        <QuestionHelper
                            text={i18n._(t`The difference between the market price and your price due to trade size.`)}
                        />
                    </RowFixed>
                    <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <div className="text-sm">{i18n._(t`Liquidity Provider Fee`)}</div>
                        <QuestionHelper
                            text={i18n._(
                                t`A portion of each trade (0.25%) goes to liquidity providers as a protocol incentive.`
                            )}
                        />
                    </RowFixed>
                    <div className="text-sm">
                        {realizedLPFee
                            ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.getSymbol(chainId)
                            : '-'}
                    </div>
                </RowBetween>
            </AutoColumn>

            <AutoRow>
                <ButtonError
                    id="confirm-swap-or-send"
                    onClick={onConfirm}
                    disabled={disabledConfirm}
                    error={severity > 2}
                >
                    {severity > 2 ? i18n._(t`Swap Anyway`) : i18n._(t`Confirm Swap`)}
                </ButtonError>

                {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </AutoRow>
        </>
    )
}
