import { useBentoBox, useBlock, useNativePrice, useTokens } from '../../../services/graph'
import { useMemo } from 'react'

import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import Search from '../../../components/Search'
import TokenList from '../../../features/analytics/Tokens/TokenList'
import { useActiveWeb3React } from '../../../hooks'
import Background from '../../../features/analytics/Background'
import { formatNumber } from '../../../functions'
import InfoCard from '../../../features/analytics/Bar/InfoCard'

export default function Dashboard(): JSX.Element {
  const { chainId } = useActiveWeb3React()

  const block1d = useBlock({ daysAgo: 1, chainId })
  const block1w = useBlock({ daysAgo: 7, chainId })

  const nativePrice = useNativePrice({ chainId })
  const nativePrice1d = useNativePrice({ block: block1d, chainId })
  const nativePrice1w = useNativePrice({ block: block1w, chainId })

  const tokens = useTokens({ chainId })
  const tokens1d = useTokens({ block: block1d, shouldFetch: !!block1d, chainId })
  const tokens1w = useTokens({ block: block1w, shouldFetch: !!block1w, chainId })

  const tokenIdToPrice = useMemo<
    Map<string, { derivedETH: number; volumeUSD: number; dayData: Array<{ priceUSD: number }> }>
  >(() => {
    return tokens ? new Map(tokens.map((token) => [token.id, token])) : new Map([])
  }, [tokens])
  const token1dIdToPrice = useMemo<Map<string, { derivedETH: number; volumeUSD: number }>>(() => {
    return tokens1d ? new Map(tokens1d.map((token) => [token.id, token])) : new Map([])
  }, [tokens1d])
  const token1wIdToPrice = useMemo<Map<string, { derivedETH: number; volumeUSD: number }>>(() => {
    return tokens1w ? new Map(tokens1w.map((token) => [token.id, token])) : new Map([])
  }, [tokens1w])

  const bentoBox = useBentoBox({ chainId })

  const bentoBoxTokensFormatted = useMemo<Array<any>>(
    () =>
      (bentoBox?.tokens || [])
        .map(({ id, totalSupplyElastic, decimals, symbol, name }) => {
          const supply = totalSupplyElastic / Math.pow(10, decimals)

          const token = tokenIdToPrice.get(id)
          if (!token) {
            return undefined
          }
          const token1d = token1dIdToPrice.get(id)
          const token1w = token1wIdToPrice.get(id)

          const tokenDerivedETH = token?.derivedETH
          const price = (tokenDerivedETH ?? 0) * nativePrice
          const tvl = price * supply

          const token1dPrice = (token1d?.derivedETH ?? 0) * nativePrice1d
          const token1wPrice = (token1w?.derivedETH ?? 0) * nativePrice1w

          return {
            token: {
              address: id,
              symbol,
              name,
            },
            price,
            liquidity: tvl,
            change1d: (price / token1dPrice) * 100 - 100,
            change1w: (price / token1wPrice) * 100 - 100,
            volume1d: token?.volumeUSD - token1d?.volumeUSD,
            volume1w: token?.volumeUSD - token1w?.volumeUSD,
            graph: token?.dayData
              .slice(0)
              .reverse()
              .map((day, i) => ({ x: i, y: Number(day.priceUSD) })),
          }
        })
        .filter(Boolean),
    [bentoBox, tokenIdToPrice, nativePrice, token1dIdToPrice, token1wIdToPrice, nativePrice1d, nativePrice1w]
  )

  return (
    <AnalyticsContainer>
      <Background background="dashboard">
        <div className="grid items-center justify-between grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Bento Box</div>
            <div className="">Click on the column name to sort tokens by it&apos;s pass price or liquidity.</div>
          </div>
          <Search
            term={''}
            search={() => {}}
            inputProps={{ className: 'placeholder-primary bg-opacity-50 w-full py-3 pl-4 pr-14 rounded bg-dark-900' }}
            className="border shadow-2xl border-dark-800"
          />
        </div>
      </Background>
      <div className="py-6 space-y-4 px-14">
        <div className="text-2xl font-bold text-high-emphesis">Overview</div>
        <div className="flex flex-row space-x-4 overflow-auto">
          <InfoCard
            text="TVL"
            number={formatNumber(
              bentoBoxTokensFormatted.reduce((prev, curr) => prev + curr.liquidity, 0),
              true
            )}
          />
          <InfoCard text="Total Users" number={formatNumber(bentoBox?.totalUsers)} />
          <InfoCard text="Total Tokens" number={bentoBox?.totalTokens} />
          <InfoCard text="Total Kashi Pairs" number={bentoBox?.totalKashiPairs} />
        </div>
      </div>
      <div className="py-6 space-y-4 text-2xl font-bold text-high-emphesis px-14">Tokens</div>
      <div className="pt-4 lg:px-14">
        <TokenList tokens={bentoBoxTokensFormatted} />
      </div>
    </AnalyticsContainer>
  )
}
