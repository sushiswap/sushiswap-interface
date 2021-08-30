import { useBlock, useNativePrice, useTokens } from '../../../services/graph'

import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import Search from '../../../components/Search'
import TokenList from '../../../features/analytics/Tokens/TokenList'
import { useFuse } from '../../../hooks'

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
            volume24h: token.volumeUSD - token1d.volumeUSD,
            price: token.derivedETH * nativePrice,
            change1d: ((token.derivedETH * nativePrice) / (token1d.derivedETH * nativePrice1d)) * 100 - 100,
            change1w: ((token.derivedETH * nativePrice) / (token1w.derivedETH * nativePrice1w)) * 100 - 100,
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
      <div className="flex flex-row items-center">
        <div className="ml-3 text-2xl font-bold text-high-emphesis">Tokens</div>
      </div>
      <Search term={term} search={search} />
      <TokenList tokens={tokensSearched} />
    </AnalyticsContainer>
  )
}
