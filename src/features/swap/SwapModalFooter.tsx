import { CurrencyAmount, Trade, TradeType } from "@sushiswap/sdk";
import React, { useMemo, useState } from "react";
import { StyledBalanceMaxMini, SwapCallbackError } from "./styleds";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from "../../functions";

import { ButtonError } from "../../components/Button";
import { Field } from "../../state/swap/actions";
import FormattedPriceImpact from "./FormattedPriceImpact";
import QuestionHelper from "../../components/QuestionHelper";
import { Repeat } from "react-feather";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  archerETHTip,
}: {
  trade: Trade;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
  archerETHTip?: string;
}) {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  );
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(
    () => computeTradePriceBreakdown(trade),
    [trade]
  );
  const severity = warningSeverity(priceImpactWithoutFee);

  return (
    <div className="p-6 mt-0 -m-6 rounded bg-dark-800">
      <div className="grid gap-1 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">{i18n._(t`Price`)}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            {formatExecutionPrice(trade, showInverted, chainId)}
            <StyledBalanceMaxMini
              onClick={() => setShowInverted(!showInverted)}
            >
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            {trade.tradeType === TradeType.EXACT_INPUT
              ? i18n._(t`Minimum received`)
              : i18n._(t`Maximum sold`)}
            <QuestionHelper
              text={i18n._(
                t`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`
              )}
            />
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            {trade.tradeType === TradeType.EXACT_INPUT
              ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? "-"
              : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? "-"}
            <span className="ml-1">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.getSymbol(chainId)
                : trade.inputAmount.currency.getSymbol(chainId)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            <div className="text-sm">
              {i18n._(t`Price Impact`)}
              <QuestionHelper
                text={i18n._(
                  t`The difference between the market price and your price due to trade size.`
                )}
              />
            </div>
          </div>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            <div className="text-sm">{i18n._(t`Liquidity Provider Fee`)}</div>
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            {realizedLPFee
              ? realizedLPFee?.toSignificant(6) +
                " " +
                trade.inputAmount.currency.getSymbol(chainId)
              : "-"}
          </div>
        </div>
        {archerETHTip && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary">
              <div className="text-sm">{i18n._(t`Miner Tip`)}</div>
            </div>
            <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
              {CurrencyAmount.ether(archerETHTip).toFixed(4)} ETH
            </div>
          </div>
        )}
      </div>

      <ButtonError
        onClick={onConfirm}
        disabled={disabledConfirm}
        error={severity > 2}
        id="confirm-swap-or-send"
      >
        {severity > 2 ? i18n._(t`Swap Anyway`) : i18n._(t`Confirm Swap`)}
      </ButtonError>

      {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </div>
  );
}
