import { classNames } from 'functions'
import { useLastTruthy } from 'hooks/useLast'
import React from 'react'

import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)
  return (
    <div
      className={classNames(
        Boolean(trade) ? 'translate-y-0' : '-translate-y-full',
        'w-full pt-12 pb-8 -mt-8 max-w-[662px] pr-2.5 pl-2.5'
      )}
    >
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </div>
  )
}
