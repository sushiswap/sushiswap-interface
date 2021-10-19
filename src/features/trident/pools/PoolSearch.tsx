import { FC } from 'react'
import { SearchIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useSetRecoilState } from 'recoil'
import { searchQueryAtom } from './context/atoms'
import { useLingui } from '@lingui/react'

export const PoolSearch: FC = () => {
  const { i18n } = useLingui()
  const setSearchQuery = useSetRecoilState(searchQueryAtom)

  return (
    <div className="flex flex-grow gap-2 items-center rounded border border-dark-800 bg-dark-900 bg-opacity-50 py-2 px-3 flex-grow">
      <SearchIcon strokeWidth={5} width={20} height={20} />
      <input
        className="bg-transparent text-high-emphesis w-full"
        placeholder={i18n._(t`Search by token or pair`)}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
