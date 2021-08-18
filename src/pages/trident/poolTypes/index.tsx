import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { POOLS_ROUTE, POOL_TYPES_ROUTE } from '../../../constants/routes'
import PoolTypesList from '../../../features/trident/types/PoolTypesList'
import { toHref } from '../../../hooks/useTridentPools'
import DepositSettingsModal from '../../../features/trident/add/DepositSettingsModal'
import { LiquidityMode } from '../../../features/trident/add/context/types'
import SettingsTab from '../../../components/Settings'
import React from 'react'

export const getStaticProps = async () => ({
  props: {
    breadcrumbs: [POOLS_ROUTE, POOL_TYPES_ROUTE],
  },
})

const PoolTypes = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col w-full gap-9 mt-px">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-binary-pattern bg-opacity-90 gap-4">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="rounded-full py-1 pl-2"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pools`}>{i18n._(t`Back`)}</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {i18n._(t`Pool Types`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Learn more about the power of Sushi's AMM and Tines routing engine.`)}
          </Typography>
        </div>
      </div>
      <div className="px-5 flex flex-col gap-4">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`What kinds of liquidity pools are supported on Sushi?`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`Currently, there are four pool types on the platform.  However, our infrastructure has been built in a way to support more and more pool types as they emerge.`
          )}
        </Typography>
      </div>
      <div className="px-5">
        <Typography
          variant="lg"
          className="bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent"
          weight={700}
        >
          {i18n._(t`CURRENT POOL TYPES`)}
        </Typography>
        <Typography variant="sm">{i18n._(t`Tap any to learn more`)}</Typography>
      </div>
      <PoolTypesList />
    </div>
  )
}

PoolTypes.Layout = TridentLayout

export default PoolTypes
