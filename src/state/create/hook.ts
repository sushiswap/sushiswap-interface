import { Currency, Trade as V2Trade } from '@sushiswap/sdk'
import { Field, replaceCreateState, selectCurrency, switchCurrencies, typeInput } from './actions'
import { useAppDispatch, useAppSelector } from '../hooks'

import { AppState } from '../index'
import { CreateState } from './reducer'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks'
import { useCallback } from 'react'
import { useCurrency } from '../../hooks/Tokens'
import { useLingui } from '@lingui/react'

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
    [Field.CURRENCY_A]: { currencyId: currencyAId },
    [Field.CURRENCY_B]: { currencyId: currencyBId },
  } = useCreateState()

  const currencyA = useCurrency(currencyAId)

  const currencyB = useCurrency(currencyBId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.CURRENCY_A]: currencyA ?? undefined,
    [Field.CURRENCY_B]: currencyB ?? undefined,
  }

  let inputError: string | undefined

  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!currencies[Field.CURRENCY_A] || !currencies[Field.CURRENCY_B]) {
    inputError = inputError ?? i18n._(t`Select a token`)
  }

  return {
    currencies,
    inputError,
  }
}
