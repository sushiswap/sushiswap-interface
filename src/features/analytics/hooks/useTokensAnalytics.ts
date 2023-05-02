import { ChainId } from '@sushiswap/core-sdk'
import { useBentoStrategies, useNativePrice, useOneDayBlock, useOneWeekBlock, useTokens } from 'app/services/graph'
import { useEffect, useMemo, useState } from 'react'

export default function useTokensAnalytics({ chainId = ChainId.ETHEREUM }) {
  const [loadState, setLoadState] = useState<'loading' | 'initial' | 'loaded'>('loading')

  const { data: block1d } = useOneDayBlock({ chainId })
  const { data: block1w } = useOneWeekBlock({ chainId })

  const { data: nativePrice } = useNativePrice({ chainId })
  const { data: nativePrice1d } = useNativePrice({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const { data: nativePrice1w } = useNativePrice({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

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

  const strategies = useBentoStrategies({ chainId, shouldFetch: loadState !== 'loading' })

  useEffect(() => {
    if (loadState === 'loading' && !!tokens1dInitial && !!tokens1wInitial) setLoadState('initial')
    else if (!!tokens1d && !!tokens1w) setLoadState('loaded')
  }, [loadState, tokens1dInitial, tokens1wInitial, tokens1d, tokens1w])

  return useMemo(
    () =>
      // @ts-ignore TYPE NEEDS FIXING
      (loadState === 'loaded' ? tokens : tokensInitial)?.map((token) => {
        // @ts-ignore TYPE NEEDS FIXING
        const token1d = (loadState === 'loaded' ? tokens1d : tokens1dInitial)?.find((t) => token.id === t.id) ?? token
        // @ts-ignore TYPE NEEDS FIXING
        const token1w = (loadState === 'loaded' ? tokens1w : tokens1wInitial)?.find((t) => token.id === t.id) ?? token

        const strategy = strategies?.find((strategy) => strategy.token === token.id)

        return {
          token: {
            id: token.id,
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
          },
          liquidity: token.liquidityUSD,
          volume1d: token.volumeUSD - token1d.volumeUSD,
          volume1w: token.volumeUSD - token1w.volumeUSD,
          price: token.price.derivedNative * nativePrice,
          strategy,
          change1d:
            ((token.price.derivedNative * nativePrice) / (token1d.price.derivedNative * nativePrice1d)) * 100 - 100,
          change1w:
            ((token.price.derivedNative * nativePrice) / (token1w.price.derivedNative * nativePrice1w)) * 100 - 100,
        }
      }),
    [
      loadState,
      tokens,
      tokensInitial,
      tokens1d,
      tokens1dInitial,
      tokens1w,
      tokens1wInitial,
      strategies,
      nativePrice,
      nativePrice1d,
      nativePrice1w,
    ]
  )
}
