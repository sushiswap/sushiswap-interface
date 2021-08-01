import application from './application/reducer'
import burn from './burn/reducer'
import { combineReducers } from '@reduxjs/toolkit'
import create from './create/reducer'
import limitOrder from './limit-order/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import zap from './zap/reducer'

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

export default reducer