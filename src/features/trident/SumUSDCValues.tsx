import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { useUSDCValue } from '../../hooks/useUSDCPrice'

// Dummy component that fetches usdcValue
const USDCValue: FC<{ amount: CurrencyAmount<Currency>; update(address: string, value: CurrencyAmount<Currency>) }> = ({
  amount,
  update,
}) => {
  const usdcValue = useUSDCValue(amount)

  useEffect(() => {
    if (amount?.currency.wrapped.address && usdcValue) {
      update(amount?.currency.wrapped.address, usdcValue)
    }
  }, [amount?.currency.wrapped.address, update, usdcValue])

  return <></>
}

interface SumUSDCValuesProps {
  amounts: CurrencyAmount<Currency>[]
  children: ({ amount, loading }: { amount: CurrencyAmount<Currency> | null; loading: boolean }) => ReactNode
}

const SumUSDCValues: FC<SumUSDCValuesProps> = ({ amounts, children }) => {
  const [state, setState] = useState<Record<string, CurrencyAmount<Currency> | null>>({})
  const update = useCallback((address, value) => {
    setState((prevState) => ({
      ...prevState,
      [address]: value,
    }))
  }, [])

  const values = useMemo(() => Object.values(state), [state])

  const loading = useMemo(
    () => !(values.length === amounts.length && values.every((el) => el?.greaterThan(0))),
    [amounts.length, values]
  )

  const amount = useMemo(
    () =>
      loading
        ? null
        : values.reduce((acc, cur) => {
            if (acc && cur) {
              acc.add(cur)
            }

            return acc
          }),
    [loading, values]
  )

  return (
    <>
      {amounts.map((el, index) => (
        <USDCValue amount={el} key={index} update={update} />
      ))}
      {children({ amount, loading })}
    </>
  )
}

export default SumUSDCValues
