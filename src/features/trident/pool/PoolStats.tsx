import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'components/Typography'
import { formatPercent } from 'functions'
import useDesktopMediaQuery from 'hooks/useDesktopMediaQuery'
import { FC } from 'react'

interface PoolStatsProps {}

const PoolStats: FC<PoolStatsProps> = () => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()

  const stats = [
    {
      label: i18n._(t`Volume (24H)`),
      value: '$22,834,265.01',
      change: 10,
    },
    {
      label: i18n._(t`Fees (24H)`),
      value: '$68,237.72',
      change: 4.5,
    },
    {
      label: i18n._(t`Utilization (24H)`),
      value: '5.50%',
      change: -0.31,
    },
    {
      label: i18n._(t`Transactions (24H)`),
      value: '345',
      change: -3.42,
    },
  ]

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, change }, index) => (
        <div
          className="rounded flex flex-row lg:flex-col lg:gap-1 justify-between bg-dark-900 p-3 border border-dark-800 lg:bg-dark-800 lg:border-dark-700"
          key={index}
        >
          <Typography variant={isDesktop ? 'xs' : 'sm'} weight={700}>
            {label}
          </Typography>
          <div className="flex flex-row lg:flex-col gap-2 lg:gap-0">
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
