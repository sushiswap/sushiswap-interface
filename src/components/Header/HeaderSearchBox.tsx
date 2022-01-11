import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { FC } from 'react'
import { Search } from 'react-feather'

// NOT FINALIZED WITH DESIGN YET
const HeaderSearchBox: FC = () => {
  const { i18n } = useLingui()
  return (
    <div className="relative w-full mx-4">
      <div className="absolute inset-y-0 left-4 flex items-center pr-6 pointer-events-none">
        <Search size={16} className="text-blue" />
      </div>
      <input
        className="py-2.5 pl-12 pr-4 rounded w-full focus:outline-none focus:ring focus:ring-blue bg-dark-900 text-sm"
        placeholder={i18n._(t`Search for tokens, pairs, farms`)}
      />
    </div>
  )
}

export default HeaderSearchBox
