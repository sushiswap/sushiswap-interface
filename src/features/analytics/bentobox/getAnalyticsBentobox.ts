import { ChainId } from '@sushiswap/core-sdk'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { getBentoBox, getBentoStrategies, getBentoTokens, getNativePrice, getTokens } from 'app/services/graph'

export type AnalyticsBentobox = Awaited<ReturnType<typeof getAnalyticsBentobox>>

interface getAnalyticsBentoboxProps {
  chainId: ChainId
  first?: number
}

export default async function getAnalyticsBentobox({ chainId }: getAnalyticsBentoboxProps) {
  if (!featureEnabled(Feature.BENTOBOX, chainId)) return undefined

  const [nativePrice, bentoBox, bentoBoxTokens, strategies] = await Promise.all([
    getNativePrice(chainId) as Promise<number>,
    getBentoBox(chainId),
    getBentoTokens(chainId) as Promise<Array<any>>,
    getBentoStrategies(chainId) as Promise<Array<any>>,
  ])

  const bentoBoxTokenAddresses = bentoBoxTokens.map((bentoToken: { id: string }) => bentoToken.id)

  // Get exchange data
  const tokens: Array<any> = await getTokens(chainId, {
    where: {
      id_in: bentoBoxTokenAddresses,
    },
  })

  // Creating map to easily reference TokenId -> Token
  const tokenIdToPrice: Map<string, { derivedETH: number; volumeUSD: number; dayData: Array<{ priceUSD: number }> }> =
    new Map(tokens?.map((token: any) => [token.id, token]))

  const bentoBoxTvl: number = bentoBoxTokens
    .map(({ id, rebase }: any) => {
      const token = tokenIdToPrice.get(id)
      return (token?.derivedETH ?? 0) * nativePrice * rebase.elastic
    })
    .filter(Boolean)
    .reduce((previousValue: any, currentValue: any) => previousValue + currentValue, 0)

  const bentoBoxTokensFormatted = bentoBoxTokens
    .map(({ id, rebase, decimals, symbol, name }: any) => {
      const token = tokenIdToPrice.get(id)
      const supply = rebase.elastic
      const tokenDerivedETH = token?.derivedETH
      const price = (tokenDerivedETH ?? 0) * nativePrice
      const tvl = price * supply

      const strategy = strategies?.find((strategy) => strategy.token === id)

      return {
        token: {
          id,
          symbol,
          name,
          decimals,
        },
        ...(strategy ? { strategy } : {}), // Can't leave it undefined because of serialization issues
        price,
        liquidity: tvl,
      }
    })
    .filter(Boolean)

  return {
    bentoBox: {
      ...bentoBox,
      tvl: bentoBoxTvl,
    },
    bentoBoxTokens: bentoBoxTokensFormatted,
  }
}
