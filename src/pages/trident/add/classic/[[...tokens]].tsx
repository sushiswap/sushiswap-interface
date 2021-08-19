import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import ClassicZapMode from '../../../../features/trident/add/classic/ClassicZapMode'
import { toHref } from '../../../../hooks/useTridentPools'
import ClassicStandardMode from '../../../../features/trident/add/classic/ClassicStandardMode'
import AddTransactionReviewModal from '../../../../features/trident/add/AddTransactionReviewModal'
import React from 'react'
import SettingsTab from '../../../../components/Settings'
import TridentAddClassicContextProvider, {
  useTridentAddClassicContext,
  useTridentAddClassicState,
} from '../../../../features/trident/add/classic/context'
import BalancedModeHeader from '../../../../features/trident/add/classic/BalancedModeHeader'
import DepositSettingsModal from '../../../../features/trident/add/classic/DepositSettingsModal'
import { LiquidityMode } from '../../../../features/trident/types'
import ModeToggle from '../../../../features/trident/ModeToggle'

const AddClassic = () => {
  const { i18n } = useLingui()
  const state = useTridentAddClassicState()
  const context = useTridentAddClassicContext()

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-bubble-pattern bg-opacity-60 gap-4">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="rounded-full py-1 pl-2"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/${toHref(context.pool)}`}>{i18n._(t`Back`)}</Link>
          </Button>
          <DepositSettingsModal />
          {state.liquidityMode === LiquidityMode.ZAP && <SettingsTab />}
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Add Liquidity`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Deposit all pool tokens directly with Standard mode, or invest & rebalance with any asset in Zap mode.`
            )}
          </Typography>
        </div>

        {/*spacer*/}
        <div className="h-2" />
      </div>

      <ModeToggle value={state.liquidityMode} onChange={context.setLiquidityMode} />
      <BalancedModeHeader />

      {state.liquidityMode === LiquidityMode.ZAP && <ClassicZapMode />}
      {state.liquidityMode === LiquidityMode.STANDARD && <ClassicStandardMode />}

      <AddTransactionReviewModal state={state} context={context} />
    </div>
  )
}

AddClassic.Layout = TridentLayout
AddClassic.Provider = TridentAddClassicContextProvider

export default AddClassic
