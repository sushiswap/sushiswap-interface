import { useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, JSBI, Percent, Price, Token, ZERO } from '@sushiswap/core-sdk'
import { ONE_HUNDRED_PERCENT } from '../../../../constants'
import {
  currentLiquidityValueSelector,
  currentPoolShareSelector,
  noLiquiditySelector,
  poolAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../atoms'
import { useMemo } from 'react'

export const usePoolDetails = (parsedAmounts: (CurrencyAmount<Currency> | undefined)[]) => {
  const [currencyAAmount, currencyBAmount] = parsedAmounts
  const [, pool] = useRecoilValue(poolAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const poolBalance = useRecoilValue(poolBalanceAtom)

  // Returns the current pool share before execution
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)

  // Returns the current deposited tokens before execution
  const currentLiquidityValue = useRecoilValue(currentLiquidityValueSelector)

  // Returns the SLP that will get minted given current input amounts
  const liquidityMinted = useMemo(() => {
    const [tokenAmountA, tokenAmountB] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped]
    if (pool && totalSupply && tokenAmountA?.greaterThan(0) && tokenAmountB?.greaterThan(0)) {
      try {
        return pool.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [currencyAAmount?.wrapped, currencyBAmount?.wrapped, pool, totalSupply])

  // Returns the resulting pool share after execution
  const poolShare = useMemo(() => {
    if (liquidityMinted && totalSupply && poolBalance) {
      return new Percent(poolBalance.add(liquidityMinted).quotient, totalSupply.add(liquidityMinted).quotient)
    }

    return undefined
  }, [liquidityMinted, poolBalance, totalSupply])

  const price = useMemo(() => {
    if (noLiquidity) {
      if (currencyAAmount?.greaterThan(0) && currencyBAmount?.greaterThan(0)) {
        const value = currencyBAmount.divide(currencyAAmount)
        return new Price(currencyAAmount.currency, currencyBAmount.currency, value.denominator, value.numerator)
      }
    } else {
      return pool && currencyAAmount?.wrapped ? pool.priceOf(currencyAAmount?.currency.wrapped) : undefined
    }
    return undefined
  }, [currencyAAmount, currencyBAmount, noLiquidity, pool])

  const priceImpact = useMemo(() => {
    const [wrappedAAmount, wrappedBAmount] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped]

    if (!wrappedAAmount || !wrappedBAmount || !currencyAAmount || !currencyBAmount) return undefined
    if (!currencyAAmount.currency.equals(currencyBAmount.currency)) return undefined
    if (JSBI.equal(wrappedAAmount.quotient, ZERO)) return undefined
    const pct = ONE_HUNDRED_PERCENT.subtract(wrappedBAmount.divide(wrappedAAmount))
    return new Percent(pct.numerator, pct.denominator)
  }, [currencyAAmount, currencyBAmount])

  // Returns the resulting deposited tokens after execution
  const liquidityValue = useMemo(() => {
    if (pool && totalSupply && currencyAAmount && currencyBAmount) {
      const [tokenAmountA, tokenAmountB] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped]
      return [currentLiquidityValue[0]?.add(tokenAmountA), currentLiquidityValue[1]?.add(tokenAmountB)]
    }

    return [undefined, undefined]
  }, [currencyAAmount, currencyBAmount, currentLiquidityValue, pool, totalSupply])

  return useMemo(
    () => ({
      poolShare,
      currentPoolShare,
      liquidityMinted,
      liquidityValue,
      currentLiquidityValue,
      price,
      priceImpact,
    }),
    [currentLiquidityValue, currentPoolShare, liquidityMinted, liquidityValue, poolShare, price, priceImpact]
  )
}

export const usePoolDetailsRemove = (slpAmount: CurrencyAmount<Token>) => {
  const [, pool] = useRecoilValue(poolAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)

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
    if (pool && totalSupply && poolBalance && poolShare && currentLiquidityValue[0] && currentLiquidityValue[1]) {
      return [
        currentLiquidityValue[0].subtract(
          pool.getLiquidityValue(pool.token0, totalSupply, poolBalance.multiply(poolShare))
        ),
        currentLiquidityValue[1].subtract(
          pool.getLiquidityValue(pool.token1, totalSupply, poolBalance.multiply(poolShare))
        ),
      ]
    }

    return [undefined, undefined]
  }, [currentLiquidityValue, pool, poolBalance, poolShare, totalSupply])

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
