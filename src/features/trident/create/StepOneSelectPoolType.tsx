import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Typography from 'app/components/Typography'
import { selectTridentCreate } from 'app/features/trident/create/createSlice'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

import { ClassicDescription } from './ClassicDescription'
import { PoolSelector } from './PoolSelector'
import { StepHeader } from './StepHeader'

export const StepOneSelectPoolType: FC = () => {
  const { i18n } = useLingui()
  const { selectedPoolType } = useAppSelector(selectTridentCreate)

  return (
    <div className="w-full">
      <TridentHeader maxWidth="full" pattern="bg-binary" className="!gap-2">
        <StepHeader
          title={i18n._(t`Create New Liquidity Pool`)}
          subtitle={i18n._(t`Select a pool type, deposit assets, and create your pool on Sushi.`)}
          backHref={'/trident/pools'}
        />
      </TridentHeader>
      <TridentBody maxWidth="full">
        <div className="flex flex-col gap-3">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            {i18n._(t`Select Pool Type`)}
          </Typography>
          <div className="text-secondary">{i18n._(t`Please select the pool type you would like to create.`)}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 select-none lg:grid-cols-4">
          <PoolSelector type={PoolType.ConstantProduct} selectedPool={selectedPoolType} />
          <PoolSelector type={PoolType.ConcentratedLiquidity} selectedPool={selectedPoolType} comingSoon />
          <PoolSelector type={PoolType.Weighted} selectedPool={selectedPoolType} comingSoon />
          <PoolSelector type={PoolType.Hybrid} selectedPool={selectedPoolType} comingSoon />
        </div>

        {selectedPoolType === PoolType.ConstantProduct && <ClassicDescription />}
      </TridentBody>
    </div>
  )
}
