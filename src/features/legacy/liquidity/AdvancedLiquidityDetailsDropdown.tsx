import { AdvancedLiquidityDetails, AdvancedLiquidityDetailsProps } from './AdvancedLiquidityDetails'

import React from 'react'
import { classNames } from '../../../functions'

export default function AdvancedSwapDetailsDropdown({ show, ...rest }: AdvancedLiquidityDetailsProps) {
  return (
    <div
      className={classNames(
        Boolean(show) ? 'translate-y-0' : '-translate-y-full',
        'w-full pt-12 pb-8 -mt-8 max-w-[662px] pr-2.5 pl-2.5'
      )}
    >
      <AdvancedLiquidityDetails {...rest} />
    </div>
  )
}
