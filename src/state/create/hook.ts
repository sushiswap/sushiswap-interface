import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import { useCallback } from 'react'

import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppState } from '../index'
import { Field, selectCurrency, switchCurrencies, typeInput } from './actions'

export function useCreateState(): AppState['create'] {
  return useAppSelector((state) => state.create)
}

export function useCreateActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'ETH' : '',
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  }
}

export function useDerivedCreateInfo(): {
  currencies: { [field in Field]?: Currency }
  inputError?: string
} {
  const { i18n } = useLingui()

  const { account } = useActiveWeb3React()

  const {
    independentField,
    typedValue,
    [Field.COLLATERAL]: { currencyId: collateralId },
    [Field.ASSET]: { currencyId: assetId },
  } = useCreateState()

  const collateral = useCurrency(collateralId)

  const asset = useCurrency(assetId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.COLLATERAL]: collateral ?? undefined,
    [Field.ASSET]: asset ?? undefined,
  }

  let inputError: string | undefined

  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!currencies[Field.COLLATERAL]) {
    inputError = inputError ?? i18n._(t`Select a collateral token`)
  }

  if (!currencies[Field.ASSET] || !currencies[Field.ASSET]) {
    inputError = inputError ?? i18n._(t`Select a asset token`)
  }

  return {
    currencies,
    inputError,
  }
}
