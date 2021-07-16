import { Action, ThunkAction, combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'

import application from './application/reducer'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import burn from './burn/reducer'
import create from './create/reducer'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import limitOrder from './limit-order/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import storage from 'redux-persist/lib/storage'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import zap from './zap/reducer'

// const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']
const PERSISTED_KEYS: string[] = ['user', 'transactions']

const persistConfig = {
  key: 'root',
  // version: 1,
  whitelist: PERSISTED_KEYS,
  throttle: 1000,
  storage,
  debug: process.env.NODE_ENV === 'development',
}

const reducer = combineReducers({
  application,
  user,
  transactions,
  swap,
  mint,
  burn,
  multicall,
  lists,
  zap,
  limitOrder,
  create,
})

const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: getDefaultMiddleware({
    thunk: true,
    immutableCheck: true,
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  devTools: process.env.NODE_ENV === 'development',
})

store.dispatch(updateVersion())

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store

export const persistor = persistStore(store)
