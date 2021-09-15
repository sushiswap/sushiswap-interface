import { useRecoilValue } from 'recoil'
import { JSBI, Percent, Price, ZERO } from '@sushiswap/sdk'
import { ONE_HUNDRED_PERCENT } from '../../../../constants'
import { currentPoolShareSelector, noLiquiditySelector, poolAtom, poolBalanceAtom, totalSupplyAtom } from '../atoms'
import { useMemo } from 'react'

export const usePoolDetails = (parsedAmounts) => {
  const [currencyAAmount, currencyBAmount] = parsedAmounts
  const [, pool] = useRecoilValue(poolAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const poolBalance = useRecoilValue(poolBalanceAtom)

  // Returns the current pool share not taking into account current input values
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)

  // Returns the SLP that will get minted given current input amounts
  const liquidityMinted = useMemo(() => {
    const [tokenAmountA, tokenAmountB] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped]
    if (pool && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pool.getLiquidityMinted(totalSupply?.wrapped, tokenAmountA, tokenAmountB)
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [currencyAAmount?.wrapped, currencyBAmount?.wrapped, pool, totalSupply])

  // Returns the resulting pool share taking into account current pool share and inputs
  const poolShare = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient)
    }

    return undefined
  }, [liquidityMinted, totalSupply])

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

    if (!wrappedAAmount || !wrappedBAmount) return undefined
    if (!currencyAAmount.currency.equals(currencyBAmount.currency)) return undefined
    if (JSBI.equal(wrappedAAmount.quotient, ZERO)) return undefined
    const pct = ONE_HUNDRED_PERCENT.subtract(wrappedBAmount.divide(wrappedAAmount))
    return new Percent(pct.numerator, pct.denominator)
  }, [currencyAAmount, currencyBAmount])

  // Returns the currency liquidity value expressed in underlying tokens not taking into account input values
  const currentLiquidityValue = useMemo(() => {
    if (pool && poolBalance && totalSupply) {
      return [
        pool.getLiquidityValue(pool.token0, totalSupply?.wrapped, poolBalance?.wrapped),
        pool.getLiquidityValue(pool.token1, totalSupply?.wrapped, poolBalance?.wrapped),
      ]
    }

    return [undefined, undefined]
  }, [pool, poolBalance, totalSupply])

  // Returns the currency liquidity value expressed in underlying tokens also taking into account current input values
  const liquidityValue = useMemo(() => {
    if (pool && currencyAAmount && currencyBAmount) {
      const [currentAAmount, currentBAmount] = currentLiquidityValue
      return [
        currentAAmount ? currencyAAmount.add(currentAAmount) : currencyAAmount,
        currentBAmount ? currencyBAmount.add(currentBAmount) : currencyBAmount,
      ]
    }

    return [undefined, undefined]
  }, [currencyAAmount, currencyBAmount, currentLiquidityValue, pool])

  return {
    poolShare,
    currentPoolShare,
    liquidityMinted,
    liquidityValue,
    currentLiquidityValue,
    price,
    priceImpact,
  }
}
