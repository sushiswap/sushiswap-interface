import {
    getEthPrice,
    getTokenPrices,
    getTokenSubset,
    getTokens,
} from './exchange'

import { ChainId } from '@sushiswap/sdk'
import { lendingPairSubsetQuery } from '../queries/bentobox'
import { request } from 'graphql-request'
import { tokens } from '@sushiswap/sushi-data/typings/exchange'

export const BENTOBOX = {
    [ChainId.MAINNET]: 'sushiswap/bentobox',
    [ChainId.XDAI]: 'sushiswap/xdai-bentobox',
    [ChainId.MATIC]: 'sushiswap/matic-bentobox',
    [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
    [ChainId.BSC]: 'sushiswap/bsc-bentobox',
}
export const bentobox = async (query, chainId = ChainId.MAINNET) =>
    request(
        `https://api.thegraph.com/subgraphs/name/${BENTOBOX[chainId]}`,
        query
    )

export const getLendingPairSubset = async (
    chainId = ChainId.MAINNET,
    variables = undefined
) => {
    console.log('getLendingPairSubset')
    const { kashiPairs } = await request(
        `https://api.thegraph.com/subgraphs/name/${BENTOBOX[chainId]}`,
        lendingPairSubsetQuery,
        variables
    )
    console.log('getLendingPairSubset', {
        kashiPairs,
        assetIds: kashiPairs.map((pair) => pair.asset.id),
    })
    // const ethPrice = await getEthPrice()

    const assets = await getTokenSubset(chainId, {
        tokenAddresses: kashiPairs.map((pair) => pair.asset.id),
    })
    console.log('getLendingPairSubset assets', { assets })
    // const prices = await getTokenPrices(
    //     chainId,
    //     pairs.map((pair) => pair.asset.id)
    // )

    // let stakedAmt = assetPool.slpBalance * 1e18;
    // let balanceUSD = (stakedAmt * asset.derivedETH * results.ethUSD) / (10 ** result.asset.decimals);

    return kashiPairs.map((pair) => ({
        ...pair,
        token0: {
            ...pair.asset,
            ...assets.find((token) => token.id === pair.asset.id),
        },
        token1: {
            ...pair.collateral,
        },
    }))
}
