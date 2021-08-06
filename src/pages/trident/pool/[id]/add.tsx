import { POOL_TYPES } from '../../../../features/trident/pool/context/constants'
import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import SettingsTab from '../../../../components/Settings'
import Typography from '../../../../components/Typography'
import { ADD_LIQUIDITY_ROUTE, POOL_ROUTE, POOLS_ROUTE } from '../../../../constants/routes'
import ZapModeToggle from '../../../../features/trident/add/ZapModeToggle'
import {
  TridentAddLiquidityPageContextProvider,
  useTridentAddLiquidityPageState,
} from '../../../../features/trident/add/context'
import ZapMode from '../../../../features/trident/add/ZapMode'
import { LiquidityMode } from '../../../../features/trident/add/context/types'

export const getStaticPaths = async () => ({
  paths: [{ params: { id: '1' } }],
  fallback: false,
})

export const getStaticProps = async ({ params }) => {
  const { id } = params

  return {
    props: {
      pool: POOL_TYPES[id],
      breadcrumbs: [POOLS_ROUTE, POOL_ROUTE('SUSHI-WETH - Classic - 0.05% Fee', id), ADD_LIQUIDITY_ROUTE],
    },
  }
}

const Add = () => {
  const { i18n } = useLingui()
  const { liquidityMode } = useTridentAddLiquidityPageState()

  return (
    <div className="flex flex-col w-full mt-px">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-bubble-pattern bg-opacity-60 gap-4">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="rounded-full py-1 pl-2"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={'/trident/pool/1'}>{i18n._(t`Back`)}</Link>
          </Button>
          <SettingsTab />
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Add Liquidity`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Deposit both pool tokens directly with Standard mode, or invest & rebalance with any asset in Zap mode.`
            )}
          </Typography>
        </div>

        {/*spacer*/}
        <div className="h-2" />
      </div>
      <ZapModeToggle />
      {liquidityMode === LiquidityMode.ZAP && <ZapMode />}
    </div>
  )
}

Add.Layout = TridentLayout
Add.Provider = TridentAddLiquidityPageContextProvider

export default Add
