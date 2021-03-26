import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'

import { Search, Stats, MarketsNavigation, Navigation, SplitPane } from '.'

const SectionHeader = ({ portfolio = false, children, search, term }: any) => {
  const theme = useContext(ThemeContext)
  const { pathname } = useLocation()
  return (
    <>
      {/* Header */}
      <AutoColumn
        gap="md"
        style={{
          width: '100%',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          background: `${theme.mediumDarkPurple}`
        }}
      >
        {/* Mobile */}
        <div className="px-6 pb-2 md:px-2 md:pb-4 flex md:hidden justify-between">
          <div className="float-right items-center w-full">
            <div className="flex justify-between items-center w-full">
              <div className="font-semibold pb-2">
                {(() => {
                  switch (pathname) {
                    case '/bento/kashi':
                      return 'All Kashi Markets'
                    case '/bento/kashi/supply':
                      return 'Kashi Supply Markets'
                    case '/bento/kashi/borrow':
                      return 'Kashi Borrow Markets'
                    case '/bento/kashi/positions':
                      return 'Your Open Positions'
                    default:
                      return null
                  }
                })()}
              </div>
              <MarketsNavigation />
            </div>
            {portfolio ? children : <Search />}
          </div>
        </div>
        {/* Desktop */}
        <div className="flex justify-between items-center">
          <div className="hidden md:flex ml-4 items-center md:w-2/5">
            <div className="w-full">
              <div className="font-semibold text-lg px-4 pb-2">
                {(() => {
                  switch (pathname) {
                    case '/bento/kashi':
                      return 'All Kashi Markets'
                    case '/bento/kashi/supply':
                      return 'Kashi Supply Markets'
                    case '/bento/kashi/borrow':
                      return 'Kashi Borrow Markets'
                    case '/bento/kashi/positions':
                      return 'Your Open Positions'
                    default:
                      return null
                  }
                })()}
              </div>
              {portfolio ? children : <Search term={term} search={search} />}
            </div>
          </div>
          <div className="px-4 w-full md:w-3/5">
            <Stats />
          </div>
        </div>
      </AutoColumn>
    </>
  )
}

export default SectionHeader
