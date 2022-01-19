import { getTridentTokenPrice, getTridentTokenPrices } from 'app/services/graph'
import useSWR from 'swr'

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokenPrices({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-prices', chainId, variables] : null,
    () => getTridentTokenPrices(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokenPrice({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-price', chainId, variables] : null,
    () => getTridentTokenPrice(chainId, variables),
    swrConfig
  )
}
