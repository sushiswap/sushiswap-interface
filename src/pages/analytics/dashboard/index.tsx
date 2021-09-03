import { useBlock, useEthPrice, useNativePrice, useSushiPairs, useTokens } from '../../../services/graph'
import { useMemo, useState } from 'react'

import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import DashboardChartCard from '../../../features/analytics/Dashboard/DashboardChartCard'
import DashboardTabs from '../../../features/analytics/Dashboard/DashboardTabs'
import PairList from '../../../features/analytics/Pairs/PairList'
import PoolList from '../../../features/analytics/Farms/FarmList'
import Search from '../../../components/Search'
import TokenList from '../../../features/analytics/Tokens/TokenList'
import useFarmRewards from '../../../hooks/useFarmRewards'
import { useFuse } from '../../../hooks'
import Background from '../../../features/analytics/Background'

export default function Dashboard(): JSX.Element {
  const [type, setType] = useState<'pools' | 'pairs' | 'tokens'>('pools')

  const block1d = useBlock({ daysAgo: 1 })
  const block1w = useBlock({ daysAgo: 7 })

  // For Top Pairs
  const pairs = useSushiPairs()
  const pairs1d = useSushiPairs({ block: block1d })
  const pairs1w = useSushiPairs({ block: block1w })

  const pairsFormatted = useMemo(
    () =>
      pairs?.map((pair) => {
        const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
        const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d

        return {
          pair: {
            token0: pair.token0,
            token1: pair.token1,
            address: pair.id,
          },
          liquidity: pair.reserveUSD,
          volume1d: pair.volumeUSD - pair1d?.volumeUSD,
          volume1w: pair.volumeUSD - pair1w?.volumeUSD,
        }
      }),
    [pairs, pairs1d, pairs1w]
  )

  // For Top Farms
  const farms = useFarmRewards()
  const nativePrice = useNativePrice()
  const farmsFormatted = useMemo(
    () =>
      farms
        ?.map((farm) => ({
          pair: {
            token0: farm.pair.token0,
            token1: farm.pair.token1,
            address: farm.pair.id,
            name: farm.pair.symbol ?? `${farm.pair.token0.symbol}-${farm.pair.token1.symbol}`,
            type: farm.pair.symbol ? 'Kashi Farm' : 'Sushi Farm',
          },
          rewards: farm.rewards,
          liquidity: farm.tvl,
          apr: {
            daily: (farm.roiPerYear / 365) * 100,
            monthly: (farm.roiPerYear / 12) * 100,
            annual: farm.roiPerYear * 100,
          },
        }))
        .filter((farm) => (farm ? true : false)),
    [farms]
  )

  // For Top Tokens
  const nativePrice1d = useNativePrice({ block: block1d })
  const nativePrice1w = useNativePrice({ block: block1w })

  const tokens = useTokens()
  const tokens1d = useTokens({ block: block1d, shouldFetch: !!block1d })
  const tokens1w = useTokens({ block: block1w, shouldFetch: !!block1w })

  const tokensFormatted = useMemo(
    () =>
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
        : [],
    [nativePrice, nativePrice1d, nativePrice1w, tokens, tokens1d, tokens1w]
  )

  const { options, data } = useMemo(() => {
    switch (type) {
      case 'pools':
        return {
          options: {
            keys: ['pair.address0', 'pair.address1', 'pair.symbol', 'pair.symbol'],
            threshold: 0.4,
          },
          data: farmsFormatted,
        }

      case 'pairs':
        return {
          options: {
            keys: ['pair.address0', 'pair.address1', 'pair.symbol0', 'pair.symbol1', 'pair.name0', 'pair.name1'],
            threshold: 0.4,
          },
          data: pairsFormatted,
        }

      case 'tokens':
        return {
          options: {
            keys: ['token.address', 'token.symbol', 'token.name'],
            threshold: 0.4,
          },
          data: tokensFormatted,
        }
    }
  }, [type, farmsFormatted, pairsFormatted, tokensFormatted])

  const {
    result: searched,
    term,
    search,
  } = useFuse({
    data,
    options,
  })

  return (
    <AnalyticsContainer>
      <Background background="dashboard">
        <div className="grid items-center justify-between grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Sushi Analytics</div>
            <div className="">
              Dive deeper in the analytics of sushi bar,
              <br /> pools, pairs and tokens.
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
      <div className="py-6 space-y-4 px-14">
        <div className="text-2xl font-bold text-high-emphesis">Overview</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DashboardChartCard type="liquidity" />
          <DashboardChartCard type="volume" />
        </div>
      </div>
      <DashboardTabs currentType={type} setType={setType} />
      <div className="pt-4 lg:px-14">
        {type === 'pools' && <PoolList pools={searched} />}
        {type === 'pairs' && <PairList pairs={searched} type={'all'} />}
        {type === 'tokens' && <TokenList tokens={searched} />}
      </div>
    </AnalyticsContainer>
  )
}
