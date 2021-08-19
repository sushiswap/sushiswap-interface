import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { Dispatch } from 'react'

export interface Pool {
  type: PoolType
  amounts: CurrencyAmount<Token>[]
  tokens: Token[]
  tvl: string
  apy: string
  fee: string
}

export enum PoolType {
  CLASSIC = 'CLASSIC',
  HYBRID = 'HYBRID',
  CONCENTRATED = 'CONCENTRATED',
  WEIGHTED = 'WEIGHTED',
}

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

export enum ActionType {
  SET_PERCENTAGE_AMOUNT = 'SET_PERCENTAGE_AMOUNT',
  SET_OUTPUT_TOKEN = 'SET_OUTPUT_TOKEN',
  SET_INPUT_TOKEN = 'SET_INPUT_TOKEN',
  SET_BALANCED_MODE = 'SET_BALANCED_MODE',
  SET_LIQUIDITY_MODE = 'SET_LIQUIDITY_MODE',
  SET_INPUT_AMOUNT = 'SET_INPUT_AMOUNT',
  SET_INPUT_AMOUNT_WITH_CLEAR = 'SET_INPUT_AMOUNT_WITH_CLEAR',
  SET_INPUT_AMOUNTS = 'SET_INPUT_AMOUNTS',
  SHOW_ZAP_REVIEW = 'SHOW_ZAP_REVIEW',
  SET_SPEND_FROM_WALLET = 'SET_SPEND_FROM_WALLET',
}

export interface Reducer {
  type: ActionType
  payload: any
}

export interface TridentState {
  inputTokenAddress: string
  outputTokenAddress: string
  percentageAmount: string
  liquidityMode: LiquidityMode
  inputAmounts: Record<string, string>
  showZapReview: boolean
  minPrice: string
  maxPrice: string
  balancedMode: boolean
  spendFromWallet: boolean
}

export interface HandleInputOptions {
  clear?: boolean
}

export interface TridentContext {
  state: Partial<TridentState>
  pool: Pool
  parsedInputAmounts: Record<string, CurrencyAmount<Token> | undefined>
  parsedOutputAmounts: Record<string, CurrencyAmount<Token> | undefined>
  tokens: { [x: string]: Token }
  execute: () => void
  handleInput: (amount: string, address: string, options?: HandleInputOptions) => void
  selectInputToken: (address: string) => void
  setLiquidityMode: (x: LiquidityMode) => void
  showReview: (x: boolean) => void
  dispatch: Dispatch<any>
  handlePercentageAmount: (amount: string) => void
  selectOutputToken: (address: string) => void
}
