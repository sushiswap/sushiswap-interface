import { Action, ThunkAction, combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
// import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import burn from './burn/reducer'
import create from './create/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import storage from 'redux-persist/lib/storage'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import zap from './zap/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']
// const PERSISTED_KEYS: string[] = ['user', 'transactions']

// const persistConfig = {
//   key: 'root',
//   // version: 1,
//   whitelist: PERSISTED_KEYS,
//   throttle: 1000,
//   storage,
//   debug: process.env.NODE_ENV === 'development',
// }

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
  create,
})

const store = configureStore({
  reducer,
  // reducer: persistReducer(persistConfig, reducer),
  middleware: getDefaultMiddleware({
    thunk: true,
    immutableCheck: true,
    // serializableCheck: {
    //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    // },
  }).concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  devTools: process.env.NODE_ENV === 'development',
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store

// export const persistor = persistStore(store)
