import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

export enum TypedField {
  A,
  B,
}

export interface SwapState {
  value: string
  typedField: TypedField
  spendFromWallet: boolean
  receiveToWallet: boolean
  recipient?: string
  attemptingTxn: boolean
  showReview: boolean
}

const initialState: SwapState = {
  value: '',
  typedField: TypedField.A,
  spendFromWallet: true,
  receiveToWallet: true,
  recipient: undefined,
  attemptingTxn: false,
  showReview: false,
}

export const swapSlice = createSlice({
  name: 'tridentSwap',
  initialState,
  reducers: {
    setSpendFromWallet: (state, action: PayloadAction<boolean>) => {
      state.spendFromWallet = action.payload
    },
    setReceiveToWallet: (state, action: PayloadAction<boolean>) => {
      state.receiveToWallet = action.payload
    },
    setTridentSwapState: (
      state,
      action: PayloadAction<{
        value: string
        typedField: TypedField
      }>
    ) => {
      state.value = action.payload.value
      state.typedField = action.payload.typedField
    },
    setRecipient: (state, action: PayloadAction<string | undefined>) => {
      state.recipient = action.payload
    },
    setAttemptingTxn: (state, action: PayloadAction<boolean>) => {
      state.attemptingTxn = action.payload
    },
    setShowReview: (state, action: PayloadAction<boolean>) => {
      state.showReview = action.payload
    },
  },
})

export const {
  setShowReview,
  setAttemptingTxn,
  setRecipient,
  setSpendFromWallet,
  setReceiveToWallet,
  setTridentSwapState,
} = swapSlice.actions
export const selectTridentSwap = (state: AppState) => state.tridentSwap

export default swapSlice.reducer
