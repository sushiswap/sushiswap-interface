import React, { FC, useCallback } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import { Input as NumericalInput } from "../../components/NumericalInput";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { Field, setLimitPrice } from "../../state/limit-order/actions";
import {
  useDerivedLimitOrderInfo,
  useLimitOrderState,
} from "../../state/limit-order/hooks";

interface LimitPriceInputPanelProps {
  onBlur: () => void;
}

const LimitPriceInputPanel: FC<LimitPriceInputPanelProps> = ({ onBlur }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { limitPrice } = useLimitOrderState();
  const { currencies, currentPrice } = useDerivedLimitOrderInfo();
  const { i18n } = useLingui();
  const handleInput = useCallback(
    (value) => {
      dispatch(setLimitPrice(value));
      onBlur();
    },
    [dispatch, onBlur]
  );

  const disabled = !currencies[Field.INPUT] || !currencies[Field.OUTPUT];

  return (
    <div
      className={`flex bg-dark-800 w-full rounded overflow-hidden h-[68px] ${
        disabled ? "opacity-40 cursor-default" : ""
      }`}
    >
      <div className="flex w-[220px] p-4 gap-4 items-center">
        <span className="font-bold text-secondary">{i18n._(t`Rate`)}:</span>
        <span
          className={`uppercase border border-blue bg-blue text-blue bg-opacity-30 border-opacity-50 py-0.5 px-1.5 text-xs rounded-3xl flex items-center justify-center ${
            !disabled ? "cursor-pointer hover:border-opacity-100" : ""
          }`}
          onClick={() => handleInput(currentPrice?.toSignificant(6))}
        >
          {i18n._(t`Current`)}
        </span>
      </div>
      <div className="flex bg-dark-900 pl-4 pr-5 w-full border-2 border-dark-800 rounded-r items-center gap-3">
        <NumericalInput
          disabled={disabled}
          className="w-full bg-transparent font-medium text-2xl"
          placeholder={currentPrice?.toSignificant(6)}
          id="token-amount-input"
          value={limitPrice}
          onUserInput={handleInput}
          onBlur={onBlur}
        />
        <div className="text-xs text-secondary whitespace-nowrap">
          {currencies.OUTPUT?.symbol} per {currencies.INPUT?.symbol}
        </div>
      </div>
    </div>
  );
};

export default LimitPriceInputPanel;
