import { FC, useMemo } from 'react'
import { Pool } from '@sushiswap/trident-sdk'
import { I18n } from '@lingui/core'
import { poolEntityMapper } from '../poolEntityMapper'
import Chip, { ChipColor } from '../../../components/Chip'
import { POOL_TYPES } from '../constants'
import Typography from '../../../components/Typography'
import { formatPercent } from '../../../functions'
import { t } from '@lingui/macro'
import { PoolType } from '../types'

const chipPoolColorMapper: Record<PoolType, ChipColor> = {
  ConcentratedLiquidity: 'blue',
  ConstantProduct: 'purple',
  Hybrid: 'yellow',
  Weighted: 'green',
}

const _PoolProperties: FC<{ pool: Pool; i18n: I18n }> = ({ pool, i18n }) => {
  const type = useMemo(() => poolEntityMapper(pool), [pool])
  return (
    <>
      <Chip label={POOL_TYPES[type].label} color={chipPoolColorMapper[type]} />
      <Typography weight={700} variant="sm">
        {formatPercent(pool?.fee?.valueOf() / 100)} {i18n._(t`Fees`)}
      </Typography>
    </>
  )
}

export const PoolProperties: FC<{ pool?: Pool; i18n: I18n }> = ({ pool, i18n }) => {
  if (!pool) return <></>
  return <_PoolProperties pool={pool} i18n={i18n} />
}
