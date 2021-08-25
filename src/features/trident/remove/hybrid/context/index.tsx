import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { HybridPoolContext, HybridPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { Fee, Percent } from '@sushiswap/sdk'
import { LiquidityMode, Reducer } from '../../../types'
import reducer from '../../../context/reducer'
import {
  handleInput,
  handlePercentageAmount,
  selectOutputToken,
  setLiquidityMode,
  showReview,
} from '../../../context/actions'
import { useRouter } from 'next/router'
import { useCurrency } from '../../../../../hooks/Tokens'
import { useTridentClassicPool } from '../../../../../hooks/useTridentClassicPools'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: HybridPoolState = {
  outputTokenAddress: null,
  percentageAmount: '',
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  txHash: null,
}

export const TridentRemoveHybridContext = createContext<HybridPoolContext>({
  state: initialState,
  pool: null,
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  currencies: {},
  execute: () => null,
  handlePercentageAmount: () => null,
  selectOutputToken: () => null,
  setLiquidityMode: () => null,
  handleInput: () => null,
  showReview: () => null,
  dispatch: () => null,
})

const TridentRemoveHybridContextProvider: FC = ({ children }) => {
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

  const [state, dispatch] = useReducer<React.Reducer<HybridPoolState, Reducer>>(reducer, {
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
    alert('Executing Hybrid execute function')
  }, [])

  return (
    <TridentRemoveHybridContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          currencies,
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
        [state, pool, currencies, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentRemoveHybridContext.Provider>
  )
}

export default TridentRemoveHybridContextProvider
export const useTridentRemoveHybridContext = () => useContext(TridentRemoveHybridContext)
export const useTridentRemoveHybridState = () => useContext(TridentRemoveHybridContext).state
export const useTridentRemoveHybridDispatch = () => useContext(TridentRemoveHybridContext).dispatch
