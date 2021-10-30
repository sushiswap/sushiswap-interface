import { Fee } from '@sushiswap/trident-sdk'
import Typography from 'components/Typography'
import React, { FC } from 'react'
import { useRecoilState } from 'recoil'

import { selectedFeeTierAtom } from '../context/atoms'
import { FeeTierSelect } from './FeeTierSelect'

export const SelectFeeTier: FC = () => {
  const [selectedFeeTier, setSelectedFeeTier] = useRecoilState(selectedFeeTierAtom)

  return (
    <div>
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        Select Fee Tier
      </Typography>
      <div className="text-secondary mt-2">
        Select the percentage of fee that this pool will take from a swap order. Higher fee tiers suit pairs with more
        volatility and less volume.
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3 select-none mt-4">
        <FeeTierSelect
          tier={1}
          subtitle="Best for stable pairs"
          selectedFeeTier={selectedFeeTier}
          setter={setSelectedFeeTier}
        />
        <FeeTierSelect
          tier={5}
          subtitle="Best for mainstream pairs"
          selectedFeeTier={selectedFeeTier}
          setter={setSelectedFeeTier}
        />
        <FeeTierSelect
          tier={Fee.DEFAULT}
          subtitle="Best for volatile pairs"
          selectedFeeTier={selectedFeeTier}
          setter={setSelectedFeeTier}
        />
        <FeeTierSelect
          tier={100}
          subtitle="Best for exotic pairs"
          selectedFeeTier={selectedFeeTier}
          setter={setSelectedFeeTier}
        />
      </div>
    </div>
  )
}
