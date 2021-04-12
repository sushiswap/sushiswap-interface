import { Currency, CurrencyAmount, ETHER, JSBI, Pair, Percent, Price, TokenAmount, Trade } from '@sushiswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PairState, usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTradeExactIn } from '../../hooks/Trades'
import { wrappedCurrency, wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'
import usePool from '../../sushi-hooks/queries/usePool'
import { useCurrency } from 'hooks/Tokens'

const ZERO = JSBI.BigInt(0)

export function useZapState(): AppState['zap'] {
  return useSelector<AppState, AppState['zap']>(state => state.zap);
}

export function useZapActionHandlers(
  noLiquidity: boolean | undefined
): {
  onFieldInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  
  const onFieldInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )

  return {
    onFieldInput,
  }
}

export function useDerivedZapInfo(
  currency: Currency | undefined,
  pairAddress: string | undefined,
): {
  currency:  Currency | undefined
  pair?: Pair | null
  pairState: PairState
  currencyBalance: CurrencyAmount | undefined
  parsedAmount: CurrencyAmount | undefined
  tradeAmount: CurrencyAmount | undefined
  noLiquidity?: boolean
  currencyZeroOutput?: CurrencyAmount | undefined
  currencyOneOutput?: CurrencyAmount | undefined
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  bestTrade?: Trade
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue } = useZapState()

  // token
  const currencyData = useMemo(
    () => currency ?? undefined,
    [currency]
  )

  // Pool Data
  const { token0, token1 } = usePool(pairAddress)
  const currency0 = useCurrency(token0)
  const currency1 = useCurrency(token1)

  // pair
  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  // balance
  const balances = useCurrencyBalances(account ?? undefined, [
    currency
  ])
  const currencyBalance = balances[0]

  const parsedAmount = tryParseAmount(typedValue, currency);

  // This math is currently incorrect
  // Shouldn't be diving by 2
  // Should instead be determining the x to y ratio
  const tradeAmount = tryParseAmount(
    (+typedValue / 2).toString(),
    currency
  );

  // Zapping in requires either one or two trades
  // Only one trade if providing one of the input tokens of the pair
  // Two trades if providing neither
  const isTradingCurrency0 = currency?.symbol === currency0?.symbol
  const isTradingCurrency1 = 
    currency?.symbol === currency1?.symbol 
    || currency === ETHER

  let currencyZeroOutput = useTradeExactIn(
      tradeAmount,
      currency0 ?? undefined
    )?.outputAmount
  let currencyOneOutput = useTradeExactIn(
      tradeAmount, 
      currency1 ?? undefined
    )?.outputAmount
  const bestTradeExactIn = useTradeExactIn(
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

  const liquidityMinted = useMemo(() => {
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyZeroOutput, chainId),
      wrappedCurrencyAmount(currencyOneOutput, chainId)
    ]
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
    } else {
      return undefined
    }
  }, [chainId, parsedAmount])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    } else {
      return undefined
    }
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  if (parsedAmount && currencyBalance?.lessThan(parsedAmount)) {
    error = 'Insufficient ' + currency?.getSymbol(chainId) + ' balance'
  }

  return {
    currency: currencyData,
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
    bestTrade: bestTradeExactIn ?? undefined
  }
}