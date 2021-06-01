import React, { useState } from 'react'
import { formatNumber, formatPercent } from '../../functions/format'

import DoubleLogo from './DoubleLogo'
import InputGroup from './Details'
import Paper from '../../components/Paper'
import getTokenIconUrl from './getTokenUrl'

const KashiLending = ({ farm }: any) => {
    const [expand, setExpand] = useState<boolean>(false)
    return (
        <>
            {farm.type === 'KMP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 px-4 py-2 rounded rounded-b-none cursor-pointer select-none bg-dark-850 md:grid-cols-4"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="text-sm font-semibold sm:text-base">
                            {farm && farm.symbol}
                        </div>
                        <div className="hidden ml-4 text-sm text-gray-500 md:block sm:text-base">
                            {'SUSHI'}
                        </div>
                        <div className="text-sm text-right text-gray-500 sm:text-base">
                            {formatNumber(farm.tvl, true)}
                        </div>
                        <div className="text-sm font-semibold text-right sm:text-base">
                            {farm.roiPerYear > 100
                                ? '10000%+'
                                : formatPercent(farm.roiPerYear * 100)}
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-4 px-4 py-4 text-sm rounded cursor-pointer select-none"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={'kashiLogo'}
                                    a1={farm.liquidityPair.asset.id}
                                    size={40}
                                    margin={true}
                                    higherRadius={'0px'}
                                />
                            </div>
                            {/* <div className="hidden sm:block">{farm && farm.symbol}</div> */}
                        </div>
                        <div className="flex-row items-center justify-start hidden ml-4 space-x-2 md:col-span-1 md:flex">
                            <div>
                                <img
                                    src={getTokenIconUrl(
                                        '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
                                        1
                                    )}
                                    className="block w-10 h-10 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div className="flex flex-col pl-2 space-y-1">
                                <div className="text-xs text-gray-500">
                                    {formatNumber(farm.sushiRewardPerDay)} SUSHI
                                    / day
                                </div>
                                {/* <div className="text-xs text-gray-500">
                                    {formattedNum(farm.secondaryRewardPerDay)} MATIC / day
                                </div> */}
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <div>
                                <div className="text-right text-gray-500">
                                    {formatNumber(farm.tvl, true)}{' '}
                                </div>
                                <div className="text-right text-gray-500">
                                    {formatNumber(farm.totalAssetStaked, false)}{' '}
                                    KMP
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <div>
                                <div className="text-base font-semibold text-right text-gray-500 sm:text-lg">
                                    {farm.roiPerYear > 100
                                        ? '10000%+'
                                        : formatPercent(farm.roiPerYear * 100)}
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
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.collateral.id}
                            token1Address={farm.liquidityPair.asset.id}
                            type={'KMP'}
                            assetSymbol={farm.liquidityPair.asset.symbol}
                            assetDecimals={farm.liquidityPair.asset.decimals}
                        />
                    )}
                </Paper>
            )}
        </>
    )
}

export default KashiLending
