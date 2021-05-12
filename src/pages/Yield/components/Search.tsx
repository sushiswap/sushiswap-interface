import React from 'react'
import { Search as SearchIcon } from 'react-feather'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Search({ term, search }: any) {
    const { i18n } = useLingui()

    return (
        <div className="relative w-full sm:max-w-xl md:max-w-sm flex-end">
            <input
                className="py-3 pl-4 pr-14 text-white rounded w-full focus:outline-none focus:ring border-0"
                onChange={e => search(e.target.value)}
                style={{ background: '#161522' }}
                value={term}
                placeholder={i18n._(t`Search by name, symbol, address`)}
            />
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                <SearchIcon size={16} />
            </div>
        </div>
    )
}
