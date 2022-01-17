import { DiscoverHeader } from 'app/features/trident/pools/DiscoverHeader'
import { PoolSearch } from 'app/features/trident/pools/PoolSearch'
import { PoolSort } from 'app/features/trident/pools/PoolSort'
import SearchResultPools from 'app/features/trident/pools/SearchResultPools'
import { SearchSidebar } from 'app/features/trident/pools/SearchSidebar'
import TridentLayout, { TridentBody } from 'app/layouts/Trident'
import React from 'react'

const DiscoverPools = () => {
  return (
    <>
      <DiscoverHeader />
      <TridentBody>
        <div className="flex gap-6">
          <SearchSidebar />
          <div className="flex w-full">
            <div className="flex flex-col w-full gap-10">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                <PoolSearch />
                <PoolSort />
              </div>
              <SearchResultPools />
            </div>
          </div>
        </div>
      </TridentBody>
    </>
  )
}

DiscoverPools.Layout = TridentLayout

export default DiscoverPools
