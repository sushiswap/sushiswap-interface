import Search from 'app/components/Search'
import { Feature } from 'app/enums'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import InfoCard from 'app/features/analytics/Bar/InfoCard'
import TokenList from 'app/features/analytics/Tokens/TokenList'
import { featureEnabled } from 'app/functions/feature'
import { formatNumber } from 'app/functions/format'
import useFuse from 'app/hooks/useFuse'
import { useBentoBox, useNativePrice, useOneDayBlock, useOneWeekBlock, useTokens } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

export default function BentoBox(): JSX.Element {
  const { chainId } = useActiveWeb3React()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId })

  const nativePrice = useNativePrice({ chainId })
  const nativePrice1d = useNativePrice({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const nativePrice1w = useNativePrice({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

  // Get exchange data
  const tokens = useTokens({ chainId })
  const tokens1d = useTokens({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const tokens1w = useTokens({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

  // Creating map to easily reference TokenId -> Token
  const tokenIdToPrice = useMemo<
    Map<string, { derivedETH: number; volumeUSD: number; dayData: Array<{ priceUSD: number }> }>
  >(() => {
    // @ts-ignore TYPE NEEDS FIXING
    return new Map(tokens?.map((token) => [token.id, token]))
  }, [tokens])

  const token1dIdToPrice = useMemo<Map<string, { derivedETH: number; volumeUSD: number }>>(() => {
    // @ts-ignore TYPE NEEDS FIXING
    return new Map(tokens1d?.map((token) => [token.id, token]))
  }, [tokens1d])

  const token1wIdToPrice = useMemo<Map<string, { derivedETH: number; volumeUSD: number }>>(() => {
    // @ts-ignore TYPE NEEDS FIXING
    return new Map(tokens1w?.map((token) => [token.id, token]))
  }, [tokens1w])

  // @ts-ignore TYPE NEEDS FIXING
  const bentoBox = useBentoBox({ chainId, shouldFetch: featureEnabled(Feature.BENTOBOX, chainId) })

  // Combine Bento Box Tokens with Token data from exchange
  const bentoBoxTokensFormatted = useMemo<Array<any>>(
    () =>
      (bentoBox?.tokens || [])
        // @ts-ignore TYPE NEEDS FIXING
        .map(({ id, totalSupplyElastic, decimals, symbol, name }) => {
          const token = tokenIdToPrice.get(id)
          const token1d = token1dIdToPrice.get(id)
          const token1w = token1wIdToPrice.get(id)

          const supply = totalSupplyElastic / Math.pow(10, decimals)
          const tokenDerivedETH = token?.derivedETH
          const price = (tokenDerivedETH ?? 0) * nativePrice
          const tvl = price * supply

          const token1dPrice = (token1d?.derivedETH ?? 0) * nativePrice1d
          const token1wPrice = (token1w?.derivedETH ?? 0) * nativePrice1w

          return {
            token: {
              id,
              symbol,
              name,
            },
            price,
            liquidity: tvl,
            change1d: (price / token1dPrice) * 100 - 100,
            change1w: (price / token1wPrice) * 100 - 100,
            graph: token?.dayData
              .slice(0)
              .reverse()
              .map((day, i) => ({ x: i, y: Number(day.priceUSD) })),
          }
        })
        .filter(Boolean),
    [bentoBox, tokenIdToPrice, nativePrice, token1dIdToPrice, token1wIdToPrice, nativePrice1d, nativePrice1w]
  )

  const {
    result: searched,
    term,
    search,
  } = useFuse({
    options: {
      keys: ['token.address', 'token.symbol', 'token.name'],
      threshold: 0.4,
    },
    data: bentoBoxTokensFormatted,
  })

  return (
    <AnalyticsContainer>
      <Background background="dashboard">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Bento Box</div>
            <div className="">Click on the column name to sort tokens by price or liquidity.</div>
          </div>
          <Search term={term} search={search} />
        </div>
      </Background>
      <div className="py-6 space-y-4 lg:px-14">
        <div className="text-2xl font-bold text-high-emphesis">Overview</div>
        <div className="flex flex-row space-x-4 overflow-auto">
          <InfoCard
            text="TVL"
            number={formatNumber(
              bentoBoxTokensFormatted.reduce((prev, curr) => prev + curr.liquidity, 0),
              true,
              false
            )}
          />
          <InfoCard text="Total Users" number={formatNumber(bentoBox?.totalUsers)} />
          <InfoCard text="Total Tokens" number={bentoBox?.totalTokens} />
          <InfoCard text="Total Kashi Pairs" number={bentoBox?.totalKashiPairs} />
        </div>
      </div>
      <div className="py-6 space-y-4 text-2xl font-bold text-high-emphesis lg:px-14">Tokens</div>
      <div className="pt-4 lg:px-14">
        <TokenList tokens={searched} enabledColumns={['name', 'liquidity', 'price', 'priceChange', 'lastWeekGraph']} />
      </div>
    </AnalyticsContainer>
  )
}
