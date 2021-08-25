import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { ConcentratedPoolContext, ConcentratedPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { LiquidityMode, Reducer } from '../../../types'
import reducer from '../../../context/reducer'
import {
  handleInput,
  setLiquidityMode,
  setMaxPrice,
  setMinPrice,
  setSpendFromWallet,
  setTxHash,
  showReview,
} from '../../../context/actions'
import { useRouter } from 'next/router'
import { useCurrency } from '../../../../../hooks/Tokens'
import { Fee } from '../../../../../../../sushiswap-sdk'
import { useTridentClassicPool } from '../../../../../hooks/useTridentClassicPools'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: ConcentratedPoolState = {
  fixedRatio: false,
  minPrice: '',
  maxPrice: '',
  inputAmounts: {},
  showZapReview: false,
  balancedMode: false,
  spendFromWallet: true,
  txHash: null,
  liquidityMode: LiquidityMode.STANDARD,
}

export const TridentAddConcentratedContext = createContext<ConcentratedPoolContext>({
  state: initialState,
  pool: null,
  currencies: {},
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  execute: () => null,
  handleInput: () => null,
  showReview: () => null,
  dispatch: () => null,
  setMinPrice: () => null,
  setMaxPrice: () => null,
  setSpendFromWallet: () => null,
  setLiquidityMode: () => null,
})

const TridentAddConcentratedContextProvider: FC = ({ children }) => {
  const { query } = useRouter()

  const currencyA = useCurrency(query.tokens[0])
  const currencyB = useCurrency(query.tokens[1])
  const fee = Fee[query.fee as string]

  // TODO
  const [loading, pool] = useTridentClassicPool(currencyA, currencyB, fee, !!query.twap)

  const currencies = useMemo(
    () => ({
      [currencyA?.wrapped.address]: currencyA,
      [currencyB?.wrapped.address]: currencyB,
    }),
    [currencyA, currencyB]
  )

  const [state, dispatch] = useReducer<React.Reducer<ConcentratedPoolState, Reducer>>(reducer, {
    ...initialState,
    inputAmounts: Object.keys(currencies).reduce((acc, cur) => ((acc[cur] = ''), acc), {}),
  })

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ConcentratedPool execute function')

    // Spawn DepositSubmittedModal
    showReview(dispatch)(false)
    setTxHash(dispatch)('test')
  }, [])

  // Default input parse
  // We don't want this in the state because the state should consist of primitive values only,
  // derived state should go here (in the context)
  const parsedInputAmounts = useMemo(() => {
    return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(v, currencies[k])
      return acc
    }, {})
  }, [state.inputAmounts, currencies])

  // Default output parse
  // For NORMAL mode, outputAmounts equals inputAmounts.
  // For ZAP mode, outputAmounts is the split inputAmount
  const parsedOutputAmounts = useMemo(() => {
    return parsedInputAmounts
  }, [parsedInputAmounts])

  return (
    <TridentAddConcentratedContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          currencies,
          parsedInputAmounts,
          parsedOutputAmounts,
          execute,
          handleInput: handleInput(dispatch),
          showReview: showReview(dispatch),
          dispatch,
          setMinPrice: setMinPrice(dispatch),
          setMaxPrice: setMaxPrice(dispatch),
          setSpendFromWallet: setSpendFromWallet(dispatch),
          setLiquidityMode: setLiquidityMode(dispatch),
        }),
        [state, pool, currencies, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentAddConcentratedContext.Provider>
  )
}

export default TridentAddConcentratedContextProvider
export const useTridentAddConcentratedContext = () => useContext(TridentAddConcentratedContext)
export const useTridentAddConcentratedState = () => useContext(TridentAddConcentratedContext).state
export const useTridentAddConcentratedDispatch = () => useContext(TridentAddConcentratedContext).dispatch
