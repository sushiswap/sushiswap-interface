import { SwapMessage, UserHistoryMessage } from '../../entities/ProSwapMessages'

interface GlobalDataReducerAction<T, P> {
    type: T
    payload: P
}

interface PushHistoryMessagePayload {
    message: UserHistoryMessage
}

interface PushSwapMessagePayload {
    message: SwapMessage
}

export enum ActionType {
    PUSH_HISTORY_MESSAGE = 'PUSH_HISTORY_MESSAGE',
    PUSH_SWAP_MESSAGE = 'PUSH_SWAP_MESSAGE',
}

export interface State {
    userHistory: UserHistoryMessage[]
    swapHistory: SwapMessage[]
}

export type Action =
    | GlobalDataReducerAction<ActionType.PUSH_SWAP_MESSAGE, PushSwapMessagePayload>
    | GlobalDataReducerAction<ActionType.PUSH_HISTORY_MESSAGE, PushHistoryMessagePayload>
