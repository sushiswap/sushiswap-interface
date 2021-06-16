import { AppDispatch, AppState } from "../index";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  JSBI,
  Token,
  TokenAmount,
  Trade,
} from "@sushiswap/sdk";
import {
  DEFAULT_ARCHER_ETH_TIP,
  DEFAULT_ARCHER_GAS_ESTIMATE,
} from "../../constants";
import {
  EstimatedSwapCall,
  SuccessfulCall,
  useSwapCallArguments,
} from "../../hooks/useSwapCallback";
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";
import { isAddress, isZero } from "../../functions/validate";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTradeExactIn, useTradeExactOut } from "../../hooks/Trades";
import {
  useUserArcherETHTip,
  useUserArcherGasEstimate,
  useUserArcherGasPrice,
  useUserArcherTipManualOverride,
  useUserSlippageTolerance,
} from "../user/hooks";

import { ParsedQs } from "qs";
import { SwapState } from "./reducer";
import { computeSlippageAdjustedAmounts } from "../../functions/prices";
import { t } from "@lingui/macro";
import { tryParseAmount } from "../../functions/parse";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCurrency } from "../../hooks/Tokens";
import { useCurrencyBalances } from "../wallet/hooks";
import useENS from "../../hooks/useENS";
import { useLingui } from "@lingui/react";
import useParsedQueryString from "../../hooks/useParsedQueryString";

export function useSwapState(): AppState["swap"] {
  return useSelector<AppState, AppState["swap"]>((state) => state.swap);
}

export function useSwapActionHandlers(): {
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
    [chainId, dispatch]
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

const BAD_RECIPIENT_ADDRESSES: string[] = [
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", // v2 factory
  "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a", // v2 router 01
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // v2 router 02
];

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some(
      (pair) => pair.liquidityToken.address === checksummedAddress
    )
  );
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(doArcher = false): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmount: CurrencyAmount | undefined;
  v2Trade: Trade | undefined;
  inputError?: string;
} {
  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const recipientLookup = useENS(recipient ?? undefined);
  const to: string | null =
    (recipient === null ? account : recipientLookup.address) ?? null;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined
  );
  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined
  );

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = "Connect Wallet";
  }

  if (!parsedAmount) {
    inputError = inputError ?? i18n._(t`Enter an amount`);
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? i18n._(t`Select a token`);
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? i18n._(t`Enter a recipient`);
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? i18n._(t`Invalid recipient`);
    }
  }

  const [allowedSlippage] = useUserSlippageTolerance();

  const slippageAdjustedAmounts =
    v2Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ];

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = i18n._(
      t`Insufficient ${amountIn.currency.getSymbol(chainId)} balance`
    );
  }

  const swapCalls = useSwapCallArguments(
    v2Trade as Trade,
    allowedSlippage,
    to,
    doArcher
  );

  const [, setUserETHTip] = useUserArcherETHTip();
  const [userGasEstimate, setUserGasEstimate] = useUserArcherGasEstimate();
  const [userGasPrice] = useUserArcherGasPrice();
  const [userTipManualOverride, setUserTipManualOverride] =
    useUserArcherTipManualOverride();

  useEffect(() => {
    if (doArcher) {
      setUserTipManualOverride(false);
      setUserETHTip(DEFAULT_ARCHER_ETH_TIP.toString());
      setUserGasEstimate(DEFAULT_ARCHER_GAS_ESTIMATE.toString());
    }
  }, [doArcher, setUserTipManualOverride, setUserETHTip, setUserGasEstimate]);

  useEffect(() => {
    if (doArcher && !userTipManualOverride) {
      setUserETHTip(
        JSBI.multiply(
          JSBI.BigInt(userGasEstimate),
          JSBI.BigInt(userGasPrice)
        ).toString()
      );
    }
  }, [
    doArcher,
    userGasEstimate,
    userGasPrice,
    userTipManualOverride,
    setUserETHTip,
  ]);

  useEffect(() => {
    async function estimateGas() {
      const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
        swapCalls.map((call) => {
          const {
            parameters: { methodName, args, value },
            contract,
          } = call;
          const options = !value || isZero(value) ? {} : { value };

          return contract.estimateGas[methodName](...args, options)
            .then((gasEstimate) => {
              return {
                call,
                gasEstimate,
              };
            })
            .catch((gasError) => {
              console.debug(
                "Gas estimate failed, trying eth_call to extract error",
                call
              );

              return contract.callStatic[methodName](...args, options)
                .then((result) => {
                  console.debug(
                    "Unexpected successful call after failed estimate gas",
                    call,
                    gasError,
                    result
                  );
                  return {
                    call,
                    error: new Error(
                      "Unexpected issue with estimating the gas. Please try again."
                    ),
                  };
                })
                .catch((callError) => {
                  console.debug("Call threw error", call, callError);
                  let errorMessage: string;
                  switch (callError.reason) {
                    case "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT":
                    case "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT":
                      errorMessage =
                        "This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.";
                      break;
                    default:
                      errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`;
                  }
                  return {
                    call,
                    error: new Error(errorMessage),
                  };
                });
            });
        })
      );

      // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
      const successfulEstimation = estimatedCalls.find(
        (el, ix, list): el is SuccessfulCall =>
          "gasEstimate" in el &&
          (ix === list.length - 1 || "gasEstimate" in list[ix + 1])
      );

      if (successfulEstimation) {
        setUserGasEstimate(successfulEstimation.gasEstimate.toString());
      }
    }
    if (doArcher && v2Trade && swapCalls && !userTipManualOverride) {
      estimateGas();
    }
  }, [doArcher, v2Trade, swapCalls, userTipManualOverride, setUserGasEstimate]);

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError,
  };
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
): SwapState {
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
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient,
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
