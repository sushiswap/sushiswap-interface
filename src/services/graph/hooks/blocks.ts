import { getAverageBlockTime, getOneDayBlock, getOneWeekBlock, getCustomDayBlock, getMassBlocks } from '../fetchers'

import { useActiveWeb3React } from '../../../hooks'
import useSWR from 'swr'

export function useOneDayBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(chainId ? ['oneDayBlock', chainId] : null, (_, chainId) => getOneDayBlock(chainId), swrConfig)

  return data
}

export function useOneWeekBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['oneWeekBlock', chainId] : null,
    (_, chainId) => getOneWeekBlock(chainId),
    swrConfig
  )

  return data
}

export function useCustomDayBlock(days: number, swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['customDayBlock', chainId, days] : null,
    (_, chainId) => getCustomDayBlock(chainId, days),
    swrConfig
  )

  return data
}

export function useMassBlocks(timestamps: number[] | string[], swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['massBlocks', chainId] : null,
    (_, chainId) => getMassBlocks(chainId, timestamps),
    swrConfig
  )

  return data
}

export function useAverageBlockTime(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['averageBlockTime', chainId] : null,
    (_, chainId) => getAverageBlockTime(chainId),
    swrConfig
  )

  return data
}
