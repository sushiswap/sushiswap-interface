import { ChevronDown, ChevronUp } from 'react-feather'
import { formattedNum, formattedPercent } from '../../utils'

import DoubleLogo from '../DoubleLogo'
import { ONSEN_VIEWS } from '../../constants/onsen'
import QuestionHelper from '../QuestionHelper'
import React from 'react'
import styled from 'styled-components'
import useSortableData from '../../hooks/useSortableData'

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: minmax(225px, 1.5fr) repeat(4, minmax(150px, 1fr));
    > * {
        :first-child {
            padding-left: 0 @media screen and (min-width: 480px) {
                padding-left: 0.5em;
            }
            @media screen and (min-width: 976px) {
                padding-left: 1em;
            }
        }
    }
`

export default function OnsenTable({ farms, onsenView }: any) {
    // Sorting Setup
    const { items, requestSort, sortConfig } = useSortableData(farms)

    function Percent(props: { number: number }) {
        if (props.number > 0) {
            return <div className="text-green font-normal">+{formattedPercent(props.number)}</div>
        } else {
            return <div className="text-red font-normal">{formattedPercent(props.number)}</div>
        }
    }

    const FarmRow = ({ farm, index }: any) => {
        const symbol = farm.symbol
        const liquidity = formattedNum(farm.liquidity, true)
        const liquidityChange = farm.liquidityChange
        const volume = formattedNum(farm.volume, true)
        const volumeChange = farm.volumeChange
        const fees = formattedNum(farm.fees, true)
        const apr = formattedPercent(farm.apr)
        const earnings = formattedNum(farm?.earnings, true)

        const bgColor = index && index % 2 === 1 ? 'bg-dark-800' : 'bg-dark-900'

        return (
            <GridDiv
                className={'py-4 mb-3 gap-2 text-caption font-bold items-center w-min min-w-full rounded ' + bgColor}
            >
                <div className="flex items-center">
                    <DoubleLogo a0={farm.token0} a1={farm.token1} size={32} />
                    <div className="ml-2">{symbol}</div>
                </div>
                <div className="flex justify-between w-4/5">
                    <div className="uppercase">{liquidity}</div>
                    <Percent number={liquidityChange} />
                </div>
                <div className="flex justify-between w-4/5">
                    <div className="uppercase">{volume}</div>
                    <Percent number={volumeChange} />
                </div>
                <div>
                    {onsenView === ONSEN_VIEWS.ALL_POOLS && fees}
                    {onsenView === ONSEN_VIEWS.USER_POOLS && earnings}
                </div>
                <div>{apr}</div>
            </GridDiv>
        )
    }

    return (
        <div className="overflow-auto py-8 mb-12">
            <GridDiv className="gap-2 text-body font-bold pb-2 min-w-full">
                <div onClick={() => requestSort('symbol')} className="flex items-center cursor-pointer">
                    <div>Pool</div>
                    {sortConfig?.key === 'symbol' ? (
                        sortConfig?.direction === 'ascending' ? (
                            <ChevronUp size={12} />
                        ) : (
                            <ChevronDown size={12} />
                        )
                    ) : (
                        <ChevronUp size={12} className="invisible" />
                    )}
                </div>
                <div onClick={() => requestSort('liquidity')} className="flex items-center cursor-pointer">
                    <div>Liquidity</div>
                    {sortConfig?.key === 'liquidity' ? (
                        sortConfig?.direction === 'ascending' ? (
                            <ChevronUp size={12} />
                        ) : (
                            <ChevronDown size={12} />
                        )
                    ) : (
                        <ChevronUp size={12} className="invisible" />
                    )}
                </div>
                <div onClick={() => requestSort('volume')} className="flex items-center cursor-pointer">
                    <div>Volume (24hr)</div>
                    {sortConfig?.key === 'volume' ? (
                        sortConfig?.direction === 'ascending' ? (
                            <ChevronUp size={12} />
                        ) : (
                            <ChevronDown size={12} />
                        )
                    ) : (
                        <ChevronUp size={12} className="invisible" />
                    )}
                </div>
                {onsenView === ONSEN_VIEWS.ALL_POOLS && (
                    <div onClick={() => requestSort('fees')} className="flex items-center cursor-pointer">
                        <div>Fees (24hr)</div>
                        <QuestionHelper text="placeholder" />
                        {sortConfig?.key === 'fees' ? (
                            sortConfig?.direction === 'ascending' ? (
                                <ChevronUp size={12} />
                            ) : (
                                <ChevronDown size={12} />
                            )
                        ) : (
                            <ChevronUp size={12} className="invisible" />
                        )}
                    </div>
                )}
                {onsenView === ONSEN_VIEWS.USER_POOLS && (
                    <div onClick={() => requestSort('earnings')} className="flex items-center cursor-pointer">
                        <div>Earnings</div>
                        {sortConfig?.key === 'earnings' ? (
                            sortConfig?.direction === 'ascending' ? (
                                <ChevronUp size={12} />
                            ) : (
                                <ChevronDown size={12} />
                            )
                        ) : (
                            <ChevronUp size={12} className="invisible" />
                        )}
                    </div>
                )}
                <div onClick={() => requestSort('apr')} className="flex items-center cursor-pointer">
                    <div>APR</div>
                    {sortConfig?.key === 'apr' ? (
                        sortConfig?.direction === 'ascending' ? (
                            <ChevronUp size={12} className="visible" />
                        ) : (
                            <ChevronDown size={12} className="visible" />
                        )
                    ) : (
                        <ChevronUp size={12} className="invisible" />
                    )}
                </div>
            </GridDiv>

            {items.map((farm: any, i: number) => {
                return <FarmRow farm={farm} index={i} key={farm.address + '_' + i} />
            })}
        </div>
    )
}
