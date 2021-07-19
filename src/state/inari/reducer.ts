import { createReducer } from '@reduxjs/toolkit'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { setStrategy, setZapIn, setZapInValue } from './actions'

export interface InaryStrategy {
  name: string
  steps: string[]
  description: string
  inputToken: Token
  outputToken: Token
  outputSymbol: string
  zapMethod: string
  unzapMethod: string
  inputBalance: CurrencyAmount<Token>
  outputBalance: CurrencyAmount<Token>
  outputValue: string
}

export interface InariState {
  readonly zapIn: boolean
  readonly zapInValue: string
  readonly strategy: string
}

const initialState: InariState = {
  zapIn: true,
  zapInValue: '',
  strategy: '0',
}

export default createReducer<InariState>(initialState, (builder) =>
  builder
    .addCase(setStrategy, (state, { payload: strategy }) => {
      return {
        ...state,
        strategy,
      }
    })
    .addCase(setZapIn, (state, { payload: zapIn }) => {
      return {
        ...state,
        zapIn,
      }
    })
    .addCase(setZapInValue, (state, { payload: zapInValue }) => {
      return {
        ...state,
        zapInValue,
      }
    })
)
