import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import ModeToggle from '../../../../features/trident/add/ModeToggle'
import {
  TridentAddLiquidityPageContextProvider,
  useTridentAddLiquidityPageContext,
  useTridentAddLiquidityPageState,
} from '../../../../features/trident/add/context'
import { LiquidityMode } from '../../../../features/trident/add/context/types'
import { toHref } from '../../../../hooks/useTridentPools'
import AddTransactionReviewModal from '../../../../features/trident/add/AddTransactionReviewModal'
import React from 'react'
import DepositSettingsModal from '../../../../features/trident/add/DepositSettingsModal'
import BalancedModeHeader from '../../../../features/trident/add/BalancedModeHeader'
import SettingsTab from '../../../../components/Settings'
import { PoolType } from '../../../../features/trident/types'

const AddConcentrated = () => {
  const { i18n } = useLingui()
  const { liquidityMode } = useTridentAddLiquidityPageState()
  const { pool } = useTridentAddLiquidityPageContext()

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
            <Link href={`/trident/pool/${toHref(pool)}`}>{i18n._(t`Back`)}</Link>
          </Button>
          <DepositSettingsModal />
          {liquidityMode === LiquidityMode.ZAP && <SettingsTab />}
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Add Liquidity`)}
          </Typography>
          <Typography variant="sm">{i18n._(t`Select a price range for the assets you're providing.`)}</Typography>
        </div>
      </div>

      <AddTransactionReviewModal />
    </div>
  )
}

AddConcentrated.Layout = TridentLayout
AddConcentrated.Provider = TridentAddLiquidityPageContextProvider(PoolType.CONCENTRATED)

export default AddConcentrated
