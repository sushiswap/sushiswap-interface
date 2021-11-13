import Typography from 'components/Typography'
import { formatPercent } from 'functions'
import useDesktopMediaQuery from 'hooks/useDesktopMediaQuery'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { poolAtom } from '../context/atoms'
import { usePoolStats } from './usePoolStats'

interface PoolStatsProps {}

const PoolStats: FC<PoolStatsProps> = () => {
  const isDesktop = useDesktopMediaQuery()

  const { pool } = useRecoilValue(poolAtom)

  const stats = usePoolStats({ pair: pool?.liquidityToken?.address })

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
