import { POOL_TYPES } from '../../../../features/trident/pool/context/constants'
import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import SettingsTab from '../../../../components/Settings'
import Typography from '../../../../components/Typography'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import { useState } from 'react'
import Alert from '../../../../components/Alert'

export const getStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: '1' },
      },
    ],
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { id } = params

  return {
    props: {
      pool: POOL_TYPES[id],
      breadcrumbs: [
        { label: 'Pools', slug: '/trident/pool' },
        { label: 'SUSHI-WETH - Classic - 0.05% Fee', slug: '/trident/pool/1' },
        { label: 'Add Liquidity', slug: '/trident/pool/1/add' },
      ],
    },
  }
}

const Add = () => {
  const { i18n } = useLingui()
  const [mode, setMode] = useState('Zap Mode')

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
      <div className="px-5 -mt-6">
        <ToggleButtonGroup value={mode} onChange={setMode} className="bg-dark-900 shadow z-10">
          <ToggleButtonGroup.Button value="Standard Mode" className="py-2.5">
            {i18n._(t`Standard Mode`)}
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value="Zap Mode" className="py-2.5">
            {i18n._(t`Zap Mode`)}
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup>
      </div>
      <div className="px-5 mt-5">
        <Alert
          dismissable={false}
          type="information"
          showIcon
          message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
        />
      </div>
    </div>
  )
}

Add.Layout = TridentLayout

export default Add
