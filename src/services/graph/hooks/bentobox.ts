import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { getKashiPairs } from '../fetchers/bentobox'
import { useActiveWeb3React } from '../../../hooks'

export function useKashiPairs(pairAddresses, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && pairAddresses && pairAddresses.length

  // useEffect(() => {
  //   console.log('debug', { shouldFetch, chainId, pairAddresses })
  // }, [shouldFetch, chainId, pairAddresses])

  const { data } = useSWR(
    shouldFetch ? () => ['kashiPairs', chainId, pairAddresses] : null,
    (_, chainId, pairAddresses) => getKashiPairs(chainId, { pairAddresses }),
    swrConfig
  )

  // console.log('kashi pairs data', { data })

  return useMemo(() => {
    if (!data) return []
    return data
  }, [data])
}
