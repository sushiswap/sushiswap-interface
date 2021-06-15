import React, { FC, useCallback } from "react";
import { Field } from "../../state/swap/actions";
import {
  useDerivedLimitOrderInfo,
  useLimitOrderActionHandlers,
  useLimitOrderState,
} from "../../state/limit-order/hooks";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { setFromBentoBalance } from "../../state/limit-order/actions";
import { CurrencyAmount } from "@sushiswap/sdk";
import { maxAmountSpend } from "../../functions";
import { useActiveWeb3React } from "../../hooks";
import { ChevronDownIcon } from "@heroicons/react/outline";

const BalancePanel: FC = () => {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const { fromBentoBalance } = useLimitOrderState();
  const { currencyBalances } = useDerivedLimitOrderInfo();
  const dispatch = useDispatch<AppDispatch>();

  const { onUserInput } = useLimitOrderActionHandlers();

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT],
    undefined,
    chainId
  );

  // TODO correct that for spends from bento
  // we do not have to calculate maxAmountSpend?
  const handleMaxInput = useCallback(() => {
    if (fromBentoBalance) {
      onUserInput(Field.INPUT, currencyBalances[Field.INPUT].toExact());
    } else {
      maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
    }
  }, [currencyBalances, fromBentoBalance, maxAmountInput, onUserInput]);

  return (
    <div className="flex bg-dark-700 rounded-b px-5 py-1 justify-between">
      <div
        onClick={handleMaxInput}
        className="text-xs font-medium cursor-pointer"
      >
        {i18n._(t`Balance:`)} {currencyBalances[Field.INPUT]?.toSignificant(6)}
      </div>
      <div
        className="flex gap-2 cursor-pointer items-center"
        onClick={() => dispatch(setFromBentoBalance(!fromBentoBalance))}
      >
        <div className="text-xs font-medium cursor-pointer text-secondary">
          {i18n._(t`Pay From:`)}
        </div>
        <div className="flex items-center gap-0.5">
          <div className="text-xs font-bold text-high-emphesis">
            {fromBentoBalance ? i18n._(t`BentoBox`) : i18n._(t`Wallet`)}
          </div>
          <ChevronDownIcon className="text-secondary" width={12} height={12} />
        </div>
      </div>
    </div>
  );
};

export default BalancePanel;
