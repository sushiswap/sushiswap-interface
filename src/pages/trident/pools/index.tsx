import { useLingui } from '@lingui/react'
import { DebugObserver } from 'components/DebugObserver'
import { DiscoverHeader } from 'features/trident/pools/DiscoverHeader'
import { PoolSearch } from 'features/trident/pools/PoolSearch'
import { PoolSort } from 'features/trident/pools/PoolSort'
import SearchResultPools from 'features/trident/pools/SearchResultPools'
import { SearchSidebar } from 'features/trident/pools/SearchSidebar'
import TridentLayout, { TridentBody } from 'layouts/Trident'
import React from 'react'
import { RecoilRoot } from 'recoil'

const DiscoverPools = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex justify-center flex-grow">
      <DebugObserver />
      <div className="flex w-full">
        <SearchSidebar />
        <div className="w-full">
          <DiscoverHeader />
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
