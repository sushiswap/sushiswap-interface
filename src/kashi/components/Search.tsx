import React, { useContext } from 'react'
import { transparentize } from 'polished'
import { ThemeContext } from 'styled-components'
import { Search as SearchIcon } from 'react-feather'

export default function Search() {
  const theme = useContext(ThemeContext)
  return (
    <div className="relative">
      <input
        className="py-3 px-4 rounded-full w-full focus:outline-none"
        style={{ background: theme.baseCard }}
        //onChange={e => search(e.target.value)}
        //value={term}
        placeholder="Search by name, symbol, address"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <SearchIcon size={16} />
      </div>
    </div>
  )
}
