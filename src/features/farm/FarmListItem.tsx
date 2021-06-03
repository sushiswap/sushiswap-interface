import React, { useState } from 'react'
import { formatNumber, formatPercent } from '../../functions'

import DoubleLogo from '../../components/DoubleLogo'
import FarmDropDown from './FarmDropDown'
import Image from 'next/image'
import Paper from '../../components/Paper'
import { t } from '@lingui/macro'
import { useCurrency } from '../../hooks/Tokens'
import { useLingui } from '@lingui/react'

const FarmListItem = ({ farm, kmp }) => {
    const { i18n } = useLingui()
    const [expand, setExpand] = useState<boolean>(false)
    const currency0 = useCurrency(farm?.liquidityPair?.token0?.id)
    const currency1 = useCurrency(farm?.liquidityPair?.token1?.id)
    return (
        <Paper className="bg-dark-800" key={farm.id}>
            <div
                className="grid grid-cols-4 px-4 py-2 rounded rounded-b-none cursor-pointer select-none bg-dark-850 md:grid-cols-4"
                onClick={() => setExpand(!expand)}
            >
                <div className="text-sm font-semibold sm:text-base">
                    {farm?.liquidityPair?.token0?.symbol +
                        '-' +
                        farm?.liquidityPair?.token1?.symbol}{' '}
                    {farm?.type}
                </div>
                <div className="hidden ml-4 text-sm text-gray-500 md:block sm:text-base">
                    {farm?.rewards?.map((reward) => reward.token).join(' & ')}
                </div>
                <div className="text-sm text-right text-gray-500 sm:text-base">
                    {formatNumber(farm?.tvl, true)}
                </div>
                <div className="text-sm font-semibold text-right sm:text-base">
                    {farm?.roiPerYear > 100
                        ? '10000%+'
                        : formatPercent(farm?.roiPerYear * 100)}
                </div>
            </div>
            <div
                className="grid grid-cols-3 px-4 py-4 text-sm rounded cursor-pointer select-none md:grid-cols-4"
                onClick={() => setExpand(!expand)}
            >
                <div className="flex items-center col-span-1">
                    <div className="mr-4">
                        <DoubleLogo
                            currency0={currency0}
                            currency1={currency1}
                            size={40}
                            margin={true}
                        />
                    </div>
                    {/* <div className="hidden sm:block">
                                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
                            </div> */}
                </div>
                <div className="flex-row items-center justify-start hidden ml-4 space-x-2 md:col-span-1 md:flex">
                    <div className="flex flex-col space-y-2 md:col-span-3">
                        <div className="flex flex-row items-center mr-4 space-x-2">
                            {farm?.rewards?.map((reward) => (
                                <div>
                                    <Image
                                        src={reward.icon}
                                        width="40px"
                                        height="40px"
                                        className="w-10 h-10 rounded"
                                        alt={reward.token}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col pl-2 space-y-1">
                        {farm?.rewards?.map((reward) => (
                            <div className="text-xs text-gray-500">
                                {formatNumber(reward.rewardPerDay)}{' '}
                                {reward.token} / day
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-end md:col-span-1">
                    <div>
                        {/* <div className="text-right">{formattedNum(farm.tvl, true)} </div> */}
                        <div className="text-sm font-semibold text-right text-gray-500 sm:text-sm">
                            {formatNumber(farm.slpBalance, false)} {farm.type}
                        </div>
                        <div className="text-xs text-right text-gray-500">
                            Market Staked
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end md:col-span-1">
                    <div>
                        <div className="text-base font-semibold text-right text-gray-500 sm:text-lg">
                            {farm?.roiPerYear > 100
                                ? '10000%+'
                                : formatPercent(farm?.roiPerYear * 100)}
                            {/* {formattedPercent(farm.roiPerMonth * 100)}{' '} */}
                        </div>
                        <div className="text-xs text-right text-gray-500">
                            annualized
                        </div>
                        {/* <div className="text-xs text-right text-gray-500">per month</div> */}
                    </div>
                </div>
            </div>
            {expand && (
                <FarmDropDown
                    pid={farm.pid}
                    type={farm.type}
                    pairAddress={farm.pairAddress}
                    pairSymbol={farm.symbol}
                    token0Address={farm.liquidityPair.token0.id}
                    token1Address={farm.liquidityPair.token1.id}
                    assetSymbol={farm.liquidityPair.token0.symbol}
                    assetDecimals={farm.liquidityPair.token1.decimals}
                />
            )}
        </Paper>
    )
}

export default FarmListItem
