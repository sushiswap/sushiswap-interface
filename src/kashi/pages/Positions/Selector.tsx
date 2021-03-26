import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import { useKashiCounts } from '../../context'

export default function PositionsSelector() {
  const counts = useKashiCounts()
  const theme = useContext(ThemeContext)
  const location = useLocation()
  return (
    <div>
      {/* Desktop Styles */}
      <div className="hidden w-full px-4 md:flex items-center md:justify-between">
        <div className="py-3 md:py-0 flex items-center space-x-2 mr-4">
          <div
            className="px-2 py-1 font-semibold rounded"
            style={{ background: theme.baseCard, color: `${theme.primaryBlue}` }}
          >
            {counts.pairsSupplied}
          </div>
          <Link
            className={
              (location.pathname === '/bento/kashi/positions/supply'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-400') + ' cursor-pointer focus:outline-none'
            }
            to={'/bento/kashi/positions/supply'}
          >
            Supply Pairs
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="px-2 py-1 font-semibold rounded"
            style={{ background: theme.baseCard, color: `${theme.primaryPink}` }}
          >
            {counts.pairsBorrowed}
          </div>
          <Link
            className={
              (location.pathname === '/bento/kashi/positions/borrow'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-400') + ' cursor-pointer focus:outline-none'
            }
            to={'/bento/kashi/positions/borrow'}
          >
            Borrow Pairs
          </Link>
        </div>
      </div>
      {/* Mobile Styles */}
      <div className="md:hidden w-full grid grid-cols-2 gap-4">
        <Link
          className="px-4 py-3 md:py-0 flex justify-between items-center space-x-2 rounded-lg"
          style={{ background: `${location.pathname === '/bento/kashi/positions/supply' ? theme.baseCard : ''}` }}
          to={'/bento/kashi/positions/supply'}
        >
          <div className="px-3 py-1 font-semibold rounded text-white" style={{ background: `${theme.primaryBlue}` }}>
            {counts.pairsSupplied}
          </div>
          <div
            className={
              `${
                location.pathname === '/bento/kashi/positions/supply'
                  ? 'text-white cursor-pointer'
                  : 'text-gray-500 hover:text-gray-400'
              }` + ' text-sm cursor-pointer'
            }
          >
            Supplying
          </div>
        </Link>
        <Link
          className="px-4 py-3 sm:py-0 flex justify-between items-center space-x-2 rounded-lg"
          style={{ background: `${location.pathname === '/bento/kashi/positions/borrow' ? theme.baseCard : ''}` }}
          to={'/bento/kashi/positions/borrow'}
        >
          <div className="px-3 py-1 font-semibold rounded text-white" style={{ background: `${theme.primaryPink}` }}>
            {counts.pairsBorrowed}
          </div>
          <div
            className={
              `${
                location.pathname === '/bento/kashi/positions/borrow'
                  ? 'text-white cursor-pointer'
                  : 'text-gray-500 hover:text-gray-400'
              }` + ' text-sm cursor-pointer'
            }
          >
            Borrowing
          </div>
        </Link>
      </div>
    </div>
  )
}
