import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { getKashiPairs } from '../fetchers/bentobox'
import { useActiveWeb3React } from '../../../hooks'

export function useKashiPairs(variables = undefined, chainId = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId: chainIdSelected } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected

  const shouldFetch = chainId && (chainId === ChainId.MAINNET || chainId === ChainId.MATIC)

  // useEffect(() => {
  //   console.log('debug', { shouldFetch, chainId, pairAddresses })
  // }, [shouldFetch, chainId, pairAddresses])

  const { data } = useSWR(
    shouldFetch ? () => ['kashiPairs', chainId, JSON.stringify(variables)] : null,
    (_, chainId) => getKashiPairs(chainId, variables),
    swrConfig
  )

  return data
}
