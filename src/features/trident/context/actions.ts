import { ActionType, HandleInputOptions } from '../types'

export const handleInput =
  (dispatch) =>
  (amount: string, address: string, options: HandleInputOptions = {}) =>
    dispatch({
      type: options.clear ? ActionType.SET_INPUT_AMOUNT_WITH_CLEAR : ActionType.SET_INPUT_AMOUNT,
      payload: {
        amount,
        address,
      },
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

export const setLiquidityMode = (dispatch) => (mode) =>
  dispatch({
    type: ActionType.SET_LIQUIDITY_MODE,
    payload: mode,
  })
