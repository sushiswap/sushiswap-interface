import { createReducer } from '@reduxjs/toolkit'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { setStrategy, setZapIn, setZapInValue } from './actions'
import { ReactNode } from 'react'

export interface InaryStrategy {
  name: string
  steps: string[]
  description: string
  zapMethod: string
  unzapMethod: string
  inputToken: Token
  inputLogo: ReactNode
  inputTokenBalance: ((zapIn: boolean) => CurrencyAmount<Token>) | CurrencyAmount<Token>
  outputToken: Token
  outputLogo: ReactNode
  outputSymbol: string
  outputTokenBalance: ((zapIn: boolean) => CurrencyAmount<Token>) | CurrencyAmount<Token>
  outputValue: (zapIn: boolean, zapInValue: string) => string
  transformZapInValue?: (val: CurrencyAmount<Token>) => CurrencyAmount<Token>
}

export interface InariState {
  readonly zapIn: boolean
  readonly zapInValue: string
  readonly strategy: number
}

const initialState: InariState = {
  zapIn: true,
  zapInValue: '',
  strategy: 0,
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
