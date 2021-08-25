import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import SettingsTab from '../../../../components/Settings'
import Typography from '../../../../components/Typography'
import { toHref } from '../../../../hooks/useTridentPools'
import React from 'react'
import RemoveTransactionReviewModal from '../../../../features/trident/remove/RemoveTransactionReviewModal'
import TridentRemoveHybridContextProvider, {
  useTridentRemoveHybridContext,
  useTridentRemoveHybridState,
} from '../../../../features/trident/remove/hybrid/context'
import ModeToggle from '../../../../features/trident/ModeToggle'

const RemoveHybrid = () => {
  const { i18n } = useLingui()
  const state = useTridentRemoveHybridState()
  const context = useTridentRemoveHybridContext()

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-bars-pattern bg-opacity-60 gap-4">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="rounded-full py-1 pl-2"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/${toHref('currencies', context.currencies)}`}>{i18n._(t`Back`)}</Link>
          </Button>
          <SettingsTab />
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Remove Liquidity`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Receive both pool tokens directly with Standard mode, or receive total investment as any asset in Zap mode.`
            )}
          </Typography>
        </div>

        {/*spacer*/}
        <div className="h-2" />
      </div>

      <ModeToggle state={state} context={context} />

      <>
        {/*{liquidityMode === LiquidityMode.ZAP && <HybridUnzapMode />}*/}
        {/*{liquidityMode === LiquidityMode.STANDARD && <HybridStandardMode />}*/}
      </>

      <RemoveTransactionReviewModal state={state} context={context} />
    </div>
  )
}

RemoveHybrid.Layout = TridentLayout
RemoveHybrid.Provider = TridentRemoveHybridContextProvider

export default RemoveHybrid
