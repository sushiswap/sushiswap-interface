import React from 'react'
import { useLocation } from 'react-router'
import { AutoColumn } from '../../components/Column'

import { Search, Stats, CardHeader } from '.'

const SectionHeader = ({ portfolio = false, children, search, term }: any) => {
  const { pathname } = useLocation()
  return (
    <CardHeader className="pl-0 pr-0 bg-kashi-card-inner">
      <AutoColumn
        gap="md"
        style={{
          width: '100%'
        }}
      >
        {/* Mobile */}
        <div className="px-6 pb-2 md:px-2 md:pb-4 flex md:hidden justify-between">
          <div className="float-right items-center w-full">
            <div className="flex justify-between items-center w-full">
              <div className="hidden sm:block font-semibold pb-2">
                {(() => {
                  switch (pathname) {
                    case '/bento/kashi/lend':
                      return 'Lend Markets'
                    case '/bento/kashi/borrow':
                      return 'Borrow Markets'
                    default:
                      return null
                  }
                })()}
              </div>
              {/* <MarketsNavigation /> */}
            </div>
            {portfolio ? children : <Search />}
          </div>
        </div>
        {/* Desktop */}
        <div className="flex justify-between items-center">
          {/* <div className="hidden md:flex ml-4 items-center md:w-2/5"> */}
          <div className="hidden md:flex md:justify-between ml-4 mr-8 items-center w-full">
            {/* <div className="w-full"> */}
            <div className="font-semibold text-lg px-4">
              {(() => {
                switch (pathname) {
                  case '/bento/kashi/lend':
                    return 'Lend Markets'
                  case '/bento/kashi/borrow':
                    return 'Borrow Markets'
                  default:
                    return null
                }
              })()}
            </div>
            {portfolio ? children : <Search term={term} search={search} />}
          </div>
        </div>
        {/* <div className="block md:hidden px-4 w-full md:w-3/5"> */}
        <div className="block md:hidden px-4 w-full">
          <Stats />
        </div>
        {/* </div> */}
      </AutoColumn>
    </CardHeader>
  )
}

export default SectionHeader
