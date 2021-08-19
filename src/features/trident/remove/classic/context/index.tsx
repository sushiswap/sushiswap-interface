import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { ClassicPoolContext, ClassicPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { Percent } from '@sushiswap/sdk'
import { withTridentPool, WithTridentPool } from '../../../../../hooks/useTridentPools'
import { LiquidityMode, Reducer } from '../../../types'
import reducer from '../../../context/reducer'
import {
  handleInput,
  handlePercentageAmount,
  selectOutputToken,
  setLiquidityMode,
  showReview,
} from '../../../context/actions'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: ClassicPoolState = {
  outputTokenAddress: null,
  percentageAmount: '',
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
}

export const TridentRemoveClassicContext = createContext<ClassicPoolContext>({
  state: initialState,
  pool: null,
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  tokens: {},
  execute: () => null,
  handlePercentageAmount: () => null,
  selectOutputToken: () => null,
  setLiquidityMode: () => null,
  handleInput: () => null,
  showReview: () => null,
  dispatch: () => null,
})

const TridentRemoveClassicContextProvider: FC<WithTridentPool> = ({ children, pool, tokens }) => {
  const [state, dispatch] = useReducer<React.Reducer<ClassicPoolState, Reducer>>(reducer, {
    ...initialState,
    inputAmounts: pool.tokens.reduce((acc, cur) => ((acc[cur.address] = ''), acc), {}),
  })

  const parsedInputAmounts = useMemo(() => {
    return pool.tokens.reduce((acc, cur) => {
      // TODO change this 1 to balance in pool
      acc[cur.address] = tryParseAmount('1', cur).multiply(new Percent(state.percentageAmount, '100'))
      return acc
    }, {})
  }, [pool.tokens, state.percentageAmount])

  const parsedOutputAmounts = useMemo(() => {
    if (state.liquidityMode === LiquidityMode.STANDARD) {
      return parsedInputAmounts
    }

    // For ZAP mode, outputAmounts is the combined inputAmount
    // TODO uses balance from contract
    if (state.liquidityMode === LiquidityMode.ZAP) {
      return {
        [state.outputTokenAddress]: parsedInputAmounts[state.outputTokenAddress],
      }
    }
  }, [parsedInputAmounts, state.liquidityMode, state.outputTokenAddress])

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing Classic execute function')
  }, [])

  return (
    <TridentRemoveClassicContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          tokens,
          selectOutputToken: selectOutputToken(dispatch),
          setLiquidityMode: setLiquidityMode(dispatch),
          parsedInputAmounts,
          parsedOutputAmounts,
          execute,
          handleInput: handleInput(dispatch),
          handlePercentageAmount: handlePercentageAmount(dispatch),
          showReview: showReview(dispatch),
          dispatch,
        }),
        [state, pool, tokens, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentRemoveClassicContext.Provider>
  )
}

export default withTridentPool(TridentRemoveClassicContextProvider)
export const useTridentRemoveClassicContext = () => useContext(TridentRemoveClassicContext)
export const useTridentRemoveClassicState = () => useContext(TridentRemoveClassicContext).state
export const useTridentRemoveClassicDispatch = () => useContext(TridentRemoveClassicContext).dispatch
