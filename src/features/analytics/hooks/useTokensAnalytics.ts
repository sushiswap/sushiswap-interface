import { useNativePrice, useOneDayBlock, useOneWeekBlock, useTokens } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useEffect, useMemo, useState } from 'react'

export default function useTokensAnalytics() {
  const [loadState, setLoadState] = useState<'loading' | 'initial' | 'loaded'>('loading')

  const { chainId } = useActiveWeb3React()

  const block1d = useOneDayBlock({ chainId })
  const block1w = useOneWeekBlock({ chainId })

  const nativePrice = useNativePrice({ chainId })
  const nativePrice1d = useNativePrice({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const nativePrice1w = useNativePrice({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

  const tokensInitial = useTokens({ chainId, variables: { first: 200 } })
  const tokens1dInitial = useTokens({
    chainId,
    variables: { first: 200, block: block1d },
    shouldFetch: !!block1d,
  })
  const tokens1wInitial = useTokens({
    chainId,
    variables: { first: 200, block: block1w },
    shouldFetch: !!block1w,
  })

  const tokens = useTokens({ chainId, shouldFetch: loadState !== 'loading' })
  const tokens1d = useTokens({
    chainId,
    variables: { block: block1d },
    shouldFetch: !!block1d && loadState !== 'loading',
  })
  const tokens1w = useTokens({
    chainId,
    variables: { block: block1w },
    shouldFetch: !!block1w && loadState !== 'loading',
  })

  useEffect(() => {
    if (loadState === 'loading' && !!tokens1dInitial && !!tokens1wInitial) setLoadState('initial')
    else if (!!tokens1d && !!tokens1w) setLoadState('loaded')
  }, [loadState, tokens1dInitial, tokens1wInitial, tokens1d, tokens1w])

  return useMemo(
    () =>
      // @ts-ignore TYPE NEEDS FIXING
      (loadState === 'loaded' ? tokens : tokensInitial)?.map((token) => {
        // @ts-ignore TYPE NEEDS FIXING
        const token1d = (loadState === 'loaded' ? tokens1d : tokens1dInitial)?.find((p) => token.id === p.id) ?? token
        // @ts-ignore TYPE NEEDS FIXING
        const token1w = (loadState === 'loaded' ? tokens1w : tokens1wInitial)?.find((p) => token.id === p.id) ?? token

        return {
          token: {
            id: token.id,
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
            // @ts-ignore TYPE NEEDS FIXING
            .map((day, i) => ({ x: i, y: Number(day.priceUSD) })),
        }
      }),
    [
      tokensInitial,
      tokens1dInitial,
      tokens1wInitial,
      tokens,
      tokens1d,
      tokens1w,
      nativePrice,
      nativePrice1d,
      nativePrice1w,
      loadState,
    ]
  )
}
