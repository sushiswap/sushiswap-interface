import { ChainId } from '@sushiswap/core-sdk'
import { getBar, getBarHistory } from 'services/graph/fetchers'
import { useBlock } from 'services/graph/hooks'
import useSWR, { SWRConfiguration } from 'swr'

interface useBarProps {
  timestamp?: number
  block?: number
  shouldFetch?: boolean
}

export function useBar(
  { timestamp, block, shouldFetch = true }: useBarProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const blockFetched = useBlock({ timestamp, chainId: ChainId.ETHEREUM, shouldFetch: shouldFetch && !!timestamp })
  block = block ?? (timestamp ? blockFetched : undefined)

  const { data } = useSWR(shouldFetch ? ['bar', block] : null, () => getBar(block), swrConfig)
  return data
}

interface useBarHistoryProps {
  shouldFetch?: boolean
}

export function useBarHistory(
  { shouldFetch = true }: useBarHistoryProps = {},
  swrConfig: SWRConfiguration = undefined
) {
  const { data } = useSWR(shouldFetch ? ['barHistory'] : null, () => getBarHistory(), swrConfig)
  return data
}
