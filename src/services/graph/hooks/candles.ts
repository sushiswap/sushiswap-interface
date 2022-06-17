import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import { getCandles } from '../fetchers/candle'
import { GraphProps } from '../interfaces'

export function useCandles({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(shouldFetch ? ['bar', stringify(variables)] : null, () => getCandles(variables), swrConfig)
}
