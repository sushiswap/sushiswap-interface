import { ConstantProductPool, Currency, CurrencyAmount } from '@sushiswap/sdk'
import { Dispatch } from 'react'
import {
  ClassicPoolContext as ClassicPoolAddContext,
  ClassicPoolState as ClassicPoolAddState,
} from './add/classic/context/types'
import {
  WeightedPoolContext as WeightedPoolAddContext,
  WeightedPoolState as WeightedPoolAddState,
} from './add/weighted/context/types'
import {
  HybridPoolContext as HybridPoolAddContext,
  HybridPoolState as HybridPoolAddState,
} from './add/hybrid/context/types'
import {
  ConcentratedPoolContext as ConcentratedPoolAddContext,
  ConcentratedPoolState as ConcentratedPoolAddState,
} from './add/concentrated/context/types'

import {
  ClassicPoolContext as ClassicPoolRemoveContext,
  ClassicPoolState as ClassicPoolRemoveState,
} from './remove/classic/context/types'
import {
  WeightedPoolContext as WeightedPoolRemoveContext,
  WeightedPoolState as WeightedPoolRemoveState,
} from './remove/weighted/context/types'
import {
  HybridPoolContext as HybridPoolRemoveContext,
  HybridPoolState as HybridPoolRemoveState,
} from './remove/hybrid/context/types'
import {
  ConcentratedPoolContext as ConcentratedPoolRemoveContext,
  ConcentratedPoolState as ConcentratedPoolRemoveState,
} from './remove/concentrated/context/types'
import { Field as MintField } from '../../state/mint/actions'
import { Field as BurnField } from '../../state/burn/actions'
import { ConstantProductPoolState } from '../../hooks/useTridentClassicPools'

export type Pool = [ConstantProductPoolState, ConstantProductPool | null]

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
  SET_MIN_PRICE = 'SET_MIN_PRICE',
  SET_MAX_PRICE = 'SET_MAX_PRICE',
  SET_TX_HASH = 'SET_TX_HASH',
  SET_FIXED_RATIO_MODE = 'SET_FIXED_RATIO_MODE',
}

export interface Reducer {
  type: ActionType
  payload: any
}

export interface TridentState {
  fixedRatio: boolean
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
  txHash: string
  typedField?: MintField | BurnField
}

export interface HandleInputOptions {
  clear?: boolean
  typedField?: MintField | BurnField
}

export interface TridentContext {
  state: Partial<TridentState>
  pool: null
  parsedInputAmounts: Record<string, CurrencyAmount<Currency> | undefined>
  parsedOutputAmounts: Record<string, CurrencyAmount<Currency> | undefined>
  currencies: Record<string, Currency>
  execute: () => void
  handleInput: (amount: string, address: string, options?: HandleInputOptions) => void
  selectInputToken: (address: string) => void
  setLiquidityMode: (x: LiquidityMode) => void
  showReview: (x: boolean) => void
  dispatch: Dispatch<any>
  handlePercentageAmount: (amount: string) => void
  selectOutputToken: (address: string) => void
  setMinPrice: (price: string) => void
  setMaxPrice: (price: string) => void
  setSpendFromWallet: (x: boolean) => void
}

export type PoolStateType =
  | ClassicPoolAddState
  | WeightedPoolAddState
  | HybridPoolAddState
  | ConcentratedPoolAddState
  | ClassicPoolRemoveState
  | WeightedPoolRemoveState
  | HybridPoolRemoveState
  | ConcentratedPoolRemoveState

export type PoolContextType =
  | ClassicPoolAddContext
  | WeightedPoolAddContext
  | HybridPoolAddContext
  | ConcentratedPoolAddContext
  | ClassicPoolRemoveContext
  | WeightedPoolRemoveContext
  | HybridPoolRemoveContext
  | ConcentratedPoolRemoveContext
