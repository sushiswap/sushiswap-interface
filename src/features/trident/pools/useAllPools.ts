import { Token } from '@sushiswap/core-sdk'
import { Fee } from '@sushiswap/trident-sdk'
import { getApy } from 'app/functions'
import { TridentPool, useOneWeekBlock, useSushiPairs } from 'app/services/graph'
import { useGetAllTridentPools } from 'app/services/graph/hooks/pools'
import { useMemo, useState } from 'react'

import { AllPoolType } from '../types'

export default function useAllPools({ chainId }: { chainId: number | undefined }) {
  const [isDataChanged, setDataChanged] = useState<boolean>(false)

  const {
    data: tridentPools,
    error: tridentError,
    isValidating: tridentIsValidating,
  } = useGetAllTridentPools({ chainId })

  const { data: block1w } = useOneWeekBlock({ chainId })

  const {
    data: legacyPools,
    error: legacyError,
    isValidating: legacyIsValidating,
  } = useSushiPairs({ chainId, variables: { first: 1000, orderBy: 'reserveUSD' } })

  const {
    data: legacyPools1w,
    error: legacyError1w,
    isValidating: legacyIsValidating1w,
  } = useSushiPairs({
    chainId,
    variables: { block: block1w, where: { id_in: legacyPools?.map((legacyPool: any) => legacyPool.id) } },
  })

  const data = useMemo(() => {
    setDataChanged(true)
    setTimeout(() => setDataChanged(false), 10)

    return tridentPools && legacyPools
      ? [
          ...tridentPools,
          ...(legacyPools as []).map(
            (legacyPool: any) =>
              ({
                address: legacyPool.id,
                type: AllPoolType.Legacy,
                volumeUSD: Number(legacyPool.volumeUSD),
                liquidityUSD: Number(legacyPool.reserveUSD),
                transactionCount: Number(legacyPool.txCount),
                apy: getApy({
                  volume:
                    legacyPool.volumeUSD -
                      legacyPools1w?.find((legacyPool1w: any) => legacyPool.id === legacyPool1w.id)?.volumeUSD ?? 0,
                  liquidity: legacyPool.reserveUSD,
                  days: 7,
                }),
                assets: [legacyPool.token0, legacyPool.token1].map(
                  (token: any) => new Token(chainId!, token.id, Number(token.decimals), token.symbol, token.name)
                ),
                swapFee: Fee.DEFAULT,
                twapEnabled: true,
                legacy: true,
              } as TridentPool)
          ),
        ]
      : []
  }, [tridentPools, legacyPools, legacyPools1w, chainId])

  return {
    data,
    isDataChanged,
    error: tridentError || legacyError || legacyError1w,
    isValidating: tridentIsValidating || legacyIsValidating || legacyIsValidating1w,
  }
}
