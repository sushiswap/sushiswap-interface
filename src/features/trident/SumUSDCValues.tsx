import { FC, ReactNode, useEffect } from 'react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { atom, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'

const sumUSDCValuesStateAtom = atom<Record<string, CurrencyAmount<Currency>>>({
  key: 'sumUSDCValuesStateAtom',
  default: {},
})

interface USDCValueProps {
  amount: CurrencyAmount<Currency>
}

const USDCValue: FC<USDCValueProps> = ({ amount }) => {
  const usdcValue = useUSDCValue(amount)
  const update = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const values = { ...(await snapshot.getPromise(sumUSDCValuesStateAtom)) }
        values[amount?.wrapped.currency.address] = usdcValue
      },
    [amount?.wrapped.currency.address, usdcValue]
  )

  useEffect(() => {
    update()
  }, [update])

  return <></>
}

interface SumUSDCValuesProps {
  amounts: CurrencyAmount<Currency>[]
  children: ({ amount, loading }: { amount: CurrencyAmount<Currency>; loading: boolean }) => ReactNode
}

const SumUSDCValues: FC<SumUSDCValuesProps> = ({ amounts, children }) => {
  const state = useRecoilValue(sumUSDCValuesStateAtom)
  const values = Object.values(state)
  const loading = !(values.length === amounts.length && values.every((el) => el.greaterThan(0)))
  const amount = loading ? null : values.reduce((acc, cur) => acc.add(cur))

  return (
    <>
      {amounts.map((el, index) => (
        <USDCValue amount={el} key={index} />
      ))}
      {children({ amount, loading })}
    </>
  )
}

export default SumUSDCValues
