import { AppDispatch, AppState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
  Field,
  replaceLimitOrderState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";
import { useCurrency } from "../../hooks/Tokens";
import { ChainId, Currency, CurrencyAmount, Token } from "@sushiswap/sdk";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { usePair } from "../../hooks/usePair";
import { useCurrencyBalances } from "../wallet/hooks";
import { isAddress, tryParseAmount, wrappedCurrency } from "../../functions";
import useParsedQueryString from "../../hooks/useParsedQueryString";
import { ParsedQs } from "qs";
import { LimitOrderState } from "./reducer";

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
} {
  const { account } = useActiveWeb3React();
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    typedValue,
    independentField,
    limitPrice,
  } = useLimitOrderState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedInputAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const parsedOutputAmount = tryParseAmount(
    (isExactIn
      ? +typedValue * +limitPrice
      : +typedValue / +limitPrice
    ).toString(),
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined
  );

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const parsedAmounts = {
    [Field.INPUT]:
      independentField === Field.INPUT ? parsedInputAmount : parsedOutputAmount,
    [Field.OUTPUT]:
      independentField === Field.OUTPUT
        ? parsedInputAmount
        : parsedOutputAmount,
  };

  return {
    currencies: {
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    },
    parsedAmounts,
    currencyBalances,
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

export const useReserveRatio = (inverted = false) => {
  const { chainId } = useActiveWeb3React();
  const { currencies } = useDerivedLimitOrderInfo();
  const tokenA = wrappedCurrency(currencies[Field.INPUT], chainId);
  const tokenB = wrappedCurrency(currencies[Field.OUTPUT], chainId);

  const [, pair] = usePair(tokenA, tokenB);
  const a = pair?.token0Price.toSignificant(6);
  const b = pair?.token1Price.toSignificant(6);
  console.log(pair);
  return pair?.token0 === tokenA || inverted ? a : b;
};

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

    // TODO: Prompt for chain switch is result.chainId !== chainId

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
