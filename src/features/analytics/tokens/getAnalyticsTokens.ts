import { ChainId } from '@figswap/core-sdk'
import { getBentoStrategies, getBlockDaysAgo, getNativePrice, getTokens } from 'app/services/graph'

interface getAnalyticsTokensProps {
  chainId: ChainId
  first?: number
}

export default async function getAnalyticsTokens({ chainId, first }: getAnalyticsTokensProps) {
  const [block1d, block1w] = await Promise.all([getBlockDaysAgo(chainId, 1), getBlockDaysAgo(chainId, 7)])

  const [nativePrice, nativePrice1d, nativePrice1w, tokens, tokens1d, tokens1w, strategies] = await Promise.all([
    getNativePrice(chainId),
    getNativePrice(chainId, { block: block1d }),
    getNativePrice(chainId, { block: block1w }),
    getTokens(chainId, { first }),
    getTokens(chainId, { first, block: block1d }),
    getTokens(chainId, { first, block: block1w }),
    getBentoStrategies(chainId),
  ])

  return (
    // @ts-ignore TYPE NEEDS FIXING
    tokens.map((token) => {
      // @ts-ignore TYPE NEEDS FIXING
      const token1d = tokens1d.find((t) => token.id === t.id) ?? token
      // @ts-ignore TYPE NEEDS FIXING
      const token1w = tokens1w.find((t) => token.id === t.id) ?? token

      const strategy = strategies.find((strategy) => strategy.token === token.id) ?? null

      return {
        token: {
          id: token.id,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
        },
        liquidity: token.liquidity * token.derivedETH * nativePrice,
        volume1d: token.volumeUSD - token1d.volumeUSD,
        volume1w: token.volumeUSD - token1w.volumeUSD,
        price: token.derivedETH * nativePrice,
        strategy,
        change1d: ((token.derivedETH * nativePrice) / (token1d.derivedETH * nativePrice1d)) * 100 - 100,
        change1w: ((token.derivedETH * nativePrice) / (token1w.derivedETH * nativePrice1w)) * 100 - 100,
        graph: token.dayData
          .slice(0)
          .reverse()
          // @ts-ignore TYPE NEEDS FIXING
          .map((day, i) => ({ x: i, y: Number(day.priceUSD) })),
      }
    })
  )
}
