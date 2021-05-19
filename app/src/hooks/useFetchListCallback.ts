import { AppDispatch } from '../state'
import { ChainId } from '@sushiswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { fetchTokenList } from '../state/lists/actions'
import { getNetworkLibrary } from '../connectors'
import { getTokenList } from '../functions/list'
import { nanoid } from '@reduxjs/toolkit'
import { resolveENSContentHash } from '../functions/ens'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
    const { chainId, library } = useActiveWeb3React()
    const dispatch = useDispatch<AppDispatch>()

    const ensResolver = useCallback(
        (ensName: string) => {
            if (!library || chainId !== ChainId.MAINNET) {
                if (chainId === ChainId.MAINNET) {
                    const networkLibrary = getNetworkLibrary()
                    if (networkLibrary) {
                        return resolveENSContentHash(ensName, networkLibrary)
                    }
                }
                throw new Error('Could not construct mainnet ENS resolver')
            }
            return resolveENSContentHash(ensName, library)
        },
        [chainId, library]
    )

    // note: prevent dispatch if using for list search or unsupported list
    return useCallback(
        async (listUrl: string, sendDispatch = true) => {
            const requestId = nanoid()
            sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
            return getTokenList(listUrl, ensResolver)
                .then(tokenList => {
                    sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
                    return tokenList
                })
                .catch(error => {
                    console.debug(`Failed to get list at url ${listUrl}`, error)
                    sendDispatch &&
                        dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
                    throw error
                })
        },
        [dispatch, ensResolver]
    )
}
