import { Pool } from '../../types'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { Dispatch } from 'react'

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

export enum ActionType {
  SET_LIQUIDITY_MODE = 'SET_LIQUIDITY_MODE',
  SET_INPUT_AMOUNT = 'SET_INPUT_AMOUNT',
  SET_INPUT_AMOUNT_WITH_CLEAR = 'SET_INPUT_AMOUNT_WITH_CLEAR',
  SET_INPUT_AMOUNTS = 'SET_INPUT_AMOUNTS',
  SHOW_ZAP_REVIEW = 'SHOW_ZAP_REVIEW',
  SET_PERCENTAGE_AMOUNT = 'SET_PERCENTAGE_AMOUNT',
  SET_OUTPUT_TOKEN = 'SET_OUTPUT_TOKEN',
}

export interface Reducer {
  type: ActionType
  payload: any
}

export interface State {
  outputTokenAddress: string
  percentageAmount: string
  liquidityMode: LiquidityMode
  inputAmounts: Record<string, string>
  showZapReview: boolean
}

export interface HandleInputOptions {
  clear?: boolean
}

export interface Context {
  state: State
  pool: Pool
  parsedInputAmounts: Record<string, CurrencyAmount<Token> | undefined>
  parsedOutputAmounts: Record<string, CurrencyAmount<Token> | undefined>
  tokens: { [x: string]: Token }
  execute: () => void
  handleInput: (amount: string, address: string, options?: HandleInputOptions) => void
  handlePercentageAmount: (amount: string) => void
  selectOutputToken: (address: string) => void
  showReview: () => void
  dispatch: Dispatch<any>
}
