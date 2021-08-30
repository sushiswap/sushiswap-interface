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
import { useActiveWeb3React } from '../../hooks'

// CLASS A
export function useTokenBalances({ initialData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
    () => getTokenBalances(chainId, address),
    { initialData }
  )
  return data
}

export function usePortfolio({ initialData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/add{ data }s/${address}/portfolio_v2/`,
    () => getPortfolio(chainId, address),
    { initialData }
  )
  return data
}

export function useTransfers({ initialData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`,
    () => getTransfers(chainId, address),
    { initialData }
  )
  return data
}

export function useBlock({ initialData = undefined, chainId = useActiveWeb3React().chainId, blockHeight }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`,
    () => getBlock(chainId, blockHeight),
    { initialData }
  )
  return data
}

export function useBlockHeights({
  initialData = undefined,
  chainId = useActiveWeb3React().chainId,
  startDate,
  endDate,
}) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`,
    () => getBlockHeights(chainId, startDate, endDate),
    { initialData }
  )
  return data
}

export function useLogs({ initialData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`,
    () => getLogs(chainId, address),
    { initialData }
  )
  return data
}

export function useLogsForTopic({ initialData = undefined, chainId = useActiveWeb3React().chainId, topic }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`,
    () => getLogsForTopic(chainId, topic),
    { initialData }
  )
  return data
}

export function useNftMetadata({ initialData = undefined, chainId = useActiveWeb3React().chainId, address, tokenId }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`,
    () => getNftMetadata(chainId, address, tokenId),
    { initialData }
  )
  return data
}

export function useNftTokenIds({ initialData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`,
    () => getNftTokenIds(chainId, address),
    { initialData }
  )
  return data
}

export function useNftTransactions({
  initialData = undefined,
  chainId = useActiveWeb3React().chainId,
  address,
  tokenId,
}) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`,
    () => getNftTransactions(chainId, address, tokenId),
    { initialData }
  )
  return data
}

export function useHoldersChanges({ initialData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`,
    () => getHoldersChanges(chainId, address),
    { initialData }
  )
  return data
}

export function useHolders({ initialData = undefined, chainId = useActiveWeb3React().chainId, address }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`,
    () => getTokenHolders(chainId, address),
    { initialData }
  )
  return data
}

export function useTokenMetadata({ initialData = undefined, chainId = useActiveWeb3React().chainId, id }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`,
    () => getTokenMetadata(chainId, id),
    { initialData }
  )
  return data
}

export function useTransaction({ initialData = undefined, chainId = useActiveWeb3React().chainId, txHash }) {
  const { data } = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`,
    () => getTransaction(chainId, txHash),
    { initialData }
  )
  return data
}

export function useChains({ initialData = undefined }) {
  const { data } = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChains(), { initialData })
  return data
}

export function useChainsStatus({ initialData = undefined }) {
  const { data } = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChainsStatus(), { initialData })
  return data
}

// TODO: CLASS B
