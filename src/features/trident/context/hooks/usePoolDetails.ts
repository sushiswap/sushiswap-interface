import { useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount, Percent, Price, Token } from '@sushiswap/core-sdk'
import {
  bentoboxRebasesAtom,
  currentLiquidityValueSelector,
  currentPoolShareSelector,
  DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE,
  noLiquiditySelector,
  poolAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../atoms'
import { useMemo } from 'react'
import { toAmountCurrencyAmount, toShareCurrencyAmount } from '../../../../functions'
import useParsedAmountsWithSlippage from './useParsedAmountsWithSlippage'

export const usePoolDetails = (parsedAmounts: (CurrencyAmount<Currency> | undefined)[]) => {
  const [, pool] = useRecoilValue(poolAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const [minAmountA, minAmountB] = useParsedAmountsWithSlippage(
    parsedAmounts,
    noLiquidity,
    DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE
  )

  // Returns the current pool share before execution
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)

  // Returns the current deposited tokens before execution
  const currentLiquidityValue = useRecoilValue(currentLiquidityValueSelector)

  // Returns the minimum SLP that will get minted given current input amounts
  const liquidityMinted = useMemo(() => {
    if (pool && totalSupply && minAmountA?.greaterThan(0) && minAmountB?.greaterThan(0) && rebases[0] && rebases[1]) {
      try {
        return pool.getLiquidityMinted(
          totalSupply,
          toShareCurrencyAmount(rebases[0], minAmountA?.wrapped),
          toShareCurrencyAmount(rebases[1], minAmountB?.wrapped)
        )
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [minAmountA, minAmountB, pool, rebases, totalSupply])

  // Returns the resulting pool share after execution
  const poolShare = useMemo(() => {
    if (liquidityMinted && totalSupply && poolBalance) {
      return new Percent(poolBalance.add(liquidityMinted).quotient, totalSupply.add(liquidityMinted).quotient)
    }

    return undefined
  }, [liquidityMinted, poolBalance, totalSupply])

  const price = useMemo(() => {
    if (noLiquidity) {
      if (minAmountA?.greaterThan(0) && minAmountB?.greaterThan(0)) {
        const value = minAmountB.divide(minAmountA)
        return new Price(minAmountA.currency, minAmountB.currency, value.denominator, value.numerator)
      }
    } else {
      return pool && minAmountA?.wrapped ? pool.priceOf(minAmountA?.currency.wrapped) : undefined
    }
    return undefined
  }, [minAmountA, minAmountB, noLiquidity, pool])

  // Returns the resulting deposited tokens after execution
  const liquidityValue = useMemo(() => {
    if (pool && totalSupply && minAmountA && minAmountB) {
      return [currentLiquidityValue[0]?.add(minAmountA.wrapped), currentLiquidityValue[1]?.add(minAmountB.wrapped)]
    }

    return [undefined, undefined]
  }, [currentLiquidityValue, minAmountA, minAmountB, pool, totalSupply])

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
