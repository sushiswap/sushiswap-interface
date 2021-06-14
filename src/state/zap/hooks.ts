import { AppDispatch, AppState } from "../index";
import {
  Currency,
  CurrencyAmount,
  JSBI,
  Pair,
  Percent,
  TokenAmount,
  Trade,
  WETH,
} from "@sushiswap/sdk";
import { Field, typeInput } from "./actions";
import { PairState, usePair } from "../../hooks/usePairs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useUserSingleHopOnly,
  useUserSlippageTolerance,
} from "../../state/user/hooks";

import ROUTER_ABI_SLIM from "../../constants/abis/router-slim.json";
import { ZAPPER_ADDRESS } from "../../constants/addresses";
import { basisPointsToPercent } from "../../functions";
import { ethers } from "ethers";
import { tryParseAmount } from "../../functions/parse";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCurrency } from "../../hooks/Tokens";
import { useCurrencyBalances } from "../wallet/hooks";
import useParsedQueryString from "../../hooks/useParsedQueryString";
import usePool from "../../hooks/usePool";
import { useTotalSupply } from "../../hooks/useTotalSupply";
import { useTradeExactIn } from "../../hooks/Trades";
import useTransactionDeadline from "../../hooks/useTransactionDeadline";
import { wrappedCurrencyAmount } from "../../functions/currency/wrappedCurrency";

const ZERO = JSBI.BigInt(0);

export function useZapState(): AppState["zap"] {
  return useSelector<AppState, AppState["zap"]>((state) => state.zap);
}

export function useZapActionHandlers(noLiquidity: boolean | undefined): {
  onFieldInput: (typedValue: string) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onFieldInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      );
    },
    [dispatch, noLiquidity]
  );

  return {
    onFieldInput,
  };
}

export function useDerivedZapInfo(
  currency: Currency | undefined,
  pairAddress: string | undefined
): {
  typedValue: string;
  currency: Currency | undefined;
  currency0: Currency | undefined;
  currency1: Currency | undefined;
  token0: string | undefined;
  token1: string | undefined;
  pair?: Pair | null;
  pairState: PairState;
  currencyBalance: CurrencyAmount | undefined;
  parsedAmount: CurrencyAmount | undefined;
  tradeAmount: CurrencyAmount | undefined;
  noLiquidity?: boolean;
  currencyZeroOutput?: CurrencyAmount | undefined;
  currencyOneOutput?: CurrencyAmount | undefined;
  liquidityMinted?: TokenAmount;
  poolTokenPercentage?: Percent;
  bestTrade?: Trade;
  encodeSwapData: () => string | number;
  isTradingUnderlying: boolean;
  error?: string;
} {
  const { account, chainId } = useActiveWeb3React();

  const { typedValue } = useZapState();

  // token
  const currencyData = useMemo(() => currency ?? undefined, [currency]);

  // Pool Data
  const { reserves, token0, token1, ratio } = usePool(pairAddress);
  const currency0 = useCurrency(token0);
  const currency1 = useCurrency(token1);

  // pair
  const [pairState, pair] = usePair(
    currency0 ?? undefined,
    currency1 ?? undefined
  );
  const totalSupply = useTotalSupply(pair?.liquidityToken);

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO));

  // balance
  const balances = useCurrencyBalances(account ?? undefined, [currency]);
  const currencyBalance = balances[0];

  const parsedAmount = tryParseAmount(typedValue, currency);
  const tradeAmount = tryParseAmount((+typedValue / 2).toString(), currency);

  // Zapping in requires either one or two trades
  // Only one trade if providing one of the input tokens of the pair
  // Two trades if providing neither
  const isTradingCurrency0 =
    currency?.symbol === currency0?.symbol ||
    (currency0?.symbol === WETH[chainId || 1].symbol &&
      currency === Currency.ETHER);
  const isTradingCurrency1 =
    currency?.symbol === currency1?.symbol ||
    (currency1?.symbol === WETH[chainId || 1].symbol &&
      currency === Currency.ETHER);

  const currencyZeroTrade = useTradeExactIn(
    tradeAmount,
    currency0 ?? undefined
  );
  const currencyOneTrade = useTradeExactIn(tradeAmount, currency1 ?? undefined);
  let currencyZeroOutput = currencyZeroTrade?.outputAmount;
  let currencyOneOutput = currencyOneTrade?.outputAmount;
  const bestTradeExactIn = useTradeExactIn(
    tradeAmount,
    !isTradingCurrency0 && !isTradingCurrency1
      ? currency0 ?? undefined
      : isTradingCurrency0
      ? currency1 ?? undefined
      : currency0 ?? undefined
  );

  // We reset the values here in case the user is trading the base tokens.
  // We need to reset because don't have a good way to not call diff # of
  // hooks each render otherwsie
  if (isTradingCurrency0) currencyZeroOutput = tradeAmount;
  if (isTradingCurrency1) currencyOneOutput = tradeAmount;

  const isTradingUnderlying = isTradingCurrency0 || isTradingCurrency1;

  const liquidityMinted = useMemo(() => {
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyZeroOutput, chainId),
      wrappedCurrencyAmount(currencyOneOutput, chainId),
    ];
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB);
    } else {
      return undefined;
    }
  }, [chainId, currencyOneOutput, currencyZeroOutput, pair, totalSupply]);

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(
        liquidityMinted.raw,
        totalSupply.add(liquidityMinted).raw
      );
    } else {
      return undefined;
    }
  }, [liquidityMinted, totalSupply]);

  // get custom setting values for user in bips
  const [allowedSlippage] = useUserSlippageTolerance();

  // get custom tx deadline
  const deadline = useTransactionDeadline();
  // get multihop enabled
  const [singleHopOnly] = useUserSingleHopOnly();

  // TYPES OF TRADES VIA SWAP DATA
  // SWAP EXACT TOKENS FOR TOKENS (when any non ether input)
  // SWAP EXACT ETH FOR TOKENS  (when input is eth and neither currency is weth)
  // 0x0 (when one of the pool underlying tokens)
  // Using a slim abi to improve performance of this call
  const routerIface = new ethers.utils.Interface(ROUTER_ABI_SLIM);
  const pct = basisPointsToPercent(allowedSlippage);
  const zapperAddress = ZAPPER_ADDRESS[chainId];

  const encodeSwapData = () => {
    if (
      !!currencyZeroTrade &&
      !!currencyOneTrade &&
      parsedAmount !== undefined
    ) {
      if (
        currency === Currency.ETHER &&
        currency?.symbol !== currency0?.symbol &&
        currency?.symbol !== currency1?.symbol
      ) {
        return routerIface.encodeFunctionData("swapExactETHForTokens", [
          currencyZeroTrade?.minimumAmountOut(pct).raw.toString(),
          currencyZeroTrade?.route.path.map((t) => t.address),
          zapperAddress,
          deadline,
        ]);
      }

      if (
        currency !== Currency.ETHER &&
        currency?.symbol !== currency0?.symbol &&
        currency?.symbol !== currency1?.symbol
      ) {
        return routerIface.encodeFunctionData("swapExactTokensForTokens", [
          parsedAmount?.raw.toString(),
          currencyZeroTrade?.minimumAmountOut(pct).raw.toString(),
          currencyZeroTrade?.route.path.map((t) => t.address),
          zapperAddress,
          deadline,
        ]);
      }
    }

    return 0x0;
  };

  let error: string | undefined;
  if (!account) {
    error = "Connect Wallet";
  }

  if (singleHopOnly && !isTradingCurrency0 && !isTradingCurrency1) {
    error = "Please enable Multihops";
  }

  if (!parsedAmount) {
    error = error ?? "Enter an amount";
  }

  if (parsedAmount && currencyBalance?.lessThan(parsedAmount)) {
    error = "Insufficient " + currency?.getSymbol(chainId) + " balance";
  }

  return {
    typedValue,
    currency: currencyData,
    currency0: currency0 ?? undefined,
    currency1: currency1 ?? undefined,
    token0,
    token1,
    currencyBalance,
    pair,
    pairState,
    noLiquidity,
    parsedAmount,
    tradeAmount,
    error,
    liquidityMinted,
    poolTokenPercentage,
    currencyZeroOutput,
    currencyOneOutput,
    encodeSwapData,
    isTradingUnderlying,
    bestTrade: bestTradeExactIn ?? undefined,
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { poolAddress: string | undefined; currencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const parsedQs = useParsedQueryString();
  // const parsedQs = {}
  const [result, setResult] = useState<
    | { poolAddress: string | undefined; currencyId: string | undefined }
    | undefined
  >();

  console.log(result);
  console.log(parsedQs);

  useEffect(() => {
    if (!chainId) return;

    setResult({
      poolAddress: parsedQs.poolAddress,
      currencyId: parsedQs.currencyId,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId, parsedQs]);

  return result;
}
