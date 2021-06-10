import { AppState } from '../index'
import { useSelector } from 'react-redux'

export function useLimitOrderState(): AppState['limitOrder'] {
    return useSelector<AppState, AppState['limitOrder']>(
        (state) => state.limitOrder
    )
}

export function useLimitOrderApprovalPending(): string {
    return useSelector((state: AppState) => state.limitOrder.approvalPending)
}
