import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { getKashiPairs } from '../fetchers/bentobox'
import { useActiveWeb3React } from '../../../hooks'

export function useKashiPairs(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId

  // useEffect(() => {
  //   console.log('debug', { shouldFetch, chainId, pairAddresses })
  // }, [shouldFetch, chainId, pairAddresses])

  const { data } = useSWR(
    shouldFetch ? () => ['kashiPairs', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getKashiPairs(chainId, variables),
    swrConfig
  )

  return data

  // console.log('kashi pairs data', { data })

  // return useMemo(() => {
  //   if (!data) return []
  //   return data
  // }, [data])
}
