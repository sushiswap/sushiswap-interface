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
    getTokenBalances,
    getTokenHolders,
    getTokenMetadata,
    getTransaction,
    getTransfers,
} from '../../fetchers/covalent'

import useSWR from 'swr'

// CLASS A
export function useTokenBalances({ initialData, chainId, address }) {
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
        () => getTokenBalances(chainId, address),
        { initialData }
    )
    return res
}

export function usePortfolio({ initialData, chainId, address }) {
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
    const res = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`,
        () => getBlockHeights(chainId, startDate, endDate),
        { initialData }
    )
    return res
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
