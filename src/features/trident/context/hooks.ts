import { ConstantProductPool, Currency, CurrencyAmount, JSBI } from '../../../../../sushiswap-sdk'
import { tryParseAmount } from '../../../functions'
import { useMemo } from 'react'
import { ConstantProductPoolState } from '../../../hooks/useTridentClassicPools'
import { useTotalSupply } from '../../../hooks/useTotalSupply'
import { Field } from '../../../state/trident/add/classic'
import { useRecoilValue } from 'recoil'
import { poolAtom } from '../add/classic/context/atoms'

const ZERO = JSBI.BigInt(0)

interface UseTridentAddClassicMintInfoProps {
  currencies: Currency[]
  typedValue: string
  otherTypedValue: string
  independentField: Field
}

const useTridentAddClassicMintInfo = ({
  currencies,
  typedValue,
  otherTypedValue,
  independentField,
}: UseTridentAddClassicMintInfoProps) => {
  const [poolState, pool] = useRecoilValue(poolAtom)
  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A
  const totalSupply = useTotalSupply(pool?.liquidityToken)

  const noLiquidity =
    poolState === ConstantProductPoolState.NOT_EXISTS ||
    Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO)) ||
    Boolean(
      poolState === ConstantProductPoolState.EXISTS &&
        pool &&
        JSBI.equal(pool.reserve0.quotient, ZERO) &&
        JSBI.equal(pool.reserve1.quotient, ZERO)
    )

  const independentAmount = useMemo(
    () => tryParseAmount(typedValue, currencies[independentField]),
    [currencies, independentField, typedValue]
  )

  const dependentAmount = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField])
      }
      return undefined
    } else if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = independentAmount?.wrapped
      const [tokenA, tokenB] = [currencies[Field.CURRENCY_A]?.wrapped, currencies[Field.CURRENCY_B]?.wrapped]
      if (tokenA && tokenB && wrappedIndependentAmount && pool) {
        const dependentCurrency =
          dependentField === Field.CURRENCY_B ? currencies[Field.CURRENCY_B] : currencies[Field.CURRENCY_A]
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pool.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pool.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency?.isNative
          ? CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient)
          : dependentTokenAmount
      }
      return undefined
    } else {
      return undefined
    }
  }, [noLiquidity, independentAmount, otherTypedValue, currencies, dependentField, pool])

  const parsedAmounts = useMemo(() => {
    return {
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    }
  }, [dependentAmount, independentAmount, independentField])

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, noLiquidity, otherTypedValue, parsedAmounts, typedValue]
  )

  return {
    dependentField,
    noLiquidity,
    parsedAmounts,
    formattedAmounts,
  }
}

export default useTridentAddClassicMintInfo
