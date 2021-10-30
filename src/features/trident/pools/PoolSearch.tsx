import { SearchIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { FC } from 'react'
import { useSetRecoilState } from 'recoil'

import { searchQueryAtom } from './context/atoms'
import { MobileFilter } from './MobileFilter'

export const PoolSearch: FC = () => {
  const { i18n } = useLingui()
  const setSearchQuery = useSetRecoilState(searchQueryAtom)

  return (
    <div className="flex flex-grow items-center gap-4 w-full sm:w-auto">
      <div className="flex flex-grow gap-2 items-center rounded border border-dark-800 bg-dark-900 bg-opacity-50 py-2 px-3 w-full sm:w-auto">
        <SearchIcon strokeWidth={5} width={20} height={20} />
        <input
          className="bg-transparent text-high-emphesis w-full"
          placeholder={i18n._(t`Search by token or pair`)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <MobileFilter />
    </div>
  )
}
