import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import reducer from './reducer'

// @ts-ignore TYPE NEEDS FIXING
let store

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const persistConfig: any = {
  key: 'root',
  whitelist: PERSISTED_KEYS,
  storage,
  // stateReconciler: false,
}

const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const getOrCreateStore = (preloadedState = undefined) => {
  // @ts-ignore TYPE NEEDS FIXING
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  // @ts-ignore TYPE NEEDS FIXING
  if (preloadedState && store) {
    _store = makeStore({
      //@ts-ignore TYPE NEEDS FIXING
      ...store.getState(),
      //@ts-ignore TYPE NEEDS FIXING
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  // @ts-ignore TYPE NEEDS FIXING
  if (!store) store = _store

  return _store
}

store = getOrCreateStore()

// export function useStore(preloadedState) {
//   const store = useMemo(() => getOrCreateStore(preloadedState), [preloadedState])
//   return store
// }

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store

export const persistor = persistStore(store)
