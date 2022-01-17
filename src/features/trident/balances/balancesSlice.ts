import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

import { ActiveModal } from '../types'

export interface BalancesState {
  currency?: string
  activeModal: ActiveModal | undefined
}

const initialState: BalancesState = {
  currency: undefined,
  activeModal: undefined,
}

export const balancesSlice = createSlice({
  name: 'tridentAdd',
  initialState,
  reducers: {
    setBalancesActiveModal: (state, action: PayloadAction<ActiveModal | undefined>) => {
      state.activeModal = action.payload
    },
    setBalancesState: (state, action: PayloadAction<BalancesState>) => {
      state.currency = action.payload.currency
      state.activeModal = action.payload.activeModal
    },
  },
})

export const { setBalancesActiveModal, setBalancesState } = balancesSlice.actions

type selectTridentAdd = (state: AppState) => BalancesState
export const selectTridentBalances: selectTridentAdd = (state: AppState) => state.tridentBalances
export default balancesSlice.reducer

export const selectBalancesCurrency = (state: AppState) => state.tridentBalances.currency
