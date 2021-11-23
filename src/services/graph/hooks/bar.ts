import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'
import { getBar, getBarHistory } from '../fetchers/bar'

interface useBarProps {
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useBar({ variables, shouldFetch = true, swrConfig = undefined }: useBarProps = {}) {
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
    () => getBarHistory(variables),
    swrConfig
  )
  return data
}
