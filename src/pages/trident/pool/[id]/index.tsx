import TridentLayout from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { POOL_TYPES } from '../../../../features/trident/pool/context/constants'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import CurrencyLogo, { CurrencyLogoArray } from '../../../../components/CurrencyLogo'
import { SUSHI } from '../../../../constants'
import { ChainId, WETH9 } from '@sushiswap/sdk'
import Chip from '../../../../components/Chip'
import ListPanel from '../../../../components/ListPanel'
import ListPanelHeader from '../../../../components/ListPanel/ListPanelHeader'
import ListPanelFooter from '../../../../components/ListPanel/ListPanelFooter'
import ListPanelItem from '../../../../components/ListPanel/ListPanelItem'
import { useState } from 'react'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import { POOLS_ROUTE } from '../../../../constants/routes'
import PoolStats from '../../../../features/trident/pool/PoolStats'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'

export const getStaticPaths = async () => ({
  paths: [{ params: { id: '1' } }],
  fallback: false,
})

export const getStaticProps = async ({ params }) => {
  const { id } = params

  return {
    props: {
      pool: POOL_TYPES[id],
      breadcrumbs: [POOLS_ROUTE, { label: 'SUSHI-WETH - Classic - 0.05% Fee', slug: '/trident/pool/1' }],
    },
  }
}

const Pool = () => {
  const { i18n } = useLingui()

  const ListPanelItems = [
    <ListPanelItem
      key={0}
      left={
        <div className="flex flex-row gap-1">
          <CurrencyLogo currency={SUSHI[ChainId.MAINNET]} size={20} />
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            1,000.00 SUSHI
          </Typography>
        </div>
      }
      right={
        <Typography variant="xs" weight={400} className="text-right">
          $8,360.00
        </Typography>
      }
    />,
    <ListPanelItem
      key={1}
      left={
        <div className="flex flex-row gap-1">
          <CurrencyLogo currency={WETH9[ChainId.MAINNET]} size={20} />
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            3.66 WETH
          </Typography>
        </div>
      }
      right={
        <Typography variant="xs" weight={400} className="text-right">
          $8,360.00
        </Typography>
      }
    />,
  ]

  return (
    <div className="flex flex-col w-full mt-px">
      <div className="flex flex-col">
        <div className="flex flex-col bg-dark-900">
          <div className="flex flex-row p-5 justify-between bg-dots-pattern">
            <div className="flex flex-col items-start gap-5">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="rounded-full py-1 pl-2"
                startIcon={<ChevronLeftIcon width={24} height={24} />}
              >
                <Link href={'/trident/pool'}>{i18n._(t`Pools`)}</Link>
              </Button>

              {/*spacer*/}
              <div className="h-2" />
            </div>
            <div className="flex flex-col text-right gap-2">
              <Typography variant="sm">APY (Annualized)</Typography>
              <div className="flex flex-col">
                <Typography variant="h3" className="text-high-emphesis" weight={700}>
                  22.27%
                </Typography>
                <Typography variant="xxs" className="text-secondary">
                  Including fees
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 mt-[-32px] flex flex-col gap-2">
          <CurrencyLogoArray currencies={[SUSHI[ChainId.MAINNET], WETH9[ChainId.MAINNET]]} size={64} />
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            SUSHI-WETH
          </Typography>
          <div className="flex flex-row gap-2 items-center">
            <Chip label="Classic Pool" color="purple" />
            <Typography weight={700} variant="sm">
              0.05% Fees
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 px-5 pt-6">
          <Button variant="outlined" color="gradient">
            <Link href="/trident/pool/1/add">{i18n._(t`Add Liquidity`)}</Link>
          </Button>
          <Button variant="outlined" color="gradient">
            {i18n._(t`Remove Liquidity`)}
          </Button>
          <Button variant="outlined" color="gray" className="w-full col-span-2">
            {i18n._(t`View Analytics`)}
          </Button>
        </div>
      </div>
      <div className="flex flex-col px-5 gap-5 mt-12">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`My Deposits`)}
        </Typography>
        <ListPanel
          header={<ListPanelHeader title={i18n._(t`Assets`)} value="$16,720.00" subValue="54.32134 SLP" />}
          items={ListPanelItems}
          footer={<ListPanelFooter title={i18n._(t`Share of Pool`)} value="0.05%" />}
        />
      </div>
      <div className="flex flex-col px-5 gap-5 mt-12">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Market`)}
        </Typography>
        <ListPanel
          header={<ListPanelHeader title={i18n._(t`Assets`)} value="$356,227,073.45" subValue="1,837,294.56 SLP" />}
          items={ListPanelItems}
        />
      </div>
      <PoolStatsChart />
      <PoolStats />
    </div>
  )
}

Pool.Layout = TridentLayout

export default Pool
