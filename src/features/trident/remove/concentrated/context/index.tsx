import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { ConcentratedPoolContext, ConcentratedPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { Fee, Percent } from '@sushiswap/sdk'
import { LiquidityMode, Reducer } from '../../../types'
import {
  handleInput,
  handlePercentageAmount,
  selectOutputToken,
  setLiquidityMode,
  showReview,
} from '../../../context/actions'
import reducer from '../../../context/reducer'
import { useRouter } from 'next/router'
import { useCurrency } from '../../../../../hooks/Tokens'
import { useTridentClassicPool } from '../../../../../hooks/useTridentClassicPools'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: ConcentratedPoolState = {
  outputTokenAddress: null,
  percentageAmount: '',
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  txHash: null,
}

export const TridentRemoveConcentratedContext = createContext<ConcentratedPoolContext>({
  state: initialState,
  pool: null,
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  currencies: {},
  execute: () => null,
  handlePercentageAmount: () => null,
  selectOutputToken: () => null,
  handleInput: () => null,
  showReview: () => null,
  dispatch: () => null,
  setLiquidityMode: () => null,
})

const TridentRemoveConcentratedContextProvider: FC = ({ children }) => {
  const { query } = useRouter()

  const currencyA = useCurrency(query.tokens[0])
  const currencyB = useCurrency(query.tokens[1])
  const fee = Fee[query.fee as string]
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

  const parsedInputAmounts = useMemo(() => {
    return Object.entries(currencies).reduce((acc, [k, v]) => {
      // TODO change this 1 to balance in pool
      acc[k] = tryParseAmount('1', v).multiply(new Percent(state.percentageAmount, '100'))
      return acc
    }, {})
  }, [currencies, state.percentageAmount])

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
    alert('Executing Concentrated execute function')
  }, [])

  return (
    <TridentRemoveConcentratedContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          currencies,
          selectOutputToken: selectOutputToken(dispatch),
          parsedInputAmounts,
          parsedOutputAmounts,
          execute,
          handleInput: handleInput(dispatch),
          handlePercentageAmount: handlePercentageAmount(dispatch),
          showReview: showReview(dispatch),
          setLiquidityMode: setLiquidityMode(dispatch),
          dispatch,
        }),
        [state, pool, currencies, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentRemoveConcentratedContext.Provider>
  )
}

export default TridentRemoveConcentratedContextProvider
export const useTridentRemoveConcentratedContext = () => useContext(TridentRemoveConcentratedContext)
export const useTridentRemoveConcentratedState = () => useContext(TridentRemoveConcentratedContext).state
export const useTridentRemoveConcentratedDispatch = () => useContext(TridentRemoveConcentratedContext).dispatch
