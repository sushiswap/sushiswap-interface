import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import SearchResultPools from '../../../features/trident/pool/SearchResultPools'
import ListActions from '../../../features/trident/pool/ListActions'
import { TridentPoolPageContextProvider, useTridentPoolPageState } from '../../../features/trident/pool/context'
import SuggestedPools from '../../../features/trident/pool/SuggestedPools'
import { classNames } from '../../../functions'

export async function getStaticProps() {
  return {
    props: { breadcrumbs: [{ label: 'Pools', slug: '/trident/pool' }] },
  }
}

const Pool = () => {
  const { i18n } = useLingui()
  const { searchQuery } = useTridentPoolPageState()

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-binary-pattern bg-opacity-90 gap-6">
        <div className="">
          <Typography variant="h3" className="text-high-emphesis" weight={400}>
            {i18n._(t`Provide liquidity & earn.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Earn LP fees by depositing tokens to the platform.`)}
          </Typography>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button color="gradient" size="sm" className="text-sm font-bold text-white py-2">
            {i18n._(t`Create a New Pool`)}
          </Button>
          <Button color="gradient" variant="outlined" className="text-sm font-bold text-white py-2">
            {i18n._(t`Pool Type Info`)}
          </Button>
        </div>
      </div>
      <ListActions />
      <div className={classNames('flex gap-6', searchQuery ? 'flex-col-reverse' : 'flex-col')}>
        <SuggestedPools />
        <SearchResultPools />
      </div>
    </div>
  )
}

Pool.Provider = TridentPoolPageContextProvider
Pool.Layout = TridentLayout

export default Pool
