import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'components/Button'
import { DebugObserver } from 'components/DebugObserver'
import Typography from 'components/Typography'
import { PoolSearch } from 'features/trident/pools/PoolSearch'
import { PoolSort } from 'features/trident/pools/PoolSort'
import SearchResultPools from 'features/trident/pools/SearchResultPools'
import { SearchSidebar } from 'features/trident/pools/SearchSidebar'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import React from 'react'
import { RecoilRoot } from 'recoil'

const DiscoverPools = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex justify-center">
      <DebugObserver />
      <div className="flex w-full">
        <SearchSidebar />
        <div className="w-full">
          <TridentHeader
            maxWidth="full"
            pattern="bg-binary-pattern"
            className="sm:!flex-row justify-between items-center"
          >
            <div>
              <Typography variant="h2" className="text-high-emphesis" weight={700}>
                {i18n._(t`Provide liquidity & earn.`)}
              </Typography>
              <Typography variant="sm" weight={400}>
                {i18n._(t`Earn LP fees by depositing tokens to the platform.`)}
              </Typography>
            </div>
            <Button color="gradient" variant="outlined" className="text-sm font-bold text-white h-8 px-12">
              <Link href={'/trident/create'}>{i18n._(t`Create New Pool`)}</Link>
            </Button>
          </TridentHeader>
          <TridentBody maxWidth="full" className="!p-7">
            <div className="flex flex-col sm:flex-row justify-between md:gap-24 gap-4 items-center">
              <PoolSearch />
              <PoolSort />
            </div>
            <SearchResultPools />
          </TridentBody>
        </div>
      </div>
    </div>
  )
}

DiscoverPools.Provider = RecoilRoot
DiscoverPools.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[{ label: 'Pools' }, { label: 'Search Results' }]} />
)

export default DiscoverPools
