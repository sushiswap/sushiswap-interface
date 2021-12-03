import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { pairsQuery } from 'app/services/graph/queries'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'services/web3'

import { formatNumber, formatPercent } from '../../../functions'
import { useOneDayBlock, useTwoDayBlock } from '../../../services/graph'
import { useTridentPools } from '../../../services/graph/hooks/pools'

export function usePoolStats({ pair }) {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const block1d = useOneDayBlock({ chainId })
  const block2d = useTwoDayBlock({ chainId })

  const pool = useTridentPools({
    chainId,
    variables: {
      where: {
        id: pair?.toLowerCase(),
      },
    },
    shouldFetch: !!pairsQuery,
  })?.[0]
  const pool1d = useTridentPools({
    chainId,
    variables: {
      block: block1d,
      where: {
        id: pair?.toLowerCase(),
      },
    },
    shouldFetch: !!pair && !!block1d,
  })?.[0]
  const pool2d = useTridentPools({
    chainId,
    variables: {
      block: block2d,
      where: {
        id: pair?.toLowerCase(),
      },
    },
    shouldFetch: !!pair && !!block2d,
  })?.[0]

  return useMemo(
    () => [
      {
        label: i18n._(t`Volume (24H)`),
        value: formatNumber(pool?.volumeUSD - pool1d?.volumeUSD, true, false),
        change: ((pool?.volumeUSD - pool1d?.volumeUSD) / (pool1d?.volumeUSD - pool2d?.volumeUSD)) * 100 - 100,
      },
      {
        label: i18n._(t`Fees (24H)`),
        value: formatNumber(((pool?.volumeUSD - pool1d?.volumeUSD) / 100) * pool?.swapFee, true, false),
        change: ((pool?.volumeUSD - pool1d?.volumeUSD) / (pool1d?.volumeUSD - pool2d?.volumeUSD)) * 100 - 100,
      },
      {
        label: i18n._(t`Utilization (24H)`),
        value: formatPercent(((pool?.volumeUSD - pool1d?.volumeUSD) / pool?.liquidityUSD) * 100),
        change:
          ((pool?.volumeUSD - pool1d?.volumeUSD) /
            pool?.liquidityUSD /
            ((pool1d?.volumeUSD - pool2d?.volumeUSD) / pool1d?.liquidityUSD)) *
            100 -
          100,
      },
      {
        label: i18n._(t`Transactions (24H)`),
        value: pool?.transactionCount - pool1d?.transactionCount,
        change:
          ((pool?.transactionCount - pool1d?.transactionCount) /
            (pool1d?.transactionCount - pool2d?.transactionCount)) *
            100 -
          100,
      },
    ],
    [i18n, pool, pool1d, pool2d]
  )
}
