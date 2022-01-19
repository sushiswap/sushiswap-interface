import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OnsenModalView } from 'app/features/onsen/enum'
import { AppState } from 'app/state'

export interface OnsenState {
  view?: OnsenModalView
}

const initialState: OnsenState = {
  view: undefined,
}

export const onsenSlice = createSlice({
  name: 'onsen',
  initialState,
  reducers: {
    setOnsenModalView: (state, action: PayloadAction<OnsenModalView | undefined>) => {
      state.view = action.payload
    },
  },
})

export const { setOnsenModalView } = onsenSlice.actions

type selectOnsen = (state: AppState) => OnsenState
export const selectOnsen: selectOnsen = (state: AppState) => state.onsen
export default onsenSlice.reducer
