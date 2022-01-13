import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Typography from 'app/components/Typography'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { ClassicDescription } from './classic/ClassicDescription'
import { selectedPoolTypeAtom } from './context/atoms'
import { PoolSelector } from './PoolSelector'
import { StepHeader } from './StepHeader'

export const StepOneSelectPoolType: FC = () => {
  const { i18n } = useLingui()
  const poolSelected = useRecoilValue(selectedPoolTypeAtom)

  return (
    <div className="w-full">
      <TridentHeader maxWidth="full" pattern="bg-binary-pattern" className="!gap-2">
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
          <PoolSelector type={PoolType.ConstantProduct} selectedPool={poolSelected} />
          <PoolSelector type={PoolType.ConcentratedLiquidity} selectedPool={poolSelected} comingSoon />
          <PoolSelector type={PoolType.Weighted} selectedPool={poolSelected} comingSoon />
          <PoolSelector type={PoolType.Hybrid} selectedPool={poolSelected} comingSoon />
        </div>

        {poolSelected === PoolType.ConstantProduct && <ClassicDescription />}
      </TridentBody>
    </div>
  )
}
