import { useBlock, useSushiPairs } from '../../../services/graph'
import { useMemo, useState } from 'react'

import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import PairList from '../../../features/analytics/Pairs/PairList'
import PairTabs from '../../../features/analytics/Pairs/PairTabs'
import Search from '../../../components/Search'
import { useFuse } from '../../../hooks'
import Background from '../../../features/analytics/Background'

export default function Pairs() {
  const [type, setType] = useState<'all' | 'gainers' | 'losers'>('all')

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })
  const block1w = useBlock({ daysAgo: 7 })
  const block2w = useBlock({ daysAgo: 14 })

  const pairs = useSushiPairs()
  const pairs1d = useSushiPairs({ block: block1d, shouldFetch: !!block1d })
  const pairs2d = useSushiPairs({ block: block2d, shouldFetch: !!block2d && type !== 'all' }) // No need to fetch if we don't need the data
  const pairs1w = useSushiPairs({ block: block1w, shouldFetch: !!block1w })
  const pairs2w = useSushiPairs({ block: block2w, shouldFetch: !!block2w && type !== 'all' })

  const pairsFormatted = useMemo(() => {
    return type === 'all'
      ? pairs?.map((pair) => {
          const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
          const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d

          return {
            pair: {
              token0: pair.token0,
              token1: pair.token1,
              address: pair.id,
            },
            liquidity: pair.reserveUSD,
            volume1d: pair.volumeUSD - pair1d.volumeUSD,
            volume1w: pair.volumeUSD - pair1w.volumeUSD,
          }
        })
      : pairs
          ?.map((pair) => {
            const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
            const pair2d = pairs2d?.find((p) => pair.id === p.id) ?? pair1d
            const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair2d
            const pair2w = pairs2w?.find((p) => pair.id === p.id) ?? pair1w

            return {
              pair: {
                token0: pair.token0,
                token1: pair.token1,
                address: pair.id,
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
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Pairs</div>
            <div className="">
              Click on the column name to sort pairs by its TVL, <br /> volume or fees gained.
            </div>
          </div>
          <Search
            term={term}
            search={search}
            inputProps={{ className: 'placeholder-primary bg-opacity-50 w-full py-3 pl-4 pr-14 rounded bg-dark-900' }}
            className="border shadow-2xl border-dark-800"
          />
        </div>
      </Background>
      <PairTabs currentType={type} setType={setType} />
      <div className="pt-4 lg:px-14">
        <PairList pairs={pairsSearched} type={type} />
      </div>
    </AnalyticsContainer>
  )
}
