import { Trade, TradeType } from '@sushiswap/sdk'
import React, { useContext, useMemo, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import {
    computeSlippageAdjustedAmounts,
    computeTradePriceBreakdown,
    formatExecutionPrice,
    warningSeverity
} from '../../utils/prices'
import { ButtonError } from '../ButtonLegacy'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { t } from '@lingui/macro'
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
                    <Text fontWeight={400} fontSize={14} color={theme.text2}>
                        {i18n._(t`Price`)}
                    </Text>
                    <Text
                        fontWeight={500}
                        fontSize={14}
                        color={theme.text1}
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
                        <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? i18n._(t`Minimum received`)
                                : i18n._(t`Maximum sold`)}
                        </TYPE.black>
                        <QuestionHelper
                            text={i18n._(
                                t`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`
                            )}
                        />
                    </RowFixed>
                    <RowFixed>
                        <TYPE.black fontSize={14}>
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
                        </TYPE.black>
                        <TYPE.black fontSize={14} marginLeft={'4px'}>
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? trade.outputAmount.currency.getSymbol(chainId)
                                : trade.inputAmount.currency.getSymbol(chainId)}
                        </TYPE.black>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
                            {i18n._(t`Price Impact`)}
                        </TYPE.black>
                        <QuestionHelper
                            text={i18n._(t`The difference between the market price and your price due to trade size.`)}
                        />
                    </RowFixed>
                    <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                            {i18n._(t`Liquidity Provider Fee`)}
                        </TYPE.black>
                        <QuestionHelper
                            text={i18n._(
                                t`A portion of each trade (0.25%) goes to liquidity providers as a protocol incentive.`
                            )}
                        />
                    </RowFixed>
                    <TYPE.black fontSize={14}>
                        {realizedLPFee
                            ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.getSymbol(chainId)
                            : '-'}
                    </TYPE.black>
                </RowBetween>
            </AutoColumn>

            <AutoRow>
                <ButtonError
                    onClick={onConfirm}
                    disabled={disabledConfirm}
                    error={severity > 2}
                    style={{ margin: '10px 0 0 0' }}
                    id="confirm-swap-or-send"
                >
                    <Text fontSize={20} fontWeight={500}>
                        {severity > 2 ? i18n._(t`Swap Anyway`) : i18n._(t`Confirm Swap`)}
                    </Text>
                </ButtonError>

                {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </AutoRow>
        </>
    )
}
