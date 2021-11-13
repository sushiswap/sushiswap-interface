import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { formatNumber, formatPercent } from '../../../functions'
import { useActiveWeb3React } from '../../../hooks'
import { useBlock } from '../../../services/graph'
import { useTridentPools } from '../../../services/graph/hooks/pools'
import { poolAtom } from '../context/atoms'

export function usePoolStats({ pair }) {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const block1d = useBlock({ chainId, daysAgo: 1 })
  const block2d = useBlock({ chainId, daysAgo: 2 })

  const pool = useTridentPools({ chainId, subset: [pair] })?.[0]
  const pool1d = useTridentPools({ chainId, subset: [pair], block: block1d })?.[0]
  const pool2d = useTridentPools({ chainId, subset: [pair], block: block2d })?.[0]

  return useMemo(
    () => [
      {
        label: i18n._(t`Volume (24H)`),
        value: formatNumber(pool?.volumeUSD - pool1d?.volumeUSD, true, false),
        change: ((pool?.volumeUSD - pool1d?.volumeUSD) / (pool1d?.volumeUSD - pool2d?.volumeUSD)) * 100 - 100,
      },
      {
        label: i18n._(t`Fees (24H)`),
        value: formatNumber(((pool?.volumeUSD - pool1d?.volumeUSD) / 100) * pool?.swapFeePercent, true, false),
        change: ((pool?.volumeUSD - pool1d?.volumeUSD) / (pool1d?.volumeUSD - pool2d?.volumeUSD)) * 100 - 100,
      },
      {
        label: i18n._(t`Utilization (24H)`),
        value: formatPercent(((pool?.volumeUSD - pool1d?.volumeUSD) / pool?.totalValueLockedUSD) * 100),
        change:
          ((pool?.volumeUSD - pool1d?.volumeUSD) /
            pool?.totalValueLockedUSD /
            ((pool1d?.volumeUSD - pool2d?.volumeUSD) / pool1d?.totalValueLockedUSD)) *
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
