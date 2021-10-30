import Search from 'components/Search'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import ChartCard from 'features/analytics/ChartCard'
import DashboardTabs from 'features/analytics/Dashboard/DashboardTabs'
import PoolList from 'features/analytics/Farms/FarmList'
import PairList from 'features/analytics/Pairs/PairList'
import TokenList from 'features/analytics/Tokens/TokenList'
import { useActiveWeb3React, useFuse } from 'hooks'
import useFarmRewards from 'hooks/useFarmRewards'
import { useMemo, useState } from 'react'
import { useBlock, useDayData, useFactory, useNativePrice, useSushiPairs, useTokens } from 'services/graph'

const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

export default function Dashboard(): JSX.Element {
  const [type, setType] = useState<'pools' | 'pairs' | 'tokens'>('pools')

  const { chainId } = useActiveWeb3React()

  const block1d = useBlock({ daysAgo: 1, chainId })
  const block2d = useBlock({ daysAgo: 2, chainId })
  const block1w = useBlock({ daysAgo: 7, chainId })

  // For the charts
  const exchange = useFactory({ chainId })
  const exchange1d = useFactory({ block: block1d, chainId })
  const exchange2d = useFactory({ block: block2d, chainId })

  const dayData = useDayData({ chainId })

  const chartData = useMemo(
    () => ({
      liquidity: exchange?.liquidityUSD,
      liquidityChange: (exchange1d?.liquidityUSD / exchange2d?.liquidityUSD) * 100 - 100,
      liquidityChart: dayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.liquidityUSD) })),

      volume1d: exchange?.volumeUSD - exchange1d?.volumeUSD,
      volume1dChange:
        ((exchange?.volumeUSD - exchange1d?.volumeUSD) / (exchange1d?.volumeUSD - exchange2d?.volumeUSD)) * 100 - 100,
      volumeChart: dayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [exchange, exchange1d, exchange2d, dayData]
  )

  // For Top Pairs
  const pairs = useSushiPairs({ chainId })
  const pairs1d = useSushiPairs({ block: block1d, chainId })
  const pairs1w = useSushiPairs({ block: block1w, chainId })

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
  const nativePrice = useNativePrice({ chainId })
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
  const nativePrice1d = useNativePrice({ block: block1d, chainId })
  const nativePrice1w = useNativePrice({ block: block1w, chainId })

  const tokens = useTokens({ chainId })
  const tokens1d = useTokens({ block: block1d, shouldFetch: !!block1d, chainId })
  const tokens1w = useTokens({ block: block1w, shouldFetch: !!block1w, chainId })

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
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
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
      <div className="px-4 py-6 space-y-4 lg:px-14">
        <div className="text-2xl font-bold text-high-emphesis">Overview</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ChartCard
            header="TVL"
            subheader="SUSHI AMM"
            figure={chartData.liquidity}
            change={chartData.liquidityChange}
            chart={chartData.liquidityChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
          <ChartCard
            header="Volume"
            subheader="SUSHI AMM"
            figure={chartData.volume1d}
            change={chartData.volume1dChange}
            chart={chartData.volumeChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
        </div>
      </div>
      <DashboardTabs currentType={type} setType={setType} />
      <div className="px-4 pt-4 lg:px-14">
        {type === 'pools' && <PoolList pools={searched} />}
        {type === 'pairs' && <PairList pairs={searched} type={'all'} />}
        {type === 'tokens' && <TokenList tokens={searched} />}
      </div>
    </AnalyticsContainer>
  )
}
