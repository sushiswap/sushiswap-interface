import { ActionType, LiquidityMode } from '../types'

export const handleInput = (dispatch) => (payload) =>
  dispatch({
    type: ActionType.SET_INPUT_AMOUNT,
    payload,
  })

export const handlePercentageAmount = (dispatch) => (amount: string) =>
  dispatch({
    type: ActionType.SET_PERCENTAGE_AMOUNT,
    payload: amount,
  })

export const showReview =
  (dispatch) =>
  (payload = true) =>
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload,
    })

export const selectOutputToken = (dispatch) => (address: string) =>
  dispatch({
    type: ActionType.SET_OUTPUT_TOKEN,
    payload: address,
  })

export const selectInputToken = (dispatch) => (address: string) =>
  dispatch({
    type: ActionType.SET_INPUT_TOKEN,
    payload: address,
  })

export const setLiquidityMode = (dispatch) => (mode: LiquidityMode) =>
  dispatch({
    type: ActionType.SET_LIQUIDITY_MODE,
    payload: mode,
  })

export const setMinPrice = (dispatch) => (price: string) =>
  dispatch({
    type: ActionType.SET_MIN_PRICE,
    payload: price,
  })

export const setMaxPrice = (dispatch) => (price: string) =>
  dispatch({
    type: ActionType.SET_MAX_PRICE,
    payload: price,
  })

export const setTxHash = (dispatch) => (txHash: string) =>
  dispatch({
    type: ActionType.SET_TX_HASH,
    payload: txHash,
  })

export const setFixedRatioMode = (dispatch) => (mode: boolean) =>
  dispatch({
    type: ActionType.SET_FIXED_RATIO_MODE,
    payload: mode,
  })

export const setSpendFromWallet = (dispatch) => (checked: boolean) =>
  dispatch({
    type: ActionType.SET_SPEND_FROM_WALLET,
    payload: checked,
  })
