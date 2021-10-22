import { useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, Price, Token, ZERO } from '@sushiswap/core-sdk'
import {
  bentoboxRebasesAtom,
  currentLiquidityValueSelector,
  currentPoolShareSelector,
  DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE,
  DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE,
  noLiquiditySelector,
  poolAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../atoms'
import { useMemo } from 'react'
import { calculateSlippageAmount, toAmountCurrencyAmount, toShareCurrencyAmount } from '../../../../functions'
import { ZERO_PERCENT } from '../../../../constants'
import { useUserSlippageToleranceWithDefault } from '../../../../state/user/hooks'
import useCurrenciesFromURL from './useCurrenciesFromURL'

export const usePoolDetailsMint = (
  parsedAmounts: (CurrencyAmount<Currency> | undefined)[] | undefined,
  defaultSlippage: Percent = DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE
) => {
  const [, pool] = useRecoilValue(poolAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const slippage = useUserSlippageToleranceWithDefault(defaultSlippage)
  const { currencies } = useCurrenciesFromURL()

  // Returns the current pool share before execution
  const poolShareBefore = useRecoilValue(currentPoolShareSelector)

  // Returns the current deposited tokens before execution
  const liquidityValueBefore = useRecoilValue(currentLiquidityValueSelector)

  // Returns the minimum SLP that will get minted given current input amounts
  const liquidityMinted = useMemo(() => {
    if (
      pool &&
      totalSupply &&
      currencies[0] &&
      currencies[1] &&
      rebases[currencies[0].wrapped.address] &&
      rebases[currencies[1].wrapped.address]
    ) {
      const amountA = toShareCurrencyAmount(
        rebases[currencies[0].wrapped.address],
        parsedAmounts && parsedAmounts[0]
          ? parsedAmounts[0].wrapped
          : // TODO ramin, pool tokens are sorted, parsed amounts aren't
            CurrencyAmount.fromRawAmount(currencies[0], '0').wrapped
      )

      const amountB = toShareCurrencyAmount(
        rebases[currencies[1].wrapped.address],
        parsedAmounts && parsedAmounts[1]
          ? parsedAmounts[1].wrapped
          : CurrencyAmount.fromRawAmount(currencies[1], '0').wrapped
      )

      // Both can't be zero
      if (amountA.equalTo(ZERO) && amountB.equalTo(ZERO)) return undefined

      try {
        const slp = pool.getLiquidityMinted(totalSupply, amountA, amountB)
        const minSLP = calculateSlippageAmount(slp, noLiquidity ? ZERO_PERCENT : slippage)[0]
        return CurrencyAmount.fromRawAmount(slp.currency, minSLP.toString())
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [currencies, noLiquidity, parsedAmounts, pool, rebases, slippage, totalSupply])

  // Returns the resulting pool share after execution
  const poolShareAfter = useMemo(() => {
    if (liquidityMinted && totalSupply && poolBalance) {
      return new Percent(poolBalance.add(liquidityMinted).quotient, totalSupply.add(liquidityMinted).quotient)
    }

    return undefined
  }, [liquidityMinted, poolBalance, totalSupply])

  const price = useMemo(() => {
    if (noLiquidity) {
      if (parsedAmounts?.[0]?.greaterThan(0) && parsedAmounts?.[1]?.greaterThan(0)) {
        const value = parsedAmounts[1].divide(parsedAmounts[0])
        return new Price(parsedAmounts[0].currency, parsedAmounts[1].currency, value.denominator, value.numerator)
      }
    } else if (parsedAmounts?.[1]) {
      return pool && parsedAmounts[0]?.wrapped ? pool.priceOf(parsedAmounts[1]?.currency.wrapped) : undefined
    }
    return undefined
  }, [noLiquidity, parsedAmounts, pool])

  return useMemo(
    () => ({
      poolShareBefore,
      poolShareAfter,
      liquidityMinted,
      liquidityValueBefore,
      price,
    }),
    [poolShareBefore, poolShareAfter, liquidityMinted, liquidityValueBefore, price]
  )
}

export const usePoolDetailsBurn = (
  slpAmount: CurrencyAmount<Token> | undefined,
  defaultSlippage: Percent = DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE
) => {
  const [, pool] = useRecoilValue(poolAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const slippage = useUserSlippageToleranceWithDefault(defaultSlippage)
  const { currencies } = useCurrenciesFromURL()

  // Returns the current pool share before execution
  const poolShareBefore = useRecoilValue(currentPoolShareSelector)

  // Returns the current deposited tokens before execution
  const liquidityValueBefore = useRecoilValue(currentLiquidityValueSelector)

  // Returns the resulting pool share after execution
  const poolShareAfter = useMemo(() => {
    if (slpAmount && totalSupply && poolBalance) {
      return new Percent(poolBalance.subtract(slpAmount).quotient, totalSupply.subtract(slpAmount).quotient)
    }

    return undefined
  }, [poolBalance, slpAmount, totalSupply])

  // Returns the resulting withdrawn tokens after execution
  const liquidityValueAfter = useMemo(() => {
    if (
      slpAmount &&
      pool &&
      totalSupply &&
      liquidityValueBefore[0] &&
      liquidityValueBefore[1] &&
      rebases[liquidityValueBefore[0].currency.wrapped.address] &&
      rebases[liquidityValueBefore[1].currency.wrapped.address]
    ) {
      return [
        liquidityValueBefore[0].subtract(
          toAmountCurrencyAmount(
            rebases[liquidityValueBefore[0].currency.wrapped.address],
            pool.getLiquidityValue(liquidityValueBefore[0].currency, totalSupply, slpAmount)
          )
        ),
        liquidityValueBefore[1].subtract(
          toAmountCurrencyAmount(
            rebases[liquidityValueBefore[1].currency.wrapped.address],
            pool.getLiquidityValue(liquidityValueBefore[1].currency, totalSupply, slpAmount)
          )
        ),
      ]
    }

    return [undefined, undefined]
  }, [liquidityValueBefore, pool, rebases, slpAmount, totalSupply])

  const minLiquidityOutput = useMemo(() => {
    if (
      pool &&
      totalSupply &&
      slpAmount &&
      currencies[0] &&
      currencies[1] &&
      rebases[pool.token0.wrapped.address] &&
      rebases[pool.token1.wrapped.address]
    ) {
      const amounts = [
        calculateSlippageAmount(pool.getLiquidityValue(pool.token0, totalSupply, slpAmount), slippage)[0],
        calculateSlippageAmount(pool.getLiquidityValue(pool.token1, totalSupply, slpAmount), slippage)[0],
      ]

      return [
        toAmountCurrencyAmount(
          rebases[pool.token0.wrapped.address],
          CurrencyAmount.fromRawAmount(pool.token0, amounts[0].toString())
        ),
        toAmountCurrencyAmount(
          rebases[pool.token1.wrapped.address],
          CurrencyAmount.fromRawAmount(pool.token1, amounts[1].toString())
        ),
      ]
    }

    return [undefined, undefined]
  }, [currencies, pool, rebases, slippage, slpAmount, totalSupply])

  return useMemo(
    () => ({
      poolShareBefore,
      poolShareAfter,
      liquidityValueAfter,
      minLiquidityOutput,
      liquidityValueBefore,
    }),
    [poolShareBefore, poolShareAfter, liquidityValueAfter, minLiquidityOutput, liquidityValueBefore]
  )
}
