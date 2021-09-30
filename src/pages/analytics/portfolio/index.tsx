import React, { useMemo, useState } from 'react'
import { formatNumber, shortenAddress } from '../../../functions'
import {
  useAllUserFarms,
  useAllUserKashiPairs,
  useAllUserPairs,
  useBentoUserTokens,
  useUserAssets,
} from './../../../features/analytics/Portfolio/hooks'

import AllocationTable from '../../../features/analytics/Portfolio/AllocationTable'
import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import { ChainId } from '@sushiswap/sdk'
import { NETWORK_LABEL } from '../../../config/networks'
import { uniq } from 'lodash'
import { useActiveWeb3React } from '../../../hooks'

export default function Portfolio() {
  const [chartTimespan, setChartTimespan] = useState('1M')
  const chartTimespans = ['24H', '1W', '1M', '1Y', 'ALL']

  const { account: address } = useActiveWeb3React()

  // For Yield Farming
  const userFarms = useAllUserFarms()

  // For Liquidity
  const userPairs = useAllUserPairs()

  // For Wallet
  const userAssets = useUserAssets()

  // For BentoBox
  const userBentoTokens = useBentoUserTokens()
  const userKashiPairs = useAllUserKashiPairs()

  const totalUsd = useMemo(() => {
    let total = 0
    userFarms.forEach((farm) => (total += farm.userStakedUSD))
    userPairs.forEach((pair) => (total += pair.userBalanceUSD))
    userAssets.forEach((asset) => (total += asset.valueUSD))
    userBentoTokens.forEach((token) => (total += token.valueUSD))
    userKashiPairs.forEach((pair) => (total += pair.valueUSD))

    return total
  }, [userFarms, userPairs, userAssets, userBentoTokens, userKashiPairs])

  const usdAllocations = useMemo(() => {
    const userFarmsAlloc = (userFarms.reduce((acc, farm) => (acc += farm.userStakedUSD), 0) / totalUsd) * 100
    const userPairsAlloc = (userPairs.reduce((acc, pair) => (acc += pair.userBalanceUSD), 0) / totalUsd) * 100
    const userAssetsAlloc = (userAssets.reduce((acc, asset) => (acc += asset.valueUSD), 0) / totalUsd) * 100
    const userBentoTokensAlloc = (userBentoTokens.reduce((acc, token) => (acc += token.valueUSD), 0) / totalUsd) * 100
    const userKashiPairsAlloc = (userKashiPairs.reduce((acc, pair) => (acc += pair.valueUSD), 0) / totalUsd) * 100

    return [
      {
        name: 'Yield Farming',
        allocation: userFarmsAlloc,
      },
      {
        name: 'Liquidity',
        allocation: userPairsAlloc,
      },
      {
        name: 'Wallet',
        allocation: userAssetsAlloc,
      },
      {
        name: 'BentoBox',
        allocation: userBentoTokensAlloc,
      },
      {
        name: 'Kashi',
        allocation: userKashiPairsAlloc,
      },
    ]
  }, [totalUsd, userFarms, userPairs, userAssets, userBentoTokens, userKashiPairs])

  const chainAllocations = useMemo(() => {
    const networks = uniq([
      ...userFarms.map((farm) => farm.chain.toLowerCase()),
      ...userPairs.map((pair) => pair.chain.toLowerCase()),
      ...userAssets.map((asset) => asset.chain.toLowerCase()),
      ...userBentoTokens.map((token) => token.chain.toLowerCase()),
      ...userKashiPairs.map((pair) => pair.chain.toLowerCase()),
    ])

    return networks.map((network) => {
      const totalNetwork =
        userFarms
          .filter((farm) => farm.chain.toLowerCase() === network)
          ?.reduce((acc, farm) => (acc += farm.userStakedUSD), 0) +
        userPairs
          .filter((pair) => pair.chain.toLowerCase() === network)
          ?.reduce((acc, pair) => (acc += pair.userBalanceUSD), 0) +
        userAssets
          .filter((asset) => asset.chain.toLowerCase() === network)
          ?.reduce((acc, asset) => (acc += asset.valueUSD), 0) +
        userBentoTokens
          .filter((token) => token.chain.toLowerCase() === network)
          ?.reduce((acc, asset) => (acc += asset.valueUSD), 0) +
        userKashiPairs
          .filter((pair) => pair.chain.toLowerCase() === network)
          ?.reduce((acc, pair) => (acc += pair.valueUSD), 0)

      return {
        name: NETWORK_LABEL[ChainId[network.toUpperCase()]],
        allocation: (totalNetwork / totalUsd) * 100,
      }
    })
  }, [totalUsd, userFarms, userPairs, userAssets, userBentoTokens, userKashiPairs])

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
        <div className="col-span-3"></div>
        <div className="flex flex-col col-span-2 space-y-4">
          <div className="font-bold text-secondary">Asset Allocation</div>
          <div className="border-b border-dark-800" />
          <AllocationTable allocations={usdAllocations} />
          <div className="font-bold text-secondary">Networks</div>
          <div className="border-b border-dark-800" />
          <AllocationTable allocations={chainAllocations} />
        </div>
      </div>
    </AnalyticsContainer>
  )
}
