import { useMemo } from 'react'
import Search from '../../../components/Search'
import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import PoolList from '../../../features/analytics/Pools/PoolsList'
import { useFuse } from '../../../hooks'
import { useFarms, useKashiPairs, useSushiPairs } from '../../../services/graph'

// TODO: Rewards, APR
export default function Pools(): JSX.Element {
  const pairs = useSushiPairs()
  const farms = useFarms()
  const kashiPairs = useKashiPairs()

  const farmsFormatted = useMemo(() => {
    return farms && pairs && kashiPairs
      ? farms
          .map((farm) => {
            const pair = pairs.find((pair) => pair.id === farm.pair) ?? kashiPairs.find((pair) => pair.id === farm.pair)

            if (!pair) return undefined

            return {
              pair: {
                address0: pair.token0.id,
                address1: pair.token1.id,
                symbol: pair.symbol ?? `${pair.token0.symbol}-${pair.token1.symbol}`,
              },
              rewards: [{ address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', amount: 10 }],
              liquidity: pair.reserveUSD ?? 1000000,
              apr: 10,
            }
          })
          .filter((farm) => (farm ? true : false))
      : []
  }, [farms, pairs, kashiPairs])

  const options = useMemo(
    () => ({
      keys: ['pair.address0', 'pair.address1', 'pair.symbol'],
      threshold: 0.4,
    }),
    []
  )

  const {
    result: poolsSearched,
    term,
    search,
  } = useFuse({
    data: farmsFormatted,
    options,
  })

  return (
    <AnalyticsContainer>
      <div className="ml-3 text-2xl font-bold text-high-emphesis">Pools</div>
      <Search term={term} search={search} />
      <PoolList pools={poolsSearched} />
    </AnalyticsContainer>
  )
}
