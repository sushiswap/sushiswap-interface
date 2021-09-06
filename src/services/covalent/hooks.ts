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

import { useActiveWeb3React } from '../../hooks'
import useSWR from 'swr'

// CLASS A
export function useTokenBalances({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
    () => getTokenBalances(chainId, address),
    { fallbackData }
  )
  return data
}

export function usePortfolio({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/add{ data }s/${address}/portfolio_v2/`,
    () => getPortfolio(chainId, address),
    { fallbackData }
  )
  return data
}

export function useTransfers({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`,
    () => getTransfers(chainId, address),
    { fallbackData }
  )
  return data
}

export function useBlock({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, blockHeight }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`,
    () => getBlock(chainId, blockHeight),
    { fallbackData }
  )
  return data
}

export function useBlockHeights({
  fallbackData = undefined,
  chainId = useActiveWeb3React().chainId,
  startDate,
  endDate,
}) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`,
    () => getBlockHeights(chainId, startDate, endDate),
    { fallbackData }
  )
  return data
}

export function useLogs({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`,
    () => getLogs(chainId, address),
    { fallbackData }
  )
  return data
}

export function useLogsForTopic({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, topic }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`,
    () => getLogsForTopic(chainId, topic),
    { fallbackData }
  )
  return data
}

export function useNftMetadata({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address, tokenId }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`,
    () => getNftMetadata(chainId, address, tokenId),
    { fallbackData }
  )
  return data
}

export function useNftTokenIds({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`,
    () => getNftTokenIds(chainId, address),
    { fallbackData }
  )
  return data
}

export function useNftTransactions({
  fallbackData = undefined,
  chainId = useActiveWeb3React().chainId,
  address,
  tokenId,
}) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`,
    () => getNftTransactions(chainId, address, tokenId),
    { fallbackData }
  )
  return data
}

export function useHoldersChanges({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`,
    () => getHoldersChanges(chainId, address),
    { fallbackData }
  )
  return data
}

export function useHolders({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`,
    () => getTokenHolders(chainId, address),
    { fallbackData }
  )
  return data
}

export function useTokenMetadata({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, id }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`,
    () => getTokenMetadata(chainId, id),
    { fallbackData }
  )
  return data
}

export function useTransaction({ fallbackData = undefined, chainId = useActiveWeb3React().chainId, txHash }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`,
    () => getTransaction(chainId, txHash),
    { fallbackData }
  )
  return data
}

export function useChains({ fallbackData = undefined }) {
  const { data } = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChains(), { fallbackData })
  return data
}

export function useChainsStatus({ fallbackData = undefined }) {
  const { data } = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChainsStatus(), { fallbackData })
  return data
}

// TODO: CLASS B
