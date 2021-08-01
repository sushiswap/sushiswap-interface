import useSWR, { SWRConfiguration } from 'swr'
import { useActiveWeb3React } from '../../../hooks'
import { getBar, getBarHistory } from '../fetchers/bar'

export function useBar(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['bar', query, JSON.stringify(variables)], () => getBar(query, variables), swrConfig)
  return data
}

export function useBarHistory(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(
    ['barHistory', query, JSON.stringify(variables)],
    () => getBarHistory(query, variables),
    swrConfig
  )
  return data
}
