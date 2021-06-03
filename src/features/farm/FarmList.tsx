import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { useFuse, useSortableData } from '../../hooks'

import Dots from '../../components/Dots'
import FarmListItem from './FarmListItem'
import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const FarmList = ({ farms, kmp = false, term = undefined }) => {
    const { items, requestSort, sortConfig } = useSortableData(farms)

    const { i18n } = useLingui()

    return (
        <>
            <div className="grid grid-cols-3 px-4 pb-4 text-sm md:grid-cols-4 text-secondary">
                <div
                    className="flex items-center cursor-pointer hover:text-secondary"
                    onClick={() => requestSort('symbol')}
                >
                    <div>{i18n._(t`Instruments`)}</div>
                    {sortConfig &&
                        sortConfig.key === 'symbol' &&
                        ((sortConfig.direction === 'ascending' && (
                            <ChevronUpIcon width={12} height={12} />
                        )) ||
                            (sortConfig.direction === 'descending' && (
                                <ChevronDownIcon width={12} height={12} />
                            )))}
                </div>
                <div className="hidden ml-4 md:block">
                    <div className="flex items-center justify-start">
                        <div className="pr-2">{i18n._(t`Rewards`)}</div>
                    </div>
                </div>
                <div
                    className="cursor-pointer hover:text-secondary"
                    onClick={() => requestSort('tvl')}
                >
                    <div className="flex items-center justify-end">
                        <div>{i18n._(t`TVL`)}</div>
                        {sortConfig &&
                            sortConfig.key === 'tvl' &&
                            ((sortConfig.direction === 'ascending' && (
                                <ChevronUpIcon width={12} height={12} />
                            )) ||
                                (sortConfig.direction === 'descending' && (
                                    <ChevronDownIcon width={12} height={12} />
                                )))}
                    </div>
                </div>
                <div
                    className="cursor-pointer hover:text-secondary"
                    onClick={() => requestSort('roiPerYear')}
                >
                    <div className="flex items-center justify-end">
                        <div>{i18n._(t`APY`)}</div>
                        {sortConfig &&
                            sortConfig.key === 'roiPerYear' &&
                            ((sortConfig.direction === 'ascending' && (
                                <ChevronUpIcon width={12} height={12} />
                            )) ||
                                (sortConfig.direction === 'descending' && (
                                    <ChevronDownIcon width={12} height={12} />
                                )))}
                    </div>
                </div>
            </div>
            <div className="flex-col space-y-2">
                {items && items.length ? (
                    items.map((farm) => {
                        // console.log({ farm })
                        return <FarmListItem farm={farm} kmp={kmp} />
                    })
                ) : term ? (
                    <div className="w-full py-6 text-center">No Results.</div>
                ) : (
                    <div className="w-full py-6 text-center">
                        <Dots>Loading</Dots>
                    </div>
                )}
            </div>
        </>
    )
}

export default FarmList
