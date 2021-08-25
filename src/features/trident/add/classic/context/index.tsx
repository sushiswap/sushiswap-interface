import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { ClassicPoolContext, ClassicPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { LiquidityMode, Reducer } from '../../../types'
import reducer from '../../../context/reducer'
import {
  handleInput,
  selectInputToken,
  setLiquidityMode,
  setSpendFromWallet,
  setTxHash,
  showReview,
} from '../../../context/actions'
import { useTridentClassicPool } from '../../../../../hooks/useTridentClassicPools'
import { useRouter } from 'next/router'
import { useCurrency } from '../../../../../hooks/Tokens'
import { Fee } from '../../../../../../../sushiswap-sdk'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: ClassicPoolState = {
  inputTokenAddress: null,
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  balancedMode: false,
  spendFromWallet: true,
  txHash: null,
  typedField: null,
}

export const TridentAddClassicContext = createContext<ClassicPoolContext>({
  state: initialState,
  pool: null,
  currencies: {},
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  execute: () => null,
  handleInput: () => null,
  selectInputToken: () => null,
  setLiquidityMode: () => null,
  showReview: () => null,
  dispatch: () => null,
  setSpendFromWallet: () => null,
})

const TridentAddClassicContextProvider: FC = ({ children }) => {
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

  const [state, dispatch] = useReducer<React.Reducer<ClassicPoolState, Reducer>>(reducer, {
    ...initialState,
    inputAmounts: Object.keys(currencies).reduce((acc, cur) => ((acc[cur] = ''), acc), {}),
  })

  // We don't want this in the state because the state should consist of primitive values only,
  // derived state should go here (in the context)
  const parsedInputAmounts = useMemo(() => {
    return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(v, currencies[k])
      return acc
    }, {})
  }, [state.inputAmounts, currencies])

  const parsedOutputAmounts = useMemo(() => {
    // For NORMAL mode, outputAmounts equals inputAmounts.
    if (state.liquidityMode === LiquidityMode.STANDARD) {
      return parsedInputAmounts
    }

    // TODO this is not returning correct values for other tokens. Needs contract integration
    if (state.liquidityMode === LiquidityMode.ZAP) {
      return Object.entries(currencies).reduce((acc, [k, v]) => {
        acc[k] = tryParseAmount(state.inputAmounts[state.inputTokenAddress], v)?.divide(
          Object.keys(state.inputAmounts).length
        )
        return acc
      }, {})
    }
  }, [currencies, parsedInputAmounts, state.inputAmounts, state.inputTokenAddress, state.liquidityMode])

  const execute = useCallback(async () => {
    // Do some custom execution
    console.log('Executing ClassicPool execute function')

    // Spawn DepositSubmittedModal
    showReview(dispatch)(false)
    setTxHash(dispatch)('test')
  }, [])

  return (
    <TridentAddClassicContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          currencies,
          selectInputToken: selectInputToken(dispatch),
          setLiquidityMode: setLiquidityMode(dispatch),
          parsedInputAmounts,
          parsedOutputAmounts,
          execute,
          handleInput: handleInput(dispatch),
          showReview: showReview(dispatch),
          dispatch,
          setSpendFromWallet: setSpendFromWallet(dispatch),
        }),
        [state, pool, currencies, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentAddClassicContext.Provider>
  )
}
export default TridentAddClassicContextProvider
export const useTridentAddClassicContext = () => useContext(TridentAddClassicContext)
export const useTridentAddClassicState = () => useContext(TridentAddClassicContext).state
export const useTridentAddClassicDispatch = () => useContext(TridentAddClassicContext).dispatch
