import { Fee } from '@sushiswap/trident-sdk'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions/styling'
import React, { FC } from 'react'
import { SetterOrUpdater } from 'recoil'

interface FeeTierSelectProps {
  tier: Fee
  subtitle: string
  selectedFeeTier: Fee | undefined
  setter: SetterOrUpdater<Fee | undefined>
}

export const FeeTierSelect: FC<FeeTierSelectProps> = ({ tier, subtitle, selectedFeeTier, setter }) => {
  const active = tier === selectedFeeTier

  return (
    <div
      id={`fee-tier-${tier}`}
      style={active ? { boxShadow: '#27b0e6 0px 7px 67px -33px' } : {}}
      className={classNames(
        'flex flex-col rounded justify-center border p-8 border-dark-700 hover:cursor-pointer',
        active ? 'text-high-emphesis bg-dark-900' : 'text-secondary'
      )}
      onClick={() => setter(tier)}
    >
      <Typography variant="h3" weight={700}>
        {tier / 100}%
      </Typography>
      <div>{subtitle}</div>
    </div>
  )
}
