import React, { useMemo, useState } from 'react'
import LineGraph from '../../../components/LineGraph'
import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import ColoredNumber from '../../../features/analytics/ColoredNumber'
import { usePositions } from '../../../features/farm/hooks'
import { classNames, formatNumber, shortenAddress } from '../../../functions'
import { useActiveWeb3React } from '../../../hooks'
import { useFarms, useLiquidityPositions, useMassBlocks, useSushiPairs, useToken } from '../../../services/graph'
import { massBlocksQuery, tokenQuery } from '../../../services/graph/queries'
import { useTrackedTokenPairs } from '../../../state/user/hooks'
import { useUserFarms, useUserPairs } from './../../../features/analytics/Portfolio/hooks'

export default function Portfolio() {
  const [chartTimespan, setChartTimespan] = useState('1M')
  const chartTimespans = ['24H', '1W', '1M', '1Y', 'ALL']

  const { account: address } = useActiveWeb3React()
  const totalUsd = 881234.66

  // For Yield Farming
  const userFarms = useUserFarms()

  // For Liquidity
  const userPairs = useUserPairs()

  return (
    <AnalyticsContainer>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-4">
          <div className="text-2xl font-bold text-high-emphesis">Total Assets</div>
          <div>{address ? `(${shortenAddress(address)})` : ''}</div>
        </div>
        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue to-pink bg-clip-text">
          {totalUsd ? formatNumber(totalUsd, true) : ''}
        </div>
      </div>
      <div className="border-b border-dark-800" />
      <div className="grid grid-flow-col grid-cols-5">
        <div className="col-span-3">
          <div className="flex flex-row items-center justify-between">
            <div className="font-bold text-secondary">Portfolio Balance</div>
            <div className="pr-4 space-x-4">
              {chartTimespans.map((timespan, i) => (
                <button
                  key={i}
                  className={classNames(
                    timespan === chartTimespan ? 'text-high-emphesis' : 'text-secondary',
                    'font-bold text-sm'
                  )}
                  onClick={() => setChartTimespan(timespan)}
                >
                  {timespan}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <div className="text-lg font-bold text-high-emphesis">{totalUsd ? formatNumber(totalUsd, true) : ''}</div>
            <ColoredNumber number={10} percent={true} />
          </div>
          <div className="w-full h-52">
            <LineGraph data={undefined} stroke={{ gradient: { from: '#27B0E6', to: '#FA52A0' } }} />
          </div>
        </div>
        <div className="flex flex-col col-span-2 space-y-4">
          <div className="font-bold text-secondary">Asset Allocation</div>
          <div className="border-b border-dark-800" />
        </div>
      </div>
    </AnalyticsContainer>
  )
}
