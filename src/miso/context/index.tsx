import React, { createContext, useReducer } from 'react'

enum ActionType {
    UPDATE = 'UPDATE',
    SYNC = 'SYNC'
}

interface Reducer {
    type: ActionType
    payload: any
}

interface State {
    info: any
}

const initialState: State = {
    info: null
}

export interface MisoContextProps {
    state: State
    dispatch: React.Dispatch<any>
}

export const MisoContext = createContext<{
    state: State
    dispatch: React.Dispatch<any>
}>({
    state: initialState,
    dispatch: () => null
})

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
    switch (action.type) {
        case ActionType.SYNC:
            return {
                ...state
            }
        case ActionType.UPDATE:
            const { info } = action.payload
            return {
                ...state,
                info
            }
        default:
            return state
    }
}

export function MisoProvider({ children }: { children: JSX.Element }) {
    const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)
    return (
        <MisoContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            {children}
        </MisoContext.Provider>
    )
}
