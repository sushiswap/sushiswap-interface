import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { useKashiCounts } from '../../context'

type Selected = 'supply' | 'borrow'

interface PositionsToggle {
  selected: Selected
  setSelected: (selected: Selected) => void
}

export default function PositionsToggle({ selected, setSelected }: PositionsToggle) {
  const counts = useKashiCounts()
  const theme = useContext(ThemeContext)
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
          <button
            className={
              (selected === 'supply' ? 'text-white' : 'text-gray-500 hover:text-gray-400') +
              ' cursor-pointer focus:outline-none'
            }
            onClick={() => setSelected('supply')}
          >
            Supply Pairs
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="px-2 py-1 font-semibold rounded"
            style={{ background: theme.baseCard, color: `${theme.primaryPink}` }}
          >
            {counts.pairsBorrowed}
          </div>
          <button
            className={
              (selected === 'borrow' ? 'text-white' : 'text-gray-500 hover:text-gray-400') +
              ' cursor-pointer focus:outline-none'
            }
            onClick={() => setSelected('borrow')}
          >
            Borrow Pairs
          </button>
        </div>
      </div>
      {/* Mobile Styles */}
      <div className="md:hidden w-full grid grid-cols-2 gap-4">
        <button
          className="px-4 py-3 md:py-0 flex justify-between items-center space-x-2 rounded-lg"
          style={{ background: `${selected === 'supply' ? theme.baseCard : ''}` }}
          onClick={() => setSelected('supply')}
        >
          <div className="px-3 py-1 font-semibold rounded text-white" style={{ background: `${theme.primaryBlue}` }}>
            {counts.pairsSupplied}
          </div>
          <div
            className={
              `${selected === 'supply' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400'}` +
              ' text-sm cursor-pointer'
            }
          >
            Supplying
          </div>
        </button>
        <button
          className="px-4 py-3 sm:py-0 flex justify-between items-center space-x-2 rounded-lg"
          style={{ background: `${selected === 'borrow' ? theme.baseCard : ''}` }}
          onClick={() => setSelected('borrow')}
        >
          <div className="px-3 py-1 font-semibold rounded text-white" style={{ background: `${theme.primaryPink}` }}>
            {counts.pairsBorrowed}
          </div>
          <div
            className={
              `${selected === 'borrow' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400'}` +
              ' text-sm cursor-pointer'
            }
          >
            Borrowing
          </div>
        </button>
      </div>
    </div>
  )
}
