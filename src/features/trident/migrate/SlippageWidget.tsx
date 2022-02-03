import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { TRIDENT_MIGRATION_DEFAULT_SLIPPAGE } from 'app/features/trident/migrate/context/tridentMigrateAction'
import { useSetUserSlippageTolerance, useUserSlippageTolerance } from 'app/state/user/hooks'
import React, { useState } from 'react'

// TODO: Upcoming PR to synchronize with src/components/TransactionSettings/index.tsx
// Should make logic into redux store so it can be repurposed
export const SlippageWidget = () => {
  const { i18n } = useLingui()
  const userSlippageTolerance = useUserSlippageTolerance()
  const setSlippage = useSetUserSlippageTolerance()

  const [inputVal, setInputVal] = useState(
    userSlippageTolerance === 'auto' ? TRIDENT_MIGRATION_DEFAULT_SLIPPAGE.toFixed(2) : userSlippageTolerance.toFixed(2)
  )
  return (
    <div className="flex items-center md:self-start self-center gap-2">
      <div className="flex items-center">
        <Typography variant="xs" weight={700} className="text-high-emphesis">
          {i18n._(t`Slippage tolerance`)}
        </Typography>

        <QuestionHelper
          text={i18n._(t`Your transaction will revert if the price changes unfavorably by more than this percentage.`)}
        />
      </div>
      <div className="border-low-emphesis border-2 h-[36px] flex items-center px-2 rounded bg-dark-1000/40 relative">
        <input
          className="bg-transparent placeholder-low-emphesis min-w-0 font-bold w-16"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value)
            try {
              setSlippage(new Percent(Math.floor(parseFloat(e.target.value) * 100), 10_000))
            } catch (e) {} // Ignore false inputs for now (upcoming PR to refactor)
          }}
          onBlur={() => {}}
        />
        <div className="text-low-emphesis">%</div>
      </div>
    </div>
  )
}
