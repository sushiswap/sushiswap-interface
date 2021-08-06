import TridentLayout from '../../../layouts/Trident'
import SearchResultPools from '../../../features/trident/pool/SearchResultPools'
import PoolListActions from '../../../features/trident/pool/PoolListActions'
import { TridentPoolPageContextProvider, useTridentPoolPageState } from '../../../features/trident/pool/context'
import SuggestedPools from '../../../features/trident/pool/SuggestedPools'
import { classNames } from '../../../functions'
import { POOLS_ROUTE } from '../../../constants/routes'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { useLingui } from '@lingui/react'

export const getStaticProps = async () => ({
  props: { breadcrumbs: [POOLS_ROUTE] },
})

const Pool = () => {
  const { i18n } = useLingui()
  const { searchQuery } = useTridentPoolPageState()

  return (
    <div className="flex flex-col w-full gap-6 mt-px">
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
      <PoolListActions />
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
