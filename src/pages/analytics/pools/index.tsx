import Head from 'next/head'
import { useMemo } from 'react'
import Container from '../../../components/Container'
import Search from '../../../components/Search'
import Menu from '../../../features/analytics/AnalyticsMenu'
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

            if (pair.asset) console.log(pair)

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
    <>
      <Head>
        <title>SushiSwap Liquidity Pair (SLP) Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>

      <Container maxWidth="full" className="grid h-full grid-flow-col grid-cols-5 mx-auto gap-9">
        <div className="sticky top-0 hidden lg:block md:col-span-1" style={{ maxHeight: '40rem' }}>
          <Menu />
        </div>
        <div className="col-span-5 space-y-6 lg:col-span-4">
          <div className="ml-3 text-2xl font-bold text-high-emphesis">Pools</div>
          <Search term={term} search={search} />
          <PoolList pools={poolsSearched} />
        </div>
      </Container>
    </>
  )
}
