import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Fee } from '@sushiswap/trident-sdk'
import { AppState } from 'app/state'

import { AllPoolType } from '../types'

export enum PoolSortOption {
  TVL = 'TVL Highest to Lowest',
  VOLUME = 'VOL Highest to Lowest',
  // APY = 'APY Highest to Lowest',
}

export interface PoolsState {
  searchQuery: string
  farmsOnly: boolean
  showTWAPOnly: boolean
  poolTypes: AllPoolType[]
  feeTiers: Fee[]
  sort: PoolSortOption
}

const initialState: PoolsState = {
  searchQuery: '',
  farmsOnly: false,
  showTWAPOnly: false,
  poolTypes: [],
  feeTiers: [],
  sort: PoolSortOption.TVL,
}

export const poolsSlice = createSlice({
  name: 'tridentPools',
  initialState,
  reducers: {
    setPoolsSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setPoolsFarmsOnly: (state, action: PayloadAction<boolean>) => {
      state.farmsOnly = action.payload
    },
    setPoolsTWAPOnly: (state, action: PayloadAction<boolean>) => {
      state.showTWAPOnly = action.payload
    },
    setPoolsPoolTypes: (state, action: PayloadAction<AllPoolType[]>) => {
      state.poolTypes = action.payload
    },
    setPoolsFeeTiers: (state, action: PayloadAction<Fee[]>) => {
      state.feeTiers = action.payload
    },
    setPoolsSort: (state, action: PayloadAction<PoolSortOption>) => {
      state.sort = action.payload
    },
  },
})

export const {
  setPoolsSearchQuery,
  setPoolsFarmsOnly,
  setPoolsTWAPOnly,
  setPoolsPoolTypes,
  setPoolsFeeTiers,
  setPoolsSort,
} = poolsSlice.actions

type selectTridentPools = (state: AppState) => PoolsState
export const selectTridentPools: selectTridentPools = (state: AppState) => state.tridentPools
export default poolsSlice.reducer

// @ts-ignore TYPE NEEDS FIXING
export const selectPoolsNormalInput = (state: AppState) => state.tridentPools.normalInput
// @ts-ignore TYPE NEEDS FIXING
export const selectPoolsSpendFromWallet = (state: AppState) => state.tridentPools.spendFromWallet
