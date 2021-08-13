import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import ModeToggle from '../../../features/trident/add/ModeToggle'
import {
  TridentAddLiquidityPageContextProvider,
  useTridentAddLiquidityPageContext,
  useTridentAddLiquidityPageState,
} from '../../../features/trident/add/context'
import ClassicZapMode from '../../../features/trident/add/ClassicZapMode'
import { LiquidityMode } from '../../../features/trident/add/context/types'
import { toHref } from '../../../hooks/useTridentPools'
import ClassicStandardMode from '../../../features/trident/add/ClassicStandardMode'
import { PoolType } from '../../../features/trident/pool/context/types'
import HybridZapMode from '../../../features/trident/add/HybridZapMode'
import HybridStandardMode from '../../../features/trident/add/HybridStandardMode'
import AddTransactionReviewModal from '../../../features/trident/add/AddTransactionReviewModal'
import React from 'react'
import BalancedModeModal from '../../../features/trident/add/BalancedModeModal'
import BalancedModeHeader from '../../../features/trident/add/BalancedModeHeader'

const Add = () => {
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
          <BalancedModeModal />
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

      <ModeToggle />
      <BalancedModeHeader />

      {pool.type === PoolType.CLASSIC && (
        <>
          {liquidityMode === LiquidityMode.ZAP && <ClassicZapMode />}
          {liquidityMode === LiquidityMode.STANDARD && <ClassicStandardMode />}
        </>
      )}

      {pool.type === PoolType.HYBRID && (
        <>
          {liquidityMode === LiquidityMode.ZAP && <HybridZapMode />}
          {liquidityMode === LiquidityMode.STANDARD && <HybridStandardMode />}
        </>
      )}

      <AddTransactionReviewModal />
    </div>
  )
}

Add.Layout = TridentLayout
Add.Provider = TridentAddLiquidityPageContextProvider

export default Add
