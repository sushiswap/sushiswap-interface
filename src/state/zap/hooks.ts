import { AppDispatch, AppState } from '../index'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Ether,
  JSBI,
  Pair,
  Percent,
  Token,
  Trade,
  TradeType,
  WNATIVE,
  ZAPPER_ADDRESS,
} from '@sushiswap/sdk'
import { Field, typeInput } from './actions'
import { PairState, useV2Pair } from '../../hooks/useV2Pairs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useUserSingleHopOnly,
  useUserSlippageTolerance,
  useUserSlippageToleranceWithDefault,
} from '../../state/user/hooks'

import ROUTER_ABI_SLIM from '../../constants/abis/router-slim.json'
import { basisPointsToPercent } from '../../functions'
import { ethers } from 'ethers'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useCurrencyBalances } from '../wallet/hooks'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import usePool from '../../hooks/usePool'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useV2TradeExactIn } from '../../hooks/useV2Trades'

// import { wrappedCurrencyAmount } from "../../functions/currency/wrappedCurrency";

const ZERO = JSBI.BigInt(0)

export function useZapState(): AppState['zap'] {
  return useSelector<AppState, AppState['zap']>((state) => state.zap)
}

export function useZapActionHandlers(noLiquidity: boolean | undefined): {
  onFieldInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      )
    },
    [dispatch, noLiquidity]
  )

  return {
    onFieldInput,
  }
}

const DEFAULT_ZAP_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export function useDerivedZapInfo(
  currency: Currency | undefined,
  pairAddress: string | undefined
): {
  typedValue: string
  currency: Currency | undefined
  currency0: Currency | undefined
  currency1: Currency | undefined
  token0: string | undefined
  token1: string | undefined
  pair?: Pair | null
  pairState: PairState
  currencyBalance: CurrencyAmount<Currency> | undefined
  parsedAmount: CurrencyAmount<Currency> | undefined
  tradeAmount: CurrencyAmount<Currency> | undefined
  noLiquidity?: boolean
  currencyZeroOutput?: CurrencyAmount<Currency> | undefined
  currencyOneOutput?: CurrencyAmount<Currency> | undefined
  liquidityMinted?: CurrencyAmount<Token>
  poolTokenPercentage?: Percent
  bestTrade?: Trade<Currency, Currency, TradeType>
  encodeSwapData: () => string | number
  isTradingUnderlying: boolean
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue } = useZapState()

  // token
  const currencyData = useMemo(() => currency ?? undefined, [currency])

  // Pool Data
  const { reserves, token0, token1, ratio } = usePool(pairAddress)
  const currency0 = useCurrency(token0)
  const currency1 = useCurrency(token1)

  // pair
  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined)
  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO))

  // balance
  const balances = useCurrencyBalances(account ?? undefined, [currency])
  const currencyBalance = balances[0]

  const parsedAmount = tryParseAmount(typedValue, currency)
  const tradeAmount = tryParseAmount((+typedValue / 2).toString(), currency)

  // Zapping in requires either one or two trades
  // Only one trade if providing one of the input tokens of the pair
  // Two trades if providing neither
  const isTradingCurrency0 =
    currency?.symbol === currency0?.symbol ||
    (currency0?.symbol === WNATIVE[ChainId.MAINNET].symbol && currency === Ether.onChain(ChainId.MAINNET))
  const isTradingCurrency1 =
    currency?.symbol === currency1?.symbol ||
    (currency1?.symbol === WNATIVE[ChainId.MAINNET].symbol && currency === Ether.onChain(ChainId.MAINNET))

  const currencyZeroTrade = useV2TradeExactIn(tradeAmount, currency0 ?? undefined)
  const currencyOneTrade = useV2TradeExactIn(tradeAmount, currency1 ?? undefined)
  let currencyZeroOutput = currencyZeroTrade?.outputAmount
  let currencyOneOutput = currencyOneTrade?.outputAmount
  const bestTradeExactIn = useV2TradeExactIn(
    tradeAmount,
    !isTradingCurrency0 && !isTradingCurrency1
      ? currency0 ?? undefined
      : isTradingCurrency0
      ? currency1 ?? undefined
      : currency0 ?? undefined
  )

  // We reset the values here in case the user is trading the base tokens.
  // We need to reset because don't have a good way to not call diff # of
  // hooks each render otherwsie
  if (isTradingCurrency0) currencyZeroOutput = tradeAmount
  if (isTradingCurrency1) currencyOneOutput = tradeAmount

  const isTradingUnderlying = isTradingCurrency0 || isTradingCurrency1

  const liquidityMinted = useMemo(() => {
    if (pair && totalSupply && currencyZeroOutput && currencyOneOutput) {
      return pair.getLiquidityMinted(totalSupply, currencyZeroOutput.wrapped, currencyOneOutput.wrapped)
    } else {
      return undefined
    }
  }, [currencyZeroOutput, currencyOneOutput, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient)
    } else {
      return undefined
    }
  }, [liquidityMinted, totalSupply])

  // get custom setting values for user in bips
  // const [allowedSlippage] = useUserSlippageTolerance();

  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ZAP_SLIPPAGE_TOLERANCE)

  // get custom tx deadline
  const deadline = useTransactionDeadline()
  // get multihop enabled
  const [singleHopOnly] = useUserSingleHopOnly()

  // TYPES OF TRADES VIA SWAP DATA
  // SWAP EXACT TOKENS FOR TOKENS (when any non ether input)
  // SWAP EXACT ETH FOR TOKENS  (when input is eth and neither currency is weth)
  // 0x0 (when one of the pool underlying tokens)
  // Using a slim abi to improve performance of this call
  const routerIface = new ethers.utils.Interface(ROUTER_ABI_SLIM)
  // const pct = basisPointsToPercent(allowedSlippage);
  const zapperAddress = ZAPPER_ADDRESS[chainId]

  const encodeSwapData = () => {
    if (!!currencyZeroTrade && !!currencyOneTrade && parsedAmount !== undefined) {
      if (currency.isNative && currency?.symbol !== currency0?.symbol && currency?.symbol !== currency1?.symbol) {
        return routerIface.encodeFunctionData('swapExactETHForTokens', [
          currencyZeroTrade?.minimumAmountOut(allowedSlippage).quotient.toString(),
          currencyZeroTrade?.route.path.map((t) => t.address),
          zapperAddress,
          deadline,
        ])
      }

      if (!currency.isNative && currency?.symbol !== currency0?.symbol && currency?.symbol !== currency1?.symbol) {
        return routerIface.encodeFunctionData('swapExactTokensForTokens', [
          parsedAmount?.quotient.toString(),
          currencyZeroTrade?.minimumAmountOut(allowedSlippage).quotient.toString(),
          currencyZeroTrade?.route.path.map((t) => t.address),
          zapperAddress,
          deadline,
        ])
      }
    }

    return 0x0
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (singleHopOnly && !isTradingCurrency0 && !isTradingCurrency1) {
    error = 'Please enable Multihops'
  }

  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  if (parsedAmount && currencyBalance?.lessThan(parsedAmount)) {
    error = 'Insufficient ' + currency?.symbol + ' balance'
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
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { poolAddress: string | undefined; currencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  // const parsedQs = {}
  const [result, setResult] = useState<
    { poolAddress: string | undefined; currencyId: string | undefined } | undefined
  >()

  // console.log(result)
  // console.log(parsedQs)

  useEffect(() => {
    if (!chainId) return

    setResult({
      poolAddress: parsedQs.poolAddress,
      currencyId: parsedQs.currencyId,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId, parsedQs])

  return result
}
