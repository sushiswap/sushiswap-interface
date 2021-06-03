import {
    getBlock,
    getBlockHeights,
    getChains,
    getChainsStatus,
    getHoldersChanges,
    getLogs,
    getLogsForTopic,
    getNftMetadata,
    getNftTokenIds,
    getNftTransactions,
    getPortfolio,
    getSushiSwapBalances,
    getSushiSwapLiquidityTransactions,
    getTokenBalances,
    getTokenHolders,
    getTokenMetadata,
    getTransaction,
    getTransfers,
} from '../../fetchers/covalent'
import { startOfMinute, subDays } from 'date-fns'

import useSWR from 'swr'
import { useMemo } from 'react'

// CLASS A
export function useTokenBalances({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
        () => getTokenBalances(chainId, address),
        { initialData }
    )
    return res
}

export function usePorfolio({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/portfolio_v2/`,
        () => getPortfolio(chainId, address),
        { initialData }
    )
    return res
}

export function useTransfers({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`,
        () => getTransfers(chainId, address),
        { initialData }
    )
    return res
}

export function useBlock({ initialData, chainId, blockHeight }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`,
        () => getBlock(chainId, blockHeight),
        { initialData }
    )
    return res
}

export function useBlockHeights({ initialData, chainId, startDate, endDate }) {
    return useSWR([chainId, startDate, endDate], getBlockHeights, {
        initialData,
    })
}

export function useOneDayBlock({ chainId }) {
    const date = startOfMinute(subDays(Date.now(), 1))
    const inputData = useMemo(
        () => ({
            initialData: {
                data: { items: [{ height: 0 }] },
            },
            chainId,
            startDate: new Date(Math.floor(+date / 1000) * 1000).toISOString(),
            endDate: new Date(
                (Math.floor(+date / 1000) + 600) * 1000
            ).toISOString(),
        }),
        [chainId, date]
    )

    const { data } = useBlockHeights(inputData)
    return data.data.items[0].height
}

export function useTwoDayBlock({ chainId }) {
    const date = startOfMinute(subDays(Date.now(), 2))
    const inputData = useMemo(
        () => ({
            initialData: {
                data: { items: [{ height: 0 }] },
            },
            chainId,
            startDate: new Date(Math.floor(+date / 1000) * 1000).toISOString(),
            endDate: new Date(
                (Math.floor(+date / 1000) + 600) * 1000
            ).toISOString(),
        }),
        [chainId, date]
    )

    const { data } = useBlockHeights(inputData)
    return data.data.items[0].height
}

export function useLogs({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`,
        () => getLogs(chainId, address),
        { initialData }
    )
    return res
}

export function useLogsForTopic({ initialData, chainId, topic }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`,
        () => getLogsForTopic(chainId, topic),
        { initialData }
    )
    return res
}

export function useNftMetadata({ initialData, chainId, address, tokenId }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`,
        () => getNftMetadata(chainId, address, tokenId),
        { initialData }
    )
    return res
}

export function useNftTokenIds({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`,
        () => getNftTokenIds(chainId, address),
        { initialData }
    )
    return res
}

export function useNftTransactions({ initialData, chainId, address, tokenId }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`,
        () => getNftTransactions(chainId, address, tokenId),
        { initialData }
    )
    return res
}

export function useHoldersChanges({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`,
        () => getHoldersChanges(chainId, address),
        { initialData }
    )
    return res
}

export function useHolders({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`,
        () => getTokenHolders(chainId, address),
        { initialData }
    )
    return res
}

export function useTokenMetadata({ initialData, chainId, id }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`,
        () => getTokenMetadata(chainId, id),
        { initialData }
    )
    return res
}

export function useTransaction({ initialData, chainId, txHash }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`,
        () => getTransaction(chainId, txHash),
        { initialData }
    )
    return res
}

export function useChains({ initialData }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/chains/status/`,
        () => getChains(),
        { initialData }
    )
    return res
}

export function useChainsStatus({ initialData }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/chains/status/`,
        () => getChainsStatus(),
        { initialData }
    )
    return res
}

// TODO: CLASS B
export function useSushiSwapLiquidityTransaction({
    initialData = {},
    chainId,
    address,
}) {
    return useSWR([chainId, address], getSushiSwapLiquidityTransactions, {
        initialData,
    })
}

export function useSushiSwapBalances({ initialData = {}, chainId, address }) {
    console.log('hi')
    return useSWR([chainId, address], getSushiSwapBalances, { initialData })
}
