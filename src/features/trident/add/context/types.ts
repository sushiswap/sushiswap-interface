export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

export enum ActionType {
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

export interface State {
  liquidityMode: LiquidityMode
  inputAmounts: Record<string, string>
  showZapReview: boolean
  balancedMode: boolean
  spendFromWallet: boolean
}
