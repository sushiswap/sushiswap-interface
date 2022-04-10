import { Feature } from 'app/enums'
import InfoCard from 'app/features/analytics/bar/InfoCard'
import { DiscoverHeader } from 'app/features/analytics/bentobox/DiscoverHeader'
import TokenTable from 'app/features/analytics/bentobox/TokenTable'
import TokenSearch from 'app/features/analytics/tokens/TokenSearch'
import { featureEnabled } from 'app/functions/feature'
import { formatNumber } from 'app/functions/format'
import useFuse from 'app/hooks/useFuse'
import { TridentBody } from 'app/layouts/Trident'
import { useBentoBox, useBentoStrategies, useBentoTokens, useNativePrice, useTokens } from 'app/services/graph'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'
export default function BentoBox(): JSX.Element {
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  const nativePrice = useNativePrice({ chainId })

  // @ts-ignore TYPE NEEDS FIXING
  const bentoBox = useBentoBox({ chainId, shouldFetch: featureEnabled(Feature.BENTOBOX, chainId) })

  const bentoBoxTokens = useBentoTokens({ chainId, shouldFetch: featureEnabled(Feature.BENTOBOX, chainId) })

  const bentoBoxTokenAddresses = useMemo(() => {
    if (!bentoBoxTokens || !bentoBoxTokens.length) {
      return []
    }
    // @ts-ignore
    return bentoBoxTokens.map((token) => token.id)
  }, [bentoBoxTokens])

  // Get exchange data
  const tokens = useTokens({
    chainId,
    shouldFetch: bentoBoxTokenAddresses && bentoBoxTokenAddresses.length,
    variables: {
      where: {
        id_in: bentoBoxTokenAddresses,
      },
    },
  })

  // Creating map to easily reference TokenId -> Token
  const tokenIdToPrice = useMemo<
    Map<string, { derivedETH: number; volumeUSD: number; dayData: Array<{ priceUSD: number }> }>
  >(() => {
    // @ts-ignore TYPE NEEDS FIXING
    return new Map(tokens?.map((token) => [token.id, token]))
  }, [tokens])

  const strategies = useBentoStrategies({ chainId })

  const formatted = useMemo<Array<any>>(() => {
    if (!bentoBoxTokens || !bentoBoxTokens.length || !tokens || !tokens.length) {
      return []
    }
    return (
      bentoBoxTokens
        // @ts-ignore
        .map(({ id, rebase, decimals, symbol, name }) => {
          const token = tokenIdToPrice.get(id)
          const supply = rebase.elastic
          const tokenDerivedETH = token?.derivedETH
          const price = (tokenDerivedETH ?? 0) * nativePrice
          const tvl = price * supply

          // @ts-ignore
          const strategy = strategies?.find((strategy) => strategy.token === id)

          return {
            token: {
              id,
              symbol,
              name,
              decimals,
            },
            strategy,
            price,
            liquidity: tvl,
          }
        })
        .filter(Boolean)
    )
  }, [bentoBoxTokens, tokens, tokenIdToPrice, nativePrice, strategies])

  const {
    result: tokensSearched,
    term,
    search,
  } = useFuse({
    options: {
      keys: ['token.address', 'token.symbol', 'token.name'],
      threshold: 0.4,
    },
    data: formatted,
  })

  return (
    <>
      <NextSeo title={`BentoBox Anlytics`} />
      <DiscoverHeader />
      <TridentBody>
        <div className="text-2xl font-bold text-high-emphesis">KPIs</div>
        <div className="flex flex-row space-x-4 overflow-auto">
          <InfoCard
            text="TVL"
            number={formatNumber(
              formatted?.reduce((prev, curr) => prev + curr.liquidity, 0),
              true,
              false
            )}
          />
          <InfoCard text="User Count" number={bentoBox?.userCount || 0} />
          <InfoCard text="Token Count" number={bentoBox?.tokenCount || 0} />
          <InfoCard text="Flashloan Count" number={bentoBox?.flashloanCount || 0} />
          <InfoCard text="Transaction Count" number={bentoBox?.transactionCount || 0} />
          {/* <InfoCard text="Master Contract Count" number={bentoBox?.masterContractCount || 0} /> */}
          {/* <InfoCard text="Clone Count" number={bentoBox?.cloneCount || 0} /> */}
        </div>

        <div className="flex flex-col w-full gap-10">
          <TokenSearch />
          <TokenTable chainId={chainId} />
        </div>
      </TridentBody>
    </>
  )
}
