import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { WithTridentPool, withTridentPool } from '../../../../../hooks/useTridentPools'
import { ConcentratedPoolContext, ConcentratedPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { PoolType, Reducer } from '../../../types'
import reducer from '../../../context/reducer'
import { handleInput, setMaxPrice, setMinPrice, showReview } from '../../../context/actions'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: ConcentratedPoolState = {
  minPrice: null,
  maxPrice: null,
  inputAmounts: {},
  showZapReview: false,
  balancedMode: false,
  spendFromWallet: true,
  txHash: null,
}

export const TridentAddConcentratedContext = createContext<ConcentratedPoolContext>({
  state: initialState,
  pool: null,
  tokens: {},
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  execute: () => null,
  handleInput: () => null,
  showReview: () => null,
  dispatch: () => null,
  setMinPrice: () => null,
  setMaxPrice: () => null,
})

const TridentAddConcentratedContextProvider: FC<WithTridentPool> = ({ children, pool, tokens }) => {
  const [state, dispatch] = useReducer<React.Reducer<ConcentratedPoolState, Reducer>>(reducer, {
    ...initialState,
    inputAmounts: pool.tokens.reduce((acc, cur) => ((acc[cur.address] = ''), acc), {}),
  })

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ConcentratedPool execute function')
  }, [])

  // Default input parse
  // We don't want this in the state because the state should consist of primitive values only,
  // derived state should go here (in the context)
  const parsedInputAmounts = useMemo(() => {
    return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(v, tokens[k])
      return acc
    }, {})
  }, [state.inputAmounts, tokens])

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
          tokens,
          parsedInputAmounts,
          parsedOutputAmounts,
          execute,
          handleInput: handleInput(dispatch),
          showReview: showReview(dispatch),
          dispatch,
          setMinPrice: setMinPrice(dispatch),
          setMaxPrice: setMaxPrice(dispatch),
        }),
        [state, pool, tokens, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentAddConcentratedContext.Provider>
  )
}

export default withTridentPool(PoolType.CONCENTRATED)(TridentAddConcentratedContextProvider)
export const useTridentAddConcentratedContext = () => useContext(TridentAddConcentratedContext)
export const useTridentAddConcentratedState = () => useContext(TridentAddConcentratedContext).state
export const useTridentAddConcentratedDispatch = () => useContext(TridentAddConcentratedContext).dispatch
