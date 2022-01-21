import Search from 'app/components/Search'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import PairList from 'app/features/analytics/Pairs/PairList'
import PairTabs from 'app/features/analytics/Pairs/PairTabs'
import useFuse from 'app/hooks/useFuse'
import { useOneDayBlock, useOneWeekBlock, useSushiPairs, useTwoDayBlock, useTwoWeekBlock } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo, useState } from 'react'

export default function Pairs() {
  const [type, setType] = useState<'all' | 'gainers' | 'losers'>('all')

  const { chainId } = useActiveWeb3React()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })
  const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId })
  const block2w = useTwoWeekBlock({ chainId, shouldFetch: !!chainId })

  const pairs = useSushiPairs({ chainId })
  const pairs1d = useSushiPairs({ variables: { block: block1d }, shouldFetch: !!block1d, chainId })
  const pairs2d = useSushiPairs({ variables: { block: block2d }, shouldFetch: !!block2d && type !== 'all', chainId }) // No need to fetch if we don't need the data
  const pairs1w = useSushiPairs({ variables: { block: block1w }, shouldFetch: !!block1w, chainId })
  const pairs2w = useSushiPairs({ variables: { block: block2w }, shouldFetch: !!block2w && type !== 'all', chainId })

  const pairsFormatted = useMemo(() => {
    return type === 'all'
      ? // @ts-ignore TYPE NEEDS FIXING
        pairs?.map((pair) => {
          // @ts-ignore TYPE NEEDS FIXING
          const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
          // @ts-ignore TYPE NEEDS FIXING
          const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d

          return {
            pair: {
              token0: pair.token0,
              token1: pair.token1,
              id: pair.id,
            },
            liquidity: pair.reserveUSD,
            volume1d: pair.volumeUSD - pair1d.volumeUSD,
            volume1w: pair.volumeUSD - pair1w.volumeUSD,
          }
        })
      : pairs
          // @ts-ignore TYPE NEEDS FIXING
          ?.map((pair) => {
            // @ts-ignore TYPE NEEDS FIXING
            const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
            // @ts-ignore TYPE NEEDS FIXING
            const pair2d = pairs2d?.find((p) => pair.id === p.id) ?? pair1d
            // @ts-ignore TYPE NEEDS FIXING
            const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair2d
            // @ts-ignore TYPE NEEDS FIXING
            const pair2w = pairs2w?.find((p) => pair.id === p.id) ?? pair1w

            return {
              pair: {
                token0: pair.token0,
                token1: pair.token1,
                id: pair.id,
              },
              liquidityChangeNumber1d: pair.reserveUSD - pair1d.reserveUSD,
              liquidityChangePercent1d: (pair.reserveUSD / pair1d.reserveUSD) * 100 - 100,
              liquidityChangeNumber1w: pair.reserveUSD - pair1w.reserveUSD,
              liquidityChangePercent1w: (pair.reserveUSD / pair1w.reserveUSD) * 100 - 100,

              volumeChangeNumber1d: pair.volumeUSD - pair1d.volumeUSD - (pair1d.volumeUSD - pair2d.volumeUSD),
              volumeChangePercent1d:
                ((pair.volumeUSD - pair1d.volumeUSD) / (pair1d.volumeUSD - pair2d.volumeUSD)) * 100 - 100,
              volumeChangeNumber1w: pair.volumeUSD - pair1w.volumeUSD - (pair1w.volumeUSD - pair2w.volumeUSD),
              volumeChangePercent1w:
                ((pair.volumeUSD - pair1w.volumeUSD) / (pair1w.volumeUSD - pair2w.volumeUSD)) * 100 - 100,
            }
          })
          // @ts-ignore TYPE NEEDS FIXING
          .sort((a, b) => b.liquidityChangeNumber1d - a.liquidityChangeNumber1d)
  }, [type, pairs, pairs1d, pairs2d, pairs1w, pairs2w])

  const options = useMemo(
    () => ({
      keys: ['pair.token0.symbol', 'pair.token1.symbol', 'pair.token0.name', 'pair.token1.name'],
      threshold: 0.4,
    }),
    []
  )

  const {
    result: pairsSearched,
    term,
    search,
  } = useFuse({
    data: pairsFormatted,
    options,
  })

  return (
    <AnalyticsContainer>
      <Background background="pools">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Pairs</div>
            <div className="">Click on the column name to sort pairs by its TVL, volume or fees gained.</div>
          </div>
          <Search term={term} search={search} />
        </div>
      </Background>
      <PairTabs currentType={type} setType={setType} />
      <div className="px-4 pt-4 lg:px-14">
        <PairList pairs={pairsSearched} type={type} />
      </div>
    </AnalyticsContainer>
  )
}
