import React, { FC } from 'react'
import Chip from '../../../components/Chip'
import Typography from '../../../components/Typography'
import { CurrencyLogoArray } from '../../../components/CurrencyLogo'
import Link from 'next/link'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Pool } from '../types'
import { POOL_TYPES } from '../constants'
import { toHref } from '../../../hooks/useTridentPools'

interface PoolCardProps {
  pool: Pool
  link: string
}

const PoolCard: FC<PoolCardProps> = ({ pool, link }) => {
  const { i18n } = useLingui()

  const content = (
    <div className="rounded border border-dark-700 bg-dark-900 overflow-hidden">
      <div className="flex justify-between p-3 items-center">
        <div className="flex gap-2 items-center">
          <CurrencyLogoArray currencies={pool.tokens} size={30} dense maxLogos={4} />
          <Chip label={POOL_TYPES[pool.type].label} color={POOL_TYPES[pool.type].color} />
        </div>
        <div className="flex gap-1.5 items-baseline">
          <Typography className="text-secondary" variant="sm" weight={400}>
            {i18n._(t`APY`)}
          </Typography>
          <Typography className="text-high-emphesis leading-5" variant="lg" weight={700}>
            {pool.apy}
          </Typography>
        </div>
      </div>
      <div className="flex justify-between items-center bg-dark-800 px-3 pt-2.5 pb-1.5">
        <div className="flex flex-col">
          <Typography className="text-high-emphesis leading-5" variant="lg" weight={400}>
            {pool.tokens.map((token) => token.symbol).join('-')}
          </Typography>
          <Typography className="text-blue leading-5" variant="xs" weight={700}>
            {pool.fee} {i18n._(t`Fees`)}
          </Typography>
        </div>
        <div className="flex gap-1">
          <Typography className="text-secondary" variant="xs" weight={700}>
            {i18n._(t`TVL:`)}
          </Typography>
          <Typography className="text-high-emphesis" variant="xs" weight={700}>
            $1,504,320
          </Typography>
        </div>
      </div>
    </div>
  )

  if (link) return <Link href={`${link}/${toHref(pool)}`}>{content}</Link>

  return content
}

export default PoolCard
