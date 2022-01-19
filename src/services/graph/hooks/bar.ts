import { getBar, getBarHistory } from 'app/services/graph/fetchers/bar'
import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'

interface useBarProps {
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useBar({ variables, shouldFetch = true, swrConfig = undefined }: useBarProps = {}) {
  // @ts-ignore TYPE NEEDS FIXING
  const { data } = useSWR(shouldFetch ? ['bar', stringify(variables)] : null, () => getBar(variables), swrConfig)
  return data
}

interface useBarHistoryProps {
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useBarHistory({ variables, shouldFetch = true, swrConfig = undefined }: useBarHistoryProps = {}) {
  const { data } = useSWR(
    shouldFetch ? ['barHistory', stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getBarHistory(variables),
    swrConfig
  )
  return data
}
