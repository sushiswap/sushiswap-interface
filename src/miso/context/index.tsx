import React, { createContext, useCallback, useContext, useReducer } from 'react'

import { Commitment } from '../entities'

enum ActionType {
    SET_COMMITMENTS = 'SET_COMMITMENTS',
    ADD_COMMITMENT = 'ADD_COMMITMENT',
    RESET_COMMITMENT = 'RESET_COMMITMENT'
}

interface Reducer {
    type: ActionType
    payload: any
}

interface State {
    commitments: {
        commitments: Commitment[]
        totalParticipants: number
        commitmentsTotal: number
    }
}

const initialState: State = {
    commitments: {
        commitments: [],
        totalParticipants: 0,
        commitmentsTotal: 0
    }
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

const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index
}

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
    switch (action.type) {
        case ActionType.SET_COMMITMENTS: {
            const { commitments } = action.payload
            const newState: State = { ...state }
            newState.commitments.commitments = commitments
            const uniqueAddresses = commitments.map((commit: Commitment) => commit.address).filter(onlyUnique)

            const commitmentsTotal = commitments.reduce(
                (prev: number, cur: Commitment) => prev + parseFloat(cur.amount),
                0
            )
            newState.commitments.commitmentsTotal = commitmentsTotal
            newState.commitments.totalParticipants = uniqueAddresses.length
            return newState
        }
        case ActionType.ADD_COMMITMENT: {
            const { commitment } = action.payload
            const newState: State = { ...state }
            const commitmentExists = newState.commitments.commitments.some(
                (commit: Commitment) => commit.txHash === commitment.txHash
            )
            if (commitmentExists) return false
            const addressExists = newState.commitments.commitments.some(
                (commit: Commitment) => commit.address === commitment.address
            )
            if (!addressExists) {
                const totalParticipants = newState.commitments.totalParticipants
                newState.commitments.totalParticipants = totalParticipants + 1
            }
            newState.commitments.commitmentsTotal += parseFloat(commitment.amount)
            return newState
        }
        case ActionType.RESET_COMMITMENT: {
            return {
                ...initialState
            }
        }
        default: {
            return state
        }
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
