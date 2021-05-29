import { AppDispatch, AppState } from '..'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from '../../constants'
import { ChainId, Pair, PancakeV1Pair, PancakeV2Pair, QuickSwapPair, SteakPair, Token } from '@sushiswap/sdk'
import {
    SerializedPair,
    SerializedToken,
    addSerializedPair,
    addSerializedToken,
    removeSerializedToken,
    toggleURLWarning,
    updateUserDarkMode,
    updateUserDeadline,
    updateUserExpertMode,
    updateUserSingleHopOnly,
    updateUserSlippageTolerance,
    updateUserArcherUseRelay,
    updateUserArcherGasPrice,
    updateUserArcherETHTip,
    updateUserArcherGasEstimate,
    updateUserArcherTipManualOverride
} from './actions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'

import ReactGA from 'react-ga'
import flatMap from 'lodash/flatMap'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTokens } from '../../hooks/Tokens'

function serializeToken(token: Token): SerializedToken {
    return {
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name
    }
}

function deserializeToken(serializedToken: SerializedToken): Token {
    return new Token(
        serializedToken.chainId,
        serializedToken.address,
        serializedToken.decimals,
        serializedToken.symbol,
        serializedToken.name
    )
}

export function useIsDarkMode(): boolean {
    const { userDarkMode, matchesDarkMode } = useSelector<
        AppState,
        { userDarkMode: boolean | null; matchesDarkMode: boolean }
    >(
        ({ user: { matchesDarkMode, userDarkMode } }) => ({
            userDarkMode,
            matchesDarkMode
        }),
        shallowEqual
    )

    return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
    const dispatch = useDispatch<AppDispatch>()
    const darkMode = useIsDarkMode()

    const toggleSetDarkMode = useCallback(() => {
        dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
    }, [darkMode, dispatch])

    return [darkMode, toggleSetDarkMode]
}

export function useIsExpertMode(): boolean {
    return useSelector<AppState, AppState['user']['userExpertMode']>(state => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
    const dispatch = useDispatch<AppDispatch>()
    const expertMode = useIsExpertMode()

    const toggleSetExpertMode = useCallback(() => {
        dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
    }, [expertMode, dispatch])

    return [expertMode, toggleSetExpertMode]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
    const dispatch = useDispatch<AppDispatch>()

    const singleHopOnly = useSelector<AppState, AppState['user']['userSingleHopOnly']>(
        state => state.user.userSingleHopOnly
    )

    const setSingleHopOnly = useCallback(
        (newSingleHopOnly: boolean) => {
            ReactGA.event({
                category: 'Routing',
                action: newSingleHopOnly ? 'enable single hop' : 'disable single hop'
            })
            dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
        },
        [dispatch]
    )

    return [singleHopOnly, setSingleHopOnly]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
    const dispatch = useDispatch<AppDispatch>()
    const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>(state => {
        return state.user.userSlippageTolerance
    })

    const setUserSlippageTolerance = useCallback(
        (userSlippageTolerance: number) => {
            dispatch(updateUserSlippageTolerance({ userSlippageTolerance }))
        },
        [dispatch]
    )

    return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
    const dispatch = useDispatch<AppDispatch>()
    const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>(state => {
        return state.user.userDeadline
    })

    const setUserDeadline = useCallback(
        (userDeadline: number) => {
            dispatch(updateUserDeadline({ userDeadline }))
        },
        [dispatch]
    )

    return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
    const dispatch = useDispatch<AppDispatch>()
    return useCallback(
        (token: Token) => {
            dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
        },
        [dispatch]
    )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
    const dispatch = useDispatch<AppDispatch>()
    return useCallback(
        (chainId: number, address: string) => {
            dispatch(removeSerializedToken({ chainId, address }))
        },
        [dispatch]
    )
}

export function useUserAddedTokens(): Token[] {
    const { chainId } = useActiveWeb3React()
    const serializedTokensMap = useSelector<AppState, AppState['user']['tokens']>(({ user: { tokens } }) => tokens)

    return useMemo(() => {
        if (!chainId) return []
        return Object.values(serializedTokensMap[chainId as ChainId] ?? {}).map(deserializeToken)
    }, [serializedTokensMap, chainId])
}

function serializePair(pair: Pair): SerializedPair {
    return {
        token0: serializeToken(pair.token0),
        token1: serializeToken(pair.token1)
    }
}

export function usePairAdder(): (pair: Pair) => void {
    const dispatch = useDispatch<AppDispatch>()

    return useCallback(
        (pair: Pair) => {
            dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
        },
        [dispatch]
    )
}

export function useURLWarningVisible(): boolean {
    return useSelector((state: AppState) => state.user.URLWarningVisible)
}

export function useURLWarningToggle(): () => void {
    const dispatch = useDispatch()
    return useCallback(() => dispatch(toggleURLWarning()), [dispatch])
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
    return new Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'Uniswap V2')
}

export function toPancakeV1LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
    return new Token(tokenA.chainId, PancakeV1Pair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'Uniswap V2')
}

export function toPancakeV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
    return new Token(tokenA.chainId, PancakeV2Pair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'Uniswap V2')
}

export function toQuickSwapLiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
    return new Token(tokenA.chainId, QuickSwapPair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'QuickSwap')
}

export function toSteakHouseLiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
    return new Token(tokenA.chainId, SteakPair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'SteakHouse')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
    const { chainId } = useActiveWeb3React()
    const tokens = useAllTokens()

    // pinned pairs
    const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

    // pairs for every token against every base
    const generatedPairs: [Token, Token][] = useMemo(
        () =>
            chainId
                ? flatMap(Object.keys(tokens), tokenAddress => {
                      const token = tokens[tokenAddress]
                      // for each token on the current chain,
                      return (
                          // loop though all bases on the current chain
                          (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                              // to construct pairs of the given token with each base
                              .map(base => {
                                  if (base.address === token.address) {
                                      return null
                                  } else {
                                      return [base, token]
                                  }
                              })
                              .filter((p): p is [Token, Token] => p !== null)
                      )
                  })
                : [],
        [tokens, chainId]
    )

    // pairs saved by users
    const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

    const userPairs: [Token, Token][] = useMemo(() => {
        if (!chainId || !savedSerializedPairs) return []
        const forChain = savedSerializedPairs[chainId]
        if (!forChain) return []

        return Object.keys(forChain).map(pairId => {
            return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
        })
    }, [savedSerializedPairs, chainId])

    const combinedList = useMemo(() => userPairs.concat(generatedPairs).concat(pinnedPairs), [
        generatedPairs,
        pinnedPairs,
        userPairs
    ])

    return useMemo(() => {
        // dedupes pairs of tokens in the combined list
        const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
            const sorted = tokenA.sortsBefore(tokenB)
            const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
            if (memo[key]) return memo
            memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
            return memo
        }, {})

        return Object.keys(keyed).map(key => keyed[key])
    }, [combinedList])
}

export function useUserArcherUseRelay(): [boolean, (newUseRelay: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()

  const useRelay = useSelector<AppState, AppState['user']['userArcherUseRelay']>(
    state => state.user.userArcherUseRelay
  )

  const setUseRelay = useCallback(
    (newUseRelay: boolean) => {
      dispatch(updateUserArcherUseRelay({ userArcherUseRelay: newUseRelay }))
    },
    [dispatch]
  )

  return [useRelay, setUseRelay]
}

export function useUserArcherGasPrice(): [string, (newGasPrice: string) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userGasPrice = useSelector<AppState, AppState['user']['userArcherGasPrice']>(state => {
    return state.user.userArcherGasPrice
  })

  const setUserGasPrice = useCallback(
    (newGasPrice: string) => {
      dispatch(updateUserArcherGasPrice({ userArcherGasPrice: newGasPrice }))
    },
    [dispatch]
  )

  return [userGasPrice, setUserGasPrice]
}

export function useUserArcherETHTip(): [string, (newETHTip: string) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userETHTip = useSelector<AppState, AppState['user']['userArcherETHTip']>(state => {
    return state.user.userArcherETHTip
  })

  const setUserETHTip = useCallback(
    (newETHTip: string) => {
      dispatch(updateUserArcherETHTip({ userArcherETHTip: newETHTip }))
    },
    [dispatch]
  )

  return [userETHTip, setUserETHTip]
}

export function useUserArcherGasEstimate(): [string, (newGasEstimate: string) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userGasEstimate = useSelector<AppState, AppState['user']['userArcherGasEstimate']>(state => {
    return state.user.userArcherGasEstimate
  })

  const setUserGasEstimate = useCallback(
    (newGasEstimate: string) => {
      dispatch(updateUserArcherGasEstimate({ userArcherGasEstimate: newGasEstimate }))
    },
    [dispatch]
  )

  return [userGasEstimate, setUserGasEstimate]
}

export function useUserArcherTipManualOverride(): [boolean, (newManualOverride: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userTipManualOverride = useSelector<AppState, AppState['user']['userArcherTipManualOverride']>(state => {
    return state.user.userArcherTipManualOverride
  })

  const setUserTipManualOverride = useCallback(
    (newManualOverride: boolean) => {
      dispatch(updateUserArcherTipManualOverride({ userArcherTipManualOverride: newManualOverride }))
    },
    [dispatch]
  )

  return [userTipManualOverride, setUserTipManualOverride]
}