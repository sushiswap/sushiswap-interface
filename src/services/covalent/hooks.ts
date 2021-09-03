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
} from './fetchers'

import useSWR from 'swr'

// CLASS A
export function useTokenBalances({ fallbackData, chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
    () => getTokenBalances(chainId, address),
    { fallbackData }
  )
  return res
}

export function usePortfolio({ fallbackData, chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/portfolio_v2/`,
    () => getPortfolio(chainId, address),
    { fallbackData }
  )
  return res
}

export function useTransfers({ fallbackData, chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`,
    () => getTransfers(chainId, address),
    { fallbackData }
  )
  return res
}

export function useBlock({ fallbackData, chainId, blockHeight }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`,
    () => getBlock(chainId, blockHeight),
    { fallbackData }
  )
  return res
}

export function useBlockHeights({ fallbackData, chainId, startDate, endDate }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`,
    () => getBlockHeights(chainId, startDate, endDate),
    { fallbackData }
  )
  return res
}

export function useLogs({ fallbackData, chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`,
    () => getLogs(chainId, address),
    { fallbackData }
  )
  return res
}

export function useLogsForTopic({ fallbackData, chainId, topic }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`,
    () => getLogsForTopic(chainId, topic),
    { fallbackData }
  )
  return res
}

export function useNftMetadata({ fallbackData, chainId, address, tokenId }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`,
    () => getNftMetadata(chainId, address, tokenId),
    { fallbackData }
  )
  return res
}

export function useNftTokenIds({ fallbackData, chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`,
    () => getNftTokenIds(chainId, address),
    { fallbackData }
  )
  return res
}

export function useNftTransactions({ fallbackData, chainId, address, tokenId }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`,
    () => getNftTransactions(chainId, address, tokenId),
    { fallbackData }
  )
  return res
}

export function useHoldersChanges({ fallbackData, chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`,
    () => getHoldersChanges(chainId, address),
    { fallbackData }
  )
  return res
}

export function useHolders({ fallbackData, chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`,
    () => getTokenHolders(chainId, address),
    { fallbackData }
  )
  return res
}

export function useTokenMetadata({ fallbackData, chainId, id }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`,
    () => getTokenMetadata(chainId, id),
    { fallbackData }
  )
  return res
}

export function useTransaction({ fallbackData, chainId, txHash }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`,
    () => getTransaction(chainId, txHash),
    { fallbackData }
  )
  return res
}

export function useChains({ fallbackData }) {
  const res = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChains(), { fallbackData })
  return res
}

export function useChainsStatus({ fallbackData }) {
  const res = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChainsStatus(), { fallbackData })
  return res
}

// TODO: CLASS B
