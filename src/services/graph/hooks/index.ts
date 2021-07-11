import {
  getMasterChefV1Farms,
  getMasterChefV1PairAddreses,
  getMasterChefV1SushiPerBlock,
  getMasterChefV1TotalAllocPoint,
  getMasterChefV2Farms,
  getMasterChefV2PairAddreses,
  getMiniChefFarms,
  getMiniChefPairAddreses,
} from '../fetchers'
import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { Chef } from '../../../features/farm/enum'
import concat from 'lodash/concat'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

export * from './bentobox'
export * from './blocks'
export * from './exchange'

export function useMasterChefV1TotalAllocPoint(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(
    shouldFetch ? 'masterChefV1TotalAllocPoint' : null,
    () => getMasterChefV1TotalAllocPoint(),
    swrConfig
  )
  return data
}

export function useMasterChefV1SushiPerBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(
    shouldFetch ? 'masterChefV1SushiPerBlock' : null,
    () => getMasterChefV1SushiPerBlock(),
    swrConfig
  )
  return data
}

export function useMasterChefV1Farms(variables = undefined, chainId = undefined, swrConfig = undefined) {
  chainId = chainId ?? useActiveWeb3React().chainId
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(
    shouldFetch ? ['masterChefV1Farms', JSON.stringify(variables)] : null,
    () => getMasterChefV1Farms(variables),
    swrConfig
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.MASTERCHEF }))
  }, [data])
}

export function useMasterChefV2Farms(
  variables = undefined,
  chainId = undefined,
  swrConfig: SWRConfiguration = undefined
) {
  chainId = chainId ?? useActiveWeb3React().chainId
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? 'masterChefV2Farms' : null, () => getMasterChefV2Farms(), swrConfig)
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.MASTERCHEF_V2 }))
  }, [data])
}

export function useMiniChefFarms(variables = undefined, chainId = undefined, swrConfig: SWRConfiguration = undefined) {
  chainId = chainId ?? useActiveWeb3React().chainId
  const shouldFetch = chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY].includes(chainId)
  const { data } = useSWR(
    shouldFetch ? ['miniChefFarms', chainId] : null,
    (_, chainId) => getMiniChefFarms(chainId),
    swrConfig
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.MINICHEF }))
  }, [data])
}

export function useFarms(variables = undefined, chainId = undefined, swrConfig: SWRConfiguration = undefined) {
  const masterChefV1Farms = useMasterChefV1Farms(variables, chainId)
  const masterChefV2Farms = useMasterChefV2Farms(variables, chainId)
  const miniChefFarms = useMiniChefFarms(variables, chainId)
  // useEffect(() => {
  //   console.log('debug', { masterChefV1Farms, masterChefV2Farms, miniChefFarms })
  // }, [masterChefV1Farms, masterChefV2Farms, miniChefFarms])
  return useMemo(
    () => concat(masterChefV1Farms, masterChefV2Farms, miniChefFarms).filter((pool) => pool && pool.pair),
    [masterChefV1Farms, masterChefV2Farms, miniChefFarms]
  )
}

export function useMasterChefV1PairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? ['masterChefV1PairAddresses', chainId] : null, (_) =>
    getMasterChefV1PairAddreses()
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useMasterChefV2PairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? ['masterChefV2PairAddresses', chainId] : null, (_) =>
    getMasterChefV2PairAddreses()
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useMiniChefPairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY].includes(chainId)
  const { data } = useSWR(shouldFetch ? ['miniChefPairAddresses', chainId] : null, (_, chainId) =>
    getMiniChefPairAddreses(chainId)
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useFarmPairAddresses() {
  const masterChefV1PairAddresses = useMasterChefV1PairAddresses()
  const masterChefV2PairAddresses = useMasterChefV2PairAddresses()
  const miniChefPairAddresses = useMiniChefPairAddresses()
  return useMemo(
    () => concat(masterChefV1PairAddresses, masterChefV2PairAddresses, miniChefPairAddresses),
    [masterChefV1PairAddresses, masterChefV2PairAddresses, miniChefPairAddresses]
  )
}
