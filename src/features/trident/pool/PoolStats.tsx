import { FC, useMemo } from 'react'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { formatNumber, formatPercent } from '../../../functions'
import useDesktopMediaQuery from '../../../hooks/useDesktopMediaQuery'
import { useBlock } from '../../../services/graph'
import { useActiveWeb3React } from '../../../hooks'
import { useTridentPools } from '../../../services/graph/hooks/pools'
import { useRecoilValue } from 'recoil'
import { poolAtom } from '../context/atoms'

interface PoolStatsProps {}

const PoolStats: FC<PoolStatsProps> = () => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()

  const poolAddress = useRecoilValue(poolAtom)?.[0]?.[2]

  const block1d = useBlock({ chainId, daysAgo: 1 })
  const block2d = useBlock({ chainId, daysAgo: 2 })

  const pool = useTridentPools({ chainId, subset: [poolAddress] })?.[0]
  const pool1d = useTridentPools({ chainId, subset: [poolAddress], block: block1d })?.[0]
  const pool2d = useTridentPools({ chainId, subset: [poolAddress], block: block2d })?.[0]

  const stats = useMemo(
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

  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-4">
      {stats.map(({ label, value, change }, index) => (
        <div
          className="flex flex-row justify-between p-3 border rounded lg:flex-col lg:gap-1 bg-dark-900 border-dark-800 lg:bg-dark-800 lg:border-dark-700"
          key={index}
        >
          <Typography variant={isDesktop ? 'xs' : 'sm'} weight={700}>
            {label}
          </Typography>
          <div className="flex flex-row gap-2 lg:flex-col lg:gap-0">
            <Typography weight={700} variant={isDesktop ? 'lg' : 'base'} className="text-high-emphesis">
              {value}
            </Typography>
            <Typography
              weight={400}
              variant={isDesktop ? 'xs' : 'sm'}
              className={change > 0 ? 'text-green' : 'text-red'}
            >
              {formatPercent(change)}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PoolStats
