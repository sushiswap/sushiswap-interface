import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const Header = ({ sortConfig, requestSort }: any) => {
    const { i18n } = useLingui()
    return (
        <>
            <div className="grid grid-cols-3 pb-4 px-4 text-sm  text-secondary">
                <div
                    className="flex items-center cursor-pointer hover:text-secondary"
                    onClick={() => requestSort('symbol')}
                >
                    <div>{i18n._(t`Instruments`)}</div>
                    {sortConfig &&
                        sortConfig.key === 'symbol' &&
                        ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                            (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                </div>
                <div className="hover:text-secondary cursor-pointer" onClick={() => requestSort('tvl')}>
                    <div className="flex items-center justify-end">
                        <div>{i18n._(t`TVL`)}</div>
                        {sortConfig &&
                            sortConfig.key === 'tvl' &&
                            ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                    </div>
                </div>
                <div className="hover:text-secondary cursor-pointer" onClick={() => requestSort('roiPerYear')}>
                    <div className="flex items-center justify-end">
                        <div>{i18n._(t`APR`)}</div>
                        {sortConfig &&
                            sortConfig.key === 'roiPerYear' &&
                            ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
