import { useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, Price, Token, ZERO } from '@sushiswap/core-sdk'
import {
  bentoboxRebasesAtom,
  currentLiquidityValueSelector,
  currentPoolShareSelector,
  fixedRatioAtom,
  noLiquiditySelector,
  poolAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../atoms'
import { useMemo } from 'react'
import { calculateSlippageAmount, toAmountCurrencyAmount, toShareCurrencyAmount } from '../../../../functions'
import { ZERO_PERCENT } from '../../../../constants'

export const usePoolDetails = (
  parsedAmounts: (CurrencyAmount<Currency> | undefined)[] | undefined,
  slippage: Percent
) => {
  const [, pool] = useRecoilValue(poolAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)

  // Returns the current pool share before execution
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)

  // Returns the current deposited tokens before execution
  const currentLiquidityValue = useRecoilValue(currentLiquidityValueSelector)

  // Returns the minimum SLP that will get minted given current input amounts
  const liquidityMinted = useMemo(() => {
    if (pool && totalSupply && rebases[0] && rebases[1]) {
      const amountA = toShareCurrencyAmount(
        rebases[0],
        parsedAmounts && parsedAmounts[0]
          ? parsedAmounts[0].wrapped
          : CurrencyAmount.fromRawAmount(pool.token0, '0').wrapped
      )

      const amountB = toShareCurrencyAmount(
        rebases[1],
        parsedAmounts && parsedAmounts[1]
          ? parsedAmounts[1].wrapped
          : CurrencyAmount.fromRawAmount(pool.token1, '0').wrapped
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
  }, [noLiquidity, parsedAmounts, pool, rebases, slippage, totalSupply])

  // Returns the resulting pool share after execution
  const poolShare = useMemo(() => {
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

  // Returns the resulting deposited tokens after execution
  const liquidityValue = useMemo(() => {
    if (
      rebases[0] &&
      rebases[1] &&
      pool &&
      totalSupply &&
      parsedAmounts?.[0] &&
      parsedAmounts?.[1] &&
      liquidityMinted
    ) {
      return [
        currentLiquidityValue[0]?.add(parsedAmounts[0].wrapped),
        currentLiquidityValue[1]?.add(parsedAmounts[1].wrapped),
      ]
    }

    return [undefined, undefined]
  }, [currentLiquidityValue, liquidityMinted, parsedAmounts, pool, rebases, totalSupply])

  return useMemo(
    () => ({
      poolShare,
      currentPoolShare,
      liquidityMinted,
      liquidityValue,
      currentLiquidityValue,
      price,
    }),
    [currentLiquidityValue, currentPoolShare, liquidityMinted, liquidityValue, poolShare, price]
  )
}

export const usePoolDetailsRemove = (slpAmount?: CurrencyAmount<Token>) => {
  const [, pool] = useRecoilValue(poolAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)

  // Returns the current pool share before execution
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)

  // Returns the current deposited tokens before execution
  const currentLiquidityValue = useRecoilValue(currentLiquidityValueSelector)

  // Returns the resulting pool share after execution
  const poolShare = useMemo(() => {
    if (slpAmount && totalSupply && poolBalance) {
      return new Percent(poolBalance.subtract(slpAmount).quotient, totalSupply.subtract(slpAmount).quotient)
    }

    return undefined
  }, [poolBalance, slpAmount, totalSupply])

  // Returns the resulting deposited tokens after execution
  const liquidityValue = useMemo(() => {
    if (
      slpAmount &&
      pool &&
      totalSupply &&
      poolBalance &&
      poolShare &&
      currentLiquidityValue[0] &&
      currentLiquidityValue[1] &&
      rebases[0] &&
      rebases[1]
    ) {
      return [
        currentLiquidityValue[0].subtract(
          toAmountCurrencyAmount(rebases[0], pool.getLiquidityValue(pool.token0, totalSupply, slpAmount))
        ),
        currentLiquidityValue[1].subtract(
          toAmountCurrencyAmount(rebases[1], pool.getLiquidityValue(pool.token1, totalSupply, slpAmount))
        ),
      ]
    }

    return [undefined, undefined]
  }, [currentLiquidityValue, pool, poolBalance, poolShare, rebases, slpAmount, totalSupply])

  return useMemo(
    () => ({
      currentPoolShare,
      liquidityValue,
      currentLiquidityValue,
      poolShare,
    }),
    [currentLiquidityValue, currentPoolShare, liquidityValue, poolShare]
  )
}
