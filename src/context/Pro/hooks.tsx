import { useContext, useMemo } from 'react'
import { ProContext } from './index'
import useSWR from 'swr'
import { SwapMessageResponse, UserHistoryResponse } from './types'
import { ChainId, Pair } from '@sushiswap/sdk'
import { exchange } from '../../fetchers/graph'

export function usePro() {
    return useContext(ProContext)
}

export function useUserSwapHistory({
    account,
    chainId,
}: {
    account: string
    chainId: ChainId
}) {
    const { data: userHistoryData } = useSWR<UserHistoryResponse, Error>(
        `https://api.sushipro.io/?api_key=EatSushiIsGood&act=user_transactions&chainID=${chainId}&address=${account.toLowerCase()}`
    )

    return userHistoryData ? userHistoryData.results : []
}

export function useSwapHistory({
    pair,
    chainId,
}: {
    pair: Pair
    chainId: ChainId
}) {
    const { data: swapHistoryData } = useSWR<SwapMessageResponse, Error>(
        `https://api.sushipro.io/?api_key=EatSushiIsGood&act=last_transactions&chainID=${chainId}&pair=${pair.liquidityToken.address.toLowerCase()}`
    )

    return swapHistoryData ? swapHistoryData.results : []
}

export function usePairData({
    pair,
    chainId,
    oneDayBlock,
    twoDayBlock,
}: {
    pair: Pair
    chainId: ChainId
    oneDayBlock: number
    twoDayBlock: number
}) {
    const query = `
        query queryData($id: String!, $oneDayBlock: Int!, $twoDayBlock: Int!) {
            current: pair(id: $id) {
                id
                reserveUSD
                volumeUSD
                untrackedVolumeUSD
                txCount
            }
            oneDay: pair(id: $id, block: {number: $oneDayBlock}) {
                id
                reserveUSD
                volumeUSD
                untrackedVolumeUSD
                txCount
            }
            twoDay: pair(id: $id, block: {number: $twoDayBlock}) {
                id
                reserveUSD
                volumeUSD
                untrackedVolumeUSD
                txCount
            }
        }
    `

    const call = useMemo(
        () => [
            chainId,
            query,
            {
                id: pair.liquidityToken.address.toLowerCase(),
                oneDayBlock,
                twoDayBlock,
            },
        ],
        [chainId, pair.liquidityToken.address, oneDayBlock, twoDayBlock]
    )

    const { data: pairData } = useSWR(call, exchange)
    return pairData
}
