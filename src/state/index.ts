import { configureStore } from '@reduxjs/toolkit'
import { createMigrate, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { initialState as initialListsState } from './lists/reducer'
import reducer from './reducer'
import { initialState as initialUserState } from './user/reducer'
// https://github.com/rt2zz/redux-persist/blob/master/docs/migrations.md#example-with-createmigrate
const migrations = {
  // @ts-ignore
  0: (state) => {
    return {
      ...state,
      lists: undefined,
    }
  },
  // @ts-ignore
  1: (state) => {
    return {
      ...state,
      user: initialUserState,
    }
  },
  // @ts-ignore
  2: (state) => {
    return {
      ...state,
      lists: undefined,
    }
  },
  // @ts-ignore
  3: (state) => {
    return {
      ...state,
      lists: initialListsState,
    }
  },
}

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'slippage']

const persistConfig = {
  key: 'root',
  whitelist: PERSISTED_KEYS,
  version: 3,
  storage,
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV === 'development' }),
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV === 'development',
})

export const persistor = persistStore(store)

export type AppState = ReturnType<typeof persistedReducer>
export type AppDispatch = typeof store.dispatch

export default store
