import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import { toHref } from '../../../../hooks/useTridentPools'
import AddTransactionReviewModal from '../../../../features/trident/add/AddTransactionReviewModal'
import React from 'react'
import Chart from '../../../../features/trident/add/concentrated/Chart'
import PriceRange from '../../../../features/trident/add/concentrated/PriceRange'
import TridentAddConcentratedContextProvider, {
  useTridentAddConcentratedContext,
  useTridentAddConcentratedState,
} from '../../../../features/trident/add/concentrated/context'
import RangeBlocks from '../../../../features/trident/add/concentrated/RangeBlocks'

const AddConcentrated = () => {
  const { i18n } = useLingui()
  const context = useTridentAddConcentratedContext()
  const state = useTridentAddConcentratedState()

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
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Add Liquidity`)}
          </Typography>
          <Typography variant="sm">{i18n._(t`Select a price range for the assets you're providing.`)}</Typography>
        </div>
      </div>

      <div className="flex flex-col gap-7">
        <Chart />
        <PriceRange />
        <RangeBlocks />
      </div>
      <AddTransactionReviewModal context={context} state={state} />
    </div>
  )
}

AddConcentrated.Layout = TridentLayout
AddConcentrated.Provider = TridentAddConcentratedContextProvider

export default AddConcentrated
