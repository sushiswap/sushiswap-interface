import { getTridentPositions } from 'app/services/graph'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

export const useTridentLiquidityPositions = ({ chainId, variables, shouldFetch = true, swrConfig = undefined }) => {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-liquidity-positions', chainId, stringify(variables)] : null,
    () => getTridentPositions(chainId, variables),
    swrConfig
  )
}
