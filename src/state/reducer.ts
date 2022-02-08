import { combineReducers } from '@reduxjs/toolkit'
import portfolio from 'app/features/portfolio/portfolioSlice'

import onsen from '../features/onsen/onsenSlice'
import tridentAdd from '../features/trident/add/addSlice'
import tridentCreate from '../features/trident/create/createSlice'
import tridentMigrations from '../features/trident/migrate/context/migrateSlice'
import tridentPools from '../features/trident/pools/poolsSlice'
import tridentRemove from '../features/trident/remove/removeSlice'
import tridentSwap from '../features/trident/swap/swapSlice'
import application from './application/reducer'
import burn from './burn/reducer'
import create from './create/reducer'
import web3Context from './global/web3ContextSlice'
import inari from './inari/reducer'
import limitOrder from './limit-order/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import slippage from './slippage/slippageSlice'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'

const reducer = combineReducers({
  application,
  burn,
  user,
  create,
  inari,
  limitOrder,
  lists,
  mint,
  multicall,
  onsen,
  slippage,
  swap,
  transactions,
  tridentSwap,
  tridentAdd,
  tridentRemove,
  portfolio,
  tridentPools,
  tridentCreate,
  tridentMigrations,
  web3Context,
})

export default reducer
