import Search from 'app/components/Search'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import FarmList from 'app/features/analytics/Farms/FarmList'
import useFarmRewards from 'app/hooks/useFarmRewards'
import useFuse from 'app/hooks/useFuse'
import { useMemo } from 'react'

export default function Farms(): JSX.Element {
  const farms = useFarmRewards()

  const farmsFormatted = useMemo(
    () =>
      farms
        ?.map((farm) => ({
          pair: {
            token0: farm.pair.token0,
            token1: farm.pair.token1,
            id: farm.pair.id,
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

  const options = useMemo(
    () => ({
      keys: ['pair.token0.symbol', 'pair.token1.symbol'],
      threshold: 0.4,
    }),
    []
  )

  const {
    result: farmsSearched,
    term,
    search,
  } = useFuse({
    data: farmsFormatted,
    options,
  })

  return (
    <AnalyticsContainer>
      <Background background="farms">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Farms</div>
            <div className="">Farms are incentivized pools. Click on the column name to sort by APR or volume.</div>
          </div>
          <Search
            term={term}
            search={search}
            inputProps={{ className: 'placeholder-primary bg-opacity-50 w-full py-3 pl-4 pr-14 rounded bg-dark-900' }}
            className="border shadow-2xl border-dark-800"
          />
        </div>
      </Background>
      <div className="px-4 pt-4 lg:px-14">
        <FarmList pools={farmsSearched} />
      </div>
    </AnalyticsContainer>
  )
}
