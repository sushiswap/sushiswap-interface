import { AppDispatch, AppState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Field,
  replaceLimitOrderState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";
import { useCurrency } from "../../hooks/Tokens";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Price,
  Token,
} from "@sushiswap/sdk";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCurrencyBalances } from "../wallet/hooks";
import { isAddress, tryParseAmount, wrappedCurrency } from "../../functions";
import useParsedQueryString from "../../hooks/useParsedQueryString";
import { ParsedQs } from "qs";
import { LimitOrderState, OrderExpiration } from "./reducer";
import { useBentoBalances } from "../bentobox/hooks";
import { useTradeExactIn, useTradeExactOut } from "../../hooks/Trades";
import useENS from "../../hooks/useENS";
import { t } from "@lingui/macro";
import { BAD_RECIPIENT_ADDRESSES } from "../../constants";
import { i18n } from "@lingui/core";

export function useLimitOrderActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
} {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId:
            currency instanceof Token
              ? currency.address
              : currency === Currency.getNativeCurrency(chainId)
              ? Currency.getNativeCurrencySymbol(chainId)
              : "",
        })
      );
    },
    [dispatch]
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }));
    },
    [dispatch]
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  };
}

export function useDerivedLimitOrderInfo(): {
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount | undefined };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  inputError?: string;
  currentPrice: Price;
} {
  const { account, chainId } = useActiveWeb3React();
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    typedValue,
    independentField,
    limitPrice,
    fromBentoBalance,
    recipient,
    orderExpiration,
  } = useLimitOrderState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const inputToken = wrappedCurrency(inputCurrency, chainId);
  const recipientLookup = useENS(recipient ?? undefined);
  const to: string | null =
    (recipient === null ? account : recipientLookup.address) ?? null;

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );
  const parsedRate = tryParseAmount(
    limitPrice,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  // TODO calculation is redundant, need to multiply CurrencyAmount
  const outputValue =
    parsedAmount && parsedRate
      ? isExactIn
        ? parsedAmount.multiply(parsedRate)?.toSignificant(6)
        : parsedAmount.divide(parsedRate)?.toSignificant(6)
      : "0";
  const parsedOutputAmount = tryParseAmount(
    outputValue,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined
  );

  // TODO Why is this part so slow and why does it not work on matic
  // ---------------------------------------------------------------------------
  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined
  );
  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined
  );

  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;
  const rate = trade?.nextMidPrice;
  // ---------------------------------------------------------------------------

  const bentoBoxBalances = useBentoBalances();
  const balance = useMemo(
    () => bentoBoxBalances?.find((el) => el.address === inputToken?.address),
    [bentoBoxBalances, inputToken?.address]
  );

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const currencyBalances = {
    [Field.INPUT]: fromBentoBalance
      ? CurrencyAmount.fromRawAmount(
          inputCurrency,
          balance?.bentoBalance ? balance.bentoBalance : 0
        )
      : relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const parsedAmounts = {
    [Field.INPUT]:
      independentField === Field.INPUT ? parsedAmount : parsedOutputAmount,
    [Field.OUTPUT]:
      independentField === Field.OUTPUT ? parsedAmount : parsedOutputAmount,
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = "Connect Wallet";
  }

  if (!parsedAmount || !parsedOutputAmount) {
    inputError = inputError ?? i18n._(t`Enter an amount`);
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? i18n._(t`Select a token`);
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? i18n._(t`Enter a recipient`);
  } else {
    if (BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1) {
      inputError = inputError ?? i18n._(t`Invalid recipient`);
    }
  }

  if (!limitPrice) {
    inputError = inputError ?? i18n._(t`Select a rate`);
  }

  if (!orderExpiration) {
    inputError = inputError ?? i18n._(t`Select an order expiration`);
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    parsedAmounts[Field.INPUT],
  ];

  if (!balanceIn) {
    inputError = i18n._(t`Loading balance`);
  }

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = i18n._(
      t`Insufficient ${amountIn.currency.getSymbol(chainId)} balance`
    );
  }

  return {
    currencies,
    parsedAmounts,
    currencyBalances,
    inputError,
    currentPrice: rate,
  };
}

export function useLimitOrderState(): AppState["limitOrder"] {
  return useSelector<AppState, AppState["limitOrder"]>(
    (state) => state.limitOrder
  );
}

export function useLimitOrderApprovalPending(): string {
  return useSelector(
    (state: AppState) => state.limitOrder.limitOrderApprovalPending
  );
}

function parseCurrencyFromURLParameter(
  urlParam: any,
  chainId = ChainId.MAINNET
): string {
  if (typeof urlParam === "string") {
    const valid = isAddress(urlParam);
    const nativeSymbol = Currency.getNativeCurrencySymbol(chainId);
    if (valid) return valid;
    if (urlParam.toUpperCase() === nativeSymbol) return nativeSymbol;
    if (valid === false) return nativeSymbol;
  }
  return Currency.getNativeCurrencySymbol(chainId) ?? "";
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === "string" && !isNaN(parseFloat(urlParam))
    ? urlParam
    : "";
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === "string" && urlParam.toLowerCase() === "output"
    ? Field.OUTPUT
    : Field.INPUT;
}

function parseBooleanFieldParameter(urlParam: any): boolean {
  if (typeof urlParam !== "string") return false;
  if (urlParam.toLowerCase() === "true") return true;
  if (urlParam.toLowerCase() === "false") return false;
  return false;
}

const ENS_NAME_REGEX =
  /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== "string") return null;
  const address = isAddress(recipient);
  if (address) return address;
  if (ENS_NAME_REGEX.test(recipient)) return recipient;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

export function queryParametersToSwapState(
  parsedQs: ParsedQs,
  chainId = ChainId.MAINNET
): Partial<LimitOrderState> {
  let inputCurrency = parseCurrencyFromURLParameter(
    parsedQs.inputCurrency,
    chainId
  );
  let outputCurrency = parseCurrencyFromURLParameter(
    parsedQs.outputCurrency,
    chainId
  );
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === "string") {
      inputCurrency = "";
    } else {
      outputCurrency = "";
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient);

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    limitPrice: parseTokenAmountURLParameter(parsedQs.exactRate),
    fromBentoBalance: parseBooleanFieldParameter(parsedQs.fromBento),
    orderExpiration: { value: OrderExpiration.never, label: i18n._(t`Never`) },
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId?: string;
      outputCurrencyId?: string;
      chainId?: ChainId;
    }
  | undefined {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const parsedQs = useParsedQueryString();

  const [result, setResult] = useState<
    | {
        inputCurrencyId?: string;
        outputCurrencyId?: string;
        chainId?: ChainId;
      }
    | undefined
  >();

  useEffect(() => {
    if (!chainId) return;

    const parsed = queryParametersToSwapState(parsedQs, chainId);

    dispatch(
      replaceLimitOrderState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient,
        fromBentoBalance: parsed.fromBentoBalance,
        limitPrice: parsed.limitPrice,
        orderExpiration: parsed.orderExpiration,
      })
    );

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId]);

  return result;
}
