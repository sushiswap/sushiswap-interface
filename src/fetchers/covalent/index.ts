import { ChainId } from '@sushiswap/sdk'

// CLASS A

export const getTokenBalances = (chainId = ChainId.MAINNET, address) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
    )

export const getPortfolio = (chainId = ChainId.MAINNET, address) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/portfolio_v2/`
    )

export const getTransfers = (chainId = ChainId.MAINNET, address) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`
    )

export const getBlock = (chainId = ChainId.MAINNET, blockHeight) =>
    fetch(`https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`)

export const getBlockHeights = (
    chainId = ChainId.MAINNET,
    startDate,
    endDate
) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`
    )

export const getLogs = (chainId = ChainId.MAINNET, address) =>
    fetch(`https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`)

export const getLogsForTopic = (chainId = ChainId.MAINNET, topic) =>
    fetch(`https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`)

export const getNftMetadata = (chainId = ChainId.MAINNET, address, tokenId) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`
    )

export const getNftTokenIds = (chainId = ChainId.MAINNET, address) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`
    )

export const getNftTransactions = (
    chainId = ChainId.MAINNET,
    address,
    tokenId
) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`
    )

export const getHoldersChanges = (chainId = ChainId.MAINNET, address) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`
    )

export const getTokenHolders = (chainId = ChainId.MAINNET, address) =>
    fetch(
        `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`
    )

export const getTokenMetadata = (chainId = ChainId.MAINNET, id) =>
    fetch(`https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`)

export const getTransaction = (chainId = ChainId.MAINNET, txHash) =>
    fetch(`https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`)

export const getChains = () => fetch(`https://api.covalenthq.com/v1/chains/`)

export const getChainsStatus = () =>
    fetch(`https://api.covalenthq.com/v1/chains/status/`)

// CLASS B
