import { Currency, CurrencyAmount, JSBI, Pair, Percent, Token, ZERO } from '@sushiswap/sdk'
import { Field, typeInput } from './actions'
import { useAppDispatch, useAppSelector } from '../hooks'

import { AppState } from '../index'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { useLingui } from '@lingui/react'
import { useTokenBalances } from '../wallet/hooks'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { useV2Pair } from '../../hooks/useV2Pairs'

export function useBurnState(): AppState['burn'] {
  return useAppSelector((state) => state.burn)
}

export function useDerivedBurnInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): {
  pair?: Pair | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  }
  error?: string
  userLiquidity: CurrencyAmount<Token> | undefined
} {
  const { account, chainId } = useActiveWeb3React()

  const { i18n } = useLingui()

  const { independentField, typedValue } = useBurnState()

  // pair + totalsupply
  const [, pair] = useV2Pair(currencyA, currencyB)

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pair?.liquidityToken])
  const userLiquidity: undefined | CurrencyAmount<Token> = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken,
  }

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.quotient, userLiquidity.quotient)
      ? CurrencyAmount.fromRawAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).quotient)
      : undefined

  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.quotient, userLiquidity.quotient)
      ? CurrencyAmount.fromRawAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).quotient)
      : undefined

  const liquidityValues: {
    [Field.CURRENCY_A]?: CurrencyAmount<Token>
    [Field.CURRENCY_B]?: CurrencyAmount<Token>
  } = {
    [Field.CURRENCY_A]: liquidityValueA,
    [Field.CURRENCY_B]: liquidityValueB,
  }

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }
  // user specified a specific amount of liquidity tokens
  else if (independentField === Field.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken)
      if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
        percentToRemove = new Percent(independentAmount.quotient, userLiquidity.quotient)
      }
    }
  }
  // user specified a specific amount of token a or b
  else {
    if (tokens[independentField]) {
      const independentAmount = tryParseAmount(typedValue, tokens[independentField])
      const liquidityValue = liquidityValues[independentField]
      if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
        percentToRemove = new Percent(independentAmount.quotient, liquidityValue.quotient)
      }
    }
  }

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
        ? CurrencyAmount.fromRawAmount(
            userLiquidity.currency,
            percentToRemove.multiply(userLiquidity.quotient).quotient
          )
        : undefined,
    [Field.CURRENCY_A]:
      tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
        ? CurrencyAmount.fromRawAmount(tokenA, percentToRemove.multiply(liquidityValueA.quotient).quotient)
        : undefined,
    [Field.CURRENCY_B]:
      tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
        ? CurrencyAmount.fromRawAmount(tokenB, percentToRemove.multiply(liquidityValueB.quotient).quotient)
        : undefined,
  }

  let error: string | undefined
  if (!account) {
    error = i18n._(t`Connect Wallet`)
  }

  if (!parsedAmounts[Field.LIQUIDITY] || !parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? i18n._(t`Enter an amount`)
  }

  if (parsedAmounts[Field.CURRENCY_A]?.equalTo(ZERO) && parsedAmounts[Field.CURRENCY_B]?.equalTo(ZERO)) {
    error = error ?? i18n._(t`Insufficient SLP balance`)
  }

  return { pair, parsedAmounts, error, userLiquidity }
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useAppDispatch()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput,
  }
}
