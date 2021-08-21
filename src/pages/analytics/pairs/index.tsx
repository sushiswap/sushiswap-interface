import { useBlock, useSushiPairs } from '../../../services/graph'
import { useMemo, useState } from 'react'

import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import PairList from '../../../features/analytics/Pairs/PairList'
import PairTabs from '../../../features/analytics/Pairs/PairTabs'
import Search from '../../../components/Search'
import { useFuse } from '../../../hooks'
import { useRouter } from 'next/router'

export default function Pairs() {
  const [type, setType] = useState<'all' | 'gainers' | 'losers'>('all')

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })
  const block1w = useBlock({ daysAgo: 7 })
  const block2w = useBlock({ daysAgo: 14 })

  const pairs = useSushiPairs()
  const pairs1d = useSushiPairs({ block: { number: Number(block1d) } })
  const pairs2d = useSushiPairs(type !== 'all' ? { block: { number: Number(block2d) } } : undefined) // No need to fetch if we don't need the data
  const pairs1w = useSushiPairs({ block: { number: Number(block1w) } })
  const pairs2w = useSushiPairs(type !== 'all' ? { block: { number: Number(block2w) } } : undefined)

  const pairsFormatted = useMemo(() => {
    return type === 'all'
      ? pairs && pairs1d && pairs1w
        ? pairs.map((pair) => {
            const pair1d = pairs1d.find((p) => pair.id === p.id) ?? pair
            const pair1w = pairs1w.find((p) => pair.id === p.id) ?? pair1d

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
        : []
      : pairs && pairs1d && pairs2d && pairs1w && pairs2w
      ? pairs
          .map((pair) => {
            const pair1d = pairs1d.find((p) => pair.id === p.id) ?? pair
            const pair2d = pairs2d.find((p) => pair.id === p.id) ?? pair1d
            const pair1w = pairs1w.find((p) => pair.id === p.id) ?? pair2d
            const pair2w = pairs2w.find((p) => pair.id === p.id) ?? pair1w

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
      : []
  }, [type, pairs, pairs1d, pairs2d, pairs1w, pairs2w])

  const options = useMemo(
    () => ({
      keys: ['pair.currency0', 'pair.currency1', 'pair.symbol0', 'pair.symbol1', 'pair.name0', 'pair.name1'],
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
      <div className="flex flex-row items-center">
        <div className="ml-3 text-2xl font-bold text-high-emphesis">Pairs</div>
      </div>
      <Search term={term} search={search} />
      <PairTabs currentType={type} setType={setType} />
      <PairList pairs={pairsSearched} type={type} />
    </AnalyticsContainer>
  )
}
