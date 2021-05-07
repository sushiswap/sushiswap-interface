import { createReducer } from '@reduxjs/toolkit'
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE, DEFAULT_ARCHER_ETH_TIP, DEFAULT_ARCHER_GAS_PRICE } from '../../constants'
import { updateVersion } from '../global/actions'
import {
    addSerializedPair,
    addSerializedToken,
    removeSerializedPair,
    removeSerializedToken,
    SerializedPair,
    SerializedToken,
    toggleURLWarning,
    updateMatchesDarkMode,
    updateUserDarkMode,
    updateUserDeadline,
    updateUserExpertMode,
    updateUserSingleHopOnly,
    updateUserSlippageTolerance,
    updateUserUseArcher,
    updateUserArcherETHTip,
    updateUserArcherGasPrice,
    updateUserArcherTipManualOverride
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
    // the timestamp of the last updateVersion action
    lastUpdateVersionTimestamp?: number

    userDarkMode: boolean | null // the user's choice for dark mode or light mode
    matchesDarkMode: boolean // whether the dark mode media query matches

    userExpertMode: boolean

    userSingleHopOnly: boolean // only allow swaps on direct pairs

    // user defined slippage tolerance in bips, used in all txns
    userSlippageTolerance: number

    // deadline set by user in minutes, used in all txns
    userDeadline: number

    tokens: {
        [chainId: number]: {
            [address: string]: SerializedToken
        }
    }

    pairs: {
        [chainId: number]: {
            // keyed by token0Address:token1Address
            [key: string]: SerializedPair
        }
    }

    timestamp: number
    URLWarningVisible: boolean
    userUseArcher: boolean // use Archer or go directly to router
    userArcherETHTip: string // ETH tip for Archer, as full BigInt string
    userArcherGasPrice: string // current gas price
    userArcherTipManualOverride: boolean // is user manually entering tip
}

function pairKey(token0Address: string, token1Address: string) {
    return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
    userDarkMode: null,
    matchesDarkMode: false,
    userExpertMode: false,
    userSingleHopOnly: false,
    userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
    userDeadline: DEFAULT_DEADLINE_FROM_NOW,
    tokens: {},
    pairs: {},
    timestamp: currentTimestamp(),
    URLWarningVisible: true,
    userUseArcher: false,
    userArcherETHTip: DEFAULT_ARCHER_ETH_TIP.toString(),
    userArcherGasPrice: DEFAULT_ARCHER_GAS_PRICE.toString(),
    userArcherTipManualOverride: false
}

export default createReducer(initialState, builder =>
    builder
        .addCase(updateVersion, state => {
            // slippage isnt being tracked in local storage, reset to default
            // noinspection SuspiciousTypeOfGuard
            if (typeof state.userSlippageTolerance !== 'number') {
                state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
            }

            // deadline isnt being tracked in local storage, reset to default
            // noinspection SuspiciousTypeOfGuard
            if (typeof state.userDeadline !== 'number') {
                state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
            }

            if (typeof state.userArcherETHTip !== 'number') {
                state.userArcherETHTip = DEFAULT_ARCHER_ETH_TIP.toString()
            }

            state.lastUpdateVersionTimestamp = currentTimestamp()
        })
        .addCase(updateUserDarkMode, (state, action) => {
            state.userDarkMode = action.payload.userDarkMode
            state.timestamp = currentTimestamp()
        })
        .addCase(updateMatchesDarkMode, (state, action) => {
            state.matchesDarkMode = action.payload.matchesDarkMode
            state.timestamp = currentTimestamp()
        })
        .addCase(updateUserExpertMode, (state, action) => {
            state.userExpertMode = action.payload.userExpertMode
            state.timestamp = currentTimestamp()
        })
        .addCase(updateUserSlippageTolerance, (state, action) => {
            state.userSlippageTolerance = action.payload.userSlippageTolerance
            state.timestamp = currentTimestamp()
        })
        .addCase(updateUserDeadline, (state, action) => {
            state.userDeadline = action.payload.userDeadline
            state.timestamp = currentTimestamp()
        })
        .addCase(updateUserSingleHopOnly, (state, action) => {
            state.userSingleHopOnly = action.payload.userSingleHopOnly
        })
        .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
            state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
            state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
            state.timestamp = currentTimestamp()
        })
        .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
            state.tokens[chainId] = state.tokens[chainId] || {}
            delete state.tokens[chainId][address]
            state.timestamp = currentTimestamp()
        })
        .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
            if (
                serializedPair.token0.chainId === serializedPair.token1.chainId &&
                serializedPair.token0.address !== serializedPair.token1.address
            ) {
                const chainId = serializedPair.token0.chainId
                state.pairs[chainId] = state.pairs[chainId] || {}
                state.pairs[chainId][
                    pairKey(serializedPair.token0.address, serializedPair.token1.address)
                ] = serializedPair
            }
            state.timestamp = currentTimestamp()
        })
        .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
            if (state.pairs[chainId]) {
                // just delete both keys if either exists
                delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
                delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
            }
            state.timestamp = currentTimestamp()
        })
        .addCase(toggleURLWarning, state => {
            state.URLWarningVisible = !state.URLWarningVisible
        })
        .addCase(updateUserUseArcher, (state, action) => {
            state.userUseArcher = action.payload.userUseArcher
        })
        .addCase(updateUserArcherETHTip, (state, action) => {
            state.userArcherETHTip = action.payload.userArcherETHTip
        })
        .addCase(updateUserArcherGasPrice, (state, action) => {
            state.userArcherGasPrice = action.payload.userArcherGasPrice
        })
        .addCase(updateUserArcherTipManualOverride, (state, action) => {
            state.userArcherTipManualOverride = action.payload.userArcherTipManualOverride
        })
)
