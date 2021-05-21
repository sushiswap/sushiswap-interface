import { AlertTriangle, ArrowDown } from 'react-feather'
import React, { useMemo } from 'react'
import { Trade, TradeType } from '@sushiswap/sdk'
import { t, Trans } from '@lingui/macro'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../functions/prices'

import { Field } from '../../state/swap/actions'
import { isAddress, shortenAddress, wrappedCurrency } from '../../functions'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import TokenIcon from '../../components/TokenIcon'

export default function SwapModalHeader({
    trade,
    allowedSlippage,
    recipient,
    showAcceptChanges,
    onAcceptChanges
}: {
    trade: Trade
    allowedSlippage: number
    recipient: string | null
    showAcceptChanges: boolean
    onAcceptChanges: () => void
}) {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
        trade,
        allowedSlippage
    ])
    const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
    const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
    const [tokenA, tokenB] = useMemo(
        () => [
            wrappedCurrency(trade.inputAmount.currency, chainId),
            wrappedCurrency(trade.outputAmount.currency, chainId)
        ],
        [trade.inputAmount.currency, trade.outputAmount.currency, chainId]
    )

    return (
        <div className="grid gap-4 pt-3 pb-4">
            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TokenIcon token={tokenA} />
                        <div className="overflow-ellipsis w-[220px] overflow-hidden font-bold text-2xl text-high-emphesis">
                            {trade.inputAmount.toSignificant(6)}
                        </div>
                    </div>
                    <div className="text-2xl text-high-emphesis font-medium ml-3">
                        {trade.inputAmount.currency.getSymbol(chainId)}
                    </div>
                </div>
                <div className="ml-3 mr-3 min-w-[24px]">
                    <ArrowDown size={24} />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TokenIcon token={tokenB} />
                        <div
                            className={`overflow-ellipsis w-[220px] overflow-hidden font-bold text-2xl ${
                                priceImpactSeverity > 2 ? 'text-red' : 'text-high-emphesis'
                            }`}
                        >
                            {trade.inputAmount.toSignificant(6)}
                        </div>
                    </div>
                    <div className="text-2xl text-high-emphesis font-medium ml-3">
                        {trade.outputAmount.currency.getSymbol(chainId)}
                    </div>
                </div>
            </div>

            {showAcceptChanges ? (
                <div className="flex justify-between items-center border border-gray-800 rounded p-2 px-3">
                    <div className="flex justify-start items-center text-high-emphesis uppercase font-bold text-sm">
                        <div className="mr-3 min-w-[24px]">
                            <AlertTriangle size={24} />
                        </div>
                        <span>{i18n._(t`Price Updated`)}</span>
                    </div>
                    <span className="text-blue cursor-pointer text-sm" onClick={onAcceptChanges}>
                        {i18n._(t`Accept`)}
                    </span>
                </div>
            ) : null}
            <div className="justify-start text-secondary text-sm">
                {trade.tradeType === TradeType.EXACT_INPUT ? (
                    <Trans>
                        Output is estimated. You will receive at least{' '}
                        <b>
                            {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
                            {trade.outputAmount.currency.getSymbol(chainId)}
                        </b>{' '}
                        or the transaction will revert.
                    </Trans>
                ) : (
                    <Trans>
                        Input is estimated. You will sell at most{' '}
                        <b>
                            {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{' '}
                            {trade.inputAmount.currency.getSymbol(chainId)}
                        </b>{' '}
                        or the transaction will revert.
                    </Trans>
                )}
            </div>

            {recipient !== null ? (
                <div className="flex-start">
                    <Trans>
                        Output will be sent to{' '}
                        <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
                    </Trans>
                </div>
            ) : null}
        </div>
    )
}
