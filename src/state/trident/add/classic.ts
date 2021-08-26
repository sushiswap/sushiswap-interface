import { atom, useRecoilCallback } from 'recoil'

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export const classicPoolAddLiquidityState = atom({
  key: 'classicPoolAddLiquidityState',
  default: {
    typedValue: '',
    otherTypedValue: '',
    independentField: Field.CURRENCY_A,
    spendFromWallet: true,
  },
})

export const classicPoolAddLiquidityDispatcherState = atom<Dispatcher | undefined>({
  key: 'dispatcherState',
  default: undefined,
})

export const useCreateClassicPoolAddLiquidityDispatcher = () => {
  const onFieldInput = useRecoilCallback(({ set }) => (typedValue: string, field: Field, noLiquidity: boolean) => {
    set(classicPoolAddLiquidityState, (oldState) => {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === oldState.independentField) {
          return {
            ...oldState,
            independentField: field,
            typedValue,
          }
        }
        // they're typing into a new field, store the other value
        else {
          return {
            ...oldState,
            independentField: field,
            typedValue,
            otherTypedValue: oldState.typedValue,
          }
        }
      } else {
        return {
          ...oldState,
          independentField: field,
          typedValue,
          otherTypedValue: '',
        }
      }
    })
  })

  const setSpendFromWallet = useRecoilCallback(({ set }) => (spendFromWallet: boolean) => {
    set(classicPoolAddLiquidityState, (oldState) => ({
      ...oldState,
      spendFromWallet,
    }))
  })

  return {
    onFieldInput,
    setSpendFromWallet,
  }
}

export type Dispatcher = ReturnType<typeof useCreateClassicPoolAddLiquidityDispatcher>
