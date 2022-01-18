import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Pair } from '@sushiswap/core-sdk'
import { AvailablePoolConfig } from 'app/components/Migrate/migrate-utils'
import { TridentPool } from 'app/services/graph'
import { AppState } from 'app/state'

export enum MigrationSource {
  SUSHI_V2 = 'Sushi v2',
}

export interface v2Migration {
  v2Pair: Pair
  matchingTridentPool?: TridentPool
  poolToCreate?: AvailablePoolConfig
}

const initialState: v2Migration[] = []

export const migrateSlice = createSlice({
  name: 'tridentMigrations',
  initialState,
  reducers: {
    addOrRemoveMigration: (state, action: PayloadAction<{ add: boolean; migration: v2Migration }>) => {
      if (action.payload.add) {
        state.push(action.payload.migration)
      } else {
        return state.filter(
          (m) => m.v2Pair.liquidityToken.address !== action.payload.migration.v2Pair.liquidityToken.address
        )
      }
    },
    editMigration: (state, action: PayloadAction<{ indexToReplace: number; migration: v2Migration }>) => {
      state[action.payload.indexToReplace] = action.payload.migration
    },
  },
})

export const { addOrRemoveMigration, editMigration } = migrateSlice.actions

export const selectTridentMigrations = (state: AppState) => state.tridentMigrations

export const selectLeftToChoose = createSelector(selectTridentMigrations, (migrations: v2Migration[]): number => {
  const selected = migrations.filter((m) => m.poolToCreate || m.matchingTridentPool).length
  return migrations.length - selected
})

export default migrateSlice.reducer
