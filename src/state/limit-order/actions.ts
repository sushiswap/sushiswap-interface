import { createAction } from '@reduxjs/toolkit'

export const setLimitPrice = createAction<string | null>(
    'limit-order/setLimitPrice'
)

export const setLimitOrderApprovalPending = createAction<string>(
    'limit-order/setLimitOrderApprovalPending'
)
