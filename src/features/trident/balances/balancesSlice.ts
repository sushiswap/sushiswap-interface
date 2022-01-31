import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

import { ActiveModal } from '../types'

export interface BalancesState {
  currency?: string
  activeModal: ActiveModal | undefined
  modalOpen: boolean
}

const initialState: BalancesState = {
  currency: undefined,
  activeModal: undefined,
  modalOpen: false,
}

export const balancesSlice = createSlice({
  name: 'tridentAdd',
  initialState,
  reducers: {
    setBalancesActiveModal: (state, action: PayloadAction<ActiveModal | undefined>) => {
      state.activeModal = action.payload
    },
    setBalancesState: (state, action: PayloadAction<Pick<BalancesState, 'currency' | 'activeModal'>>) => {
      state.currency = action.payload.currency
      state.activeModal = action.payload.activeModal
      state.modalOpen = !!action.payload.currency && !!action.payload.activeModal
    },
    setBalancesCurrency: (state, action: PayloadAction<string | undefined>) => {
      state.currency = action.payload
    },
    setBalancesModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload
    },
  },
})

export const { setBalancesActiveModal, setBalancesState, setBalancesCurrency, setBalancesModalOpen } =
  balancesSlice.actions

type selectTridentAdd = (state: AppState) => BalancesState
export const selectTridentBalances: selectTridentAdd = (state: AppState) => state.tridentBalances
export default balancesSlice.reducer

export const selectBalancesCurrency = (state: AppState) => state.tridentBalances.currency
