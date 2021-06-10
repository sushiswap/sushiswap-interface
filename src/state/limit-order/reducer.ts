import { createReducer } from '@reduxjs/toolkit'
import { setLimitOrderApprovalPending, setLimitPrice } from './actions'

export interface LimitOrderState {
    readonly limitPrice: string
    readonly approvalPending: string
}

const initialState: LimitOrderState = {
    limitPrice: '',
    approvalPending: '',
}

export default createReducer<LimitOrderState>(initialState, (builder) =>
    builder
        .addCase(setLimitPrice, (state, { payload: limitPrice }) => {
            state.limitPrice = limitPrice
        })
        .addCase(
            setLimitOrderApprovalPending,
            (state, { payload: approvalPending }) => {
                state.approvalPending = approvalPending
            }
        )
)
