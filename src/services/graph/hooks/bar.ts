import {
  getBar,
  getBarFeesDaysAgo,
  getBarHistory,
  getBarUser,
  getBarXsushi,
  getBarXsushiUser,
} from 'app/services/graph/fetchers/bar'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import { GraphProps } from '../interfaces'

export function useBar({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(shouldFetch ? ['bar', stringify(variables)] : null, () => getBar(variables), swrConfig)
}

export function useBarHistory({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(shouldFetch ? ['barHistory', stringify(variables)] : null, () => getBarHistory(variables), swrConfig)
}

export function useBarUser({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(shouldFetch ? ['barUser', stringify(variables)] : null, () => getBarUser(variables), swrConfig)
}

export function useBarXsushi({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(shouldFetch ? ['barXsushi', stringify(variables)] : null, () => getBarXsushi(variables), swrConfig)
}

export function useBarXsushiUser({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(
    shouldFetch ? ['barXsushiUser', stringify(variables)] : null,
    () => getBarXsushiUser(variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useBarFeesDaysAgo({ days = 30, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(days ? ['barFees', days] : null, (_, days) => getBarFeesDaysAgo(days), swrConfig)
}
