import { Currency, CurrencyAmount, ETHER, JSBI, Pair, Percent, Price, TokenAmount } from '@sushiswap/sdk'
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
  // dependentField: Field
  currency:  Currency | undefined
  pair?: Pair | null
  pairState: PairState
  currencyBalance: CurrencyAmount | undefined
  parsedAmount: CurrencyAmount | undefined
  tradeAmount: CurrencyAmount | undefined
  // price?: Price
  noLiquidity?: boolean
  currencyZeroOutput?: CurrencyAmount | undefined
  currencyOneOutput?: CurrencyAmount | undefined
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  estimatedSlippage?: any
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
  const isTradingCurrency0 = currency?.symbol === currency0?.symbol ? true : false

  const currencyZeroOutput = isTradingCurrency0
    ? tradeAmount
    : useTradeExactIn(
      tradeAmount,
      currency0 ?? undefined
    )?.outputAmount
  const currencyOneOutput = isTradingCurrency0
    ? useTradeExactIn(
        tradeAmount, 
        currency1 ?? undefined
      )?.outputAmount
    : tradeAmount
  const bestTradeExactIn = useTradeExactIn(
    tradeAmount, 
    isTradingCurrency0 
      ? currency1 ?? undefined
      : currency0 ?? undefined
    )

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

  // We should check here which route is better (token0 or token1)
  // And provide that to the zap in contract as the swap target 
  // const estimatedOutputValue = tryParseAmount((+typedValue * 0.000000002).toString(), currency)

  // // // liquidity minted
  // const liquidityMined = useMemo(() => {
  //   // const {  }
  // })

  // const liquidityMinted = useMemo(() => {
  //   const { [Field.CURRENCY]: currencyAAmount, [Field.CURRENCY]: currencyBAmount } = parsedAmounts
  //   const [tokenAmountA, tokenAmountB] = [
  //     wrappedCurrencyAmount(currencyAAmount, chainId),
  //     wrappedCurrencyAmount(currencyBAmount, chainId)
  //   ]
  //   if (pair && totalSupply && tokenAmountA && tokenAmountB) {
  //     return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
  //   } else {
  //     return undefined
  //   }
  // }, [chainId, pair, totalSupply])

  // const poolTokenPercentage = useMemo(() => {
  //   if (liquidityMinted && totalSupply) {
  //     return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
  //   } else {
  //     return undefined
  //   }
  // }, [liquidityMinted, totalSupply])

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
    estimatedSlippage: bestTradeExactIn?.priceImpact
  }
}