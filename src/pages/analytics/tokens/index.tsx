import { useBlock, useNativePrice, useTokens } from '../../../services/graph'

import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import Search from '../../../components/Search'
import TokenList from '../../../features/analytics/Tokens/TokenList'
import { useFuse } from '../../../hooks'
import Background from '../../../features/analytics/Background'

export default function Tokens() {
  const block1d = useBlock({ daysAgo: 1 })
  const block1w = useBlock({ daysAgo: 7 })

  const nativePrice = useNativePrice()
  const nativePrice1d = useNativePrice({ block: block1d })
  const nativePrice1w = useNativePrice({ block: block1w })

  const tokens = useTokens()
  const tokens1d = useTokens({ block: block1d, shouldFetch: !!block1d })
  const tokens1w = useTokens({ block: block1w, shouldFetch: !!block1w })

  const tokensFormatted =
    tokens && tokens1d && tokens1w && nativePrice && nativePrice1d && nativePrice1w
      ? tokens.map((token) => {
          const token1d = tokens1d.find((p) => token.id === p.id) ?? token
          const token1w = tokens1w.find((p) => token.id === p.id) ?? token

          return {
            token: {
              address: token.id,
              symbol: token.symbol,
              name: token.name,
            },
            liquidity: token.liquidity * token.derivedETH * nativePrice,
            volume1d: token.volumeUSD - token1d.volumeUSD,
            volume1w: token.volumeUSD - token1w.volumeUSD,
            price: token.derivedETH * nativePrice,
            change1d: ((token.derivedETH * nativePrice) / (token1d.derivedETH * nativePrice1d)) * 100 - 100,
            change1w: ((token.derivedETH * nativePrice) / (token1w.derivedETH * nativePrice1w)) * 100 - 100,
            graph: token.dayData
              .slice(0)
              .reverse()
              .map((day, i) => ({ x: i, y: Number(day.priceUSD) })),
          }
        })
      : []

  const options = {
    keys: ['token.address', 'token.symbol', 'token.name'],
    threshold: 0.4,
  }

  const {
    result: tokensSearched,
    term,
    search,
  } = useFuse({
    data: tokensFormatted,
    options,
  })

  return (
    <AnalyticsContainer>
      <Background background="tokens">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Tokens</div>
            <div>Click on the column name to sort tokens by it&apos;s price or trading volume.</div>
          </div>
          <Search
            term={term}
            search={search}
            inputProps={{ className: 'placeholder-primary bg-opacity-50 w-full py-3 pl-4 pr-14 rounded bg-dark-900' }}
            className="border shadow-2xl border-dark-800"
          />
        </div>
      </Background>
      <div className="pt-4 lg:px-14">
        <TokenList tokens={tokensSearched} />
      </div>
    </AnalyticsContainer>
  )
}
