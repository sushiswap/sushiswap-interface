import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import useSWR, { SWRConfiguration } from 'swr'

import { getAssets } from './fetchers'

export function useAssets(swrConfig: SWRConfiguration = undefined) {
  const { account } = useActiveWeb3React()
  const { data } = useSWR(account ? ['userAssets', account] : null, () => getAssets(account), swrConfig)
  return data
}
