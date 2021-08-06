import { FC } from 'react'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

interface PoolStatsProps {}

const PoolStats: FC = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col mt-8 px-5 gap-3">
      <div className="rounded flex justify-between bg-dark-900 p-3">
        <Typography variant="sm" weight={700}>
          {i18n._(t`Volume (24H)`)}
        </Typography>
        <div className="flex flex-row gap-2">
          <Typography weight={700} className="text-high-emphesis">
            $22,834,265.01
          </Typography>
          <Typography variant="sm" className="text-green">
            +10%
          </Typography>
        </div>
      </div>
      <div className="rounded flex justify-between bg-dark-900 p-3">
        <Typography variant="sm" weight={700}>
          {i18n._(t`Fees (24H)`)}
        </Typography>
        <div className="flex flex-row gap-2">
          <Typography weight={700} className="text-high-emphesis">
            $68,237.72
          </Typography>
          <Typography variant="sm" className="text-green">
            +4.5%
          </Typography>
        </div>
      </div>
      <div className="rounded flex justify-between bg-dark-900 p-3">
        <Typography variant="sm" weight={700}>
          {i18n._(t`Utilization (24H)`)}
        </Typography>
        <div className="flex flex-row gap-2">
          <Typography weight={700} className="text-high-emphesis">
            5.50%
          </Typography>
          <Typography variant="sm" className="text-red">
            -0.31%
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default PoolStats
