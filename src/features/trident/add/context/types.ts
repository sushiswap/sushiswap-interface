import { Token } from '@sushiswap/sdk'

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

export enum ActionType {
  SET_LIQUIDITY_MODE = 'SET_LIQUIDITY_MODE',
  SET_INPUT_AMOUNT = 'SET_INPUT_AMOUNT',
  SET_INPUT_AMOUNTS = 'SET_INPUT_AMOUNTS',
  SET_CURRENCY = 'SET_CURRENCY',
  SHOW_ZAP_REVIEW = 'SHOW_ZAP_REVIEW',
}

export interface Reducer {
  type: ActionType
  payload: any
}

export interface State {
  liquidityMode: LiquidityMode
  currencies: Record<string, Token>
  inputAmounts: Record<string, string>
  showZapReview: boolean
}
