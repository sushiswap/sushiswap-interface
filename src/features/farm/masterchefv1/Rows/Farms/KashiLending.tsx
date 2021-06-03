import React, { useState } from 'react'
import { formattedNum, formattedPercent } from '../../../../../utils'
import { DoubleLogo, Paper } from '../../../components'
import InputGroup from '../../Details'
import { getTokenIconUrl } from '../../../../../kashi/functions'

const KashiLending = ({ farm }: any) => {
    const [expand, setExpand] = useState<boolean>(false)
    return (
        <>
            {farm.type === 'KMP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="bg-dark-850 grid grid-cols-3 md:grid-cols-4 px-4 py-2  cursor-pointer select-none rounded rounded-b-none"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="text-sm sm:text-base font-semibold">{farm && farm.symbol}</div>
                        <div className="hidden md:block text-sm sm:text-base ml-4 text-gray-500">{'SUSHI'}</div>
                        <div className="text-gray-500 text-sm sm:text-base text-right">
                            {formattedNum(farm.tvl, true)}
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-right">
                            {farm.roiPerYear > 100 ? '10000%+' : formattedPercent(farm.roiPerYear * 100)}
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-4 py-4 px-4 cursor-pointer select-none rounded text-sm"
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
                        <div className="md:col-span-1 hidden md:flex flex-row space-x-2 justify-start items-center ml-4">
                            <div>
                                <img
                                    src={getTokenIconUrl('0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', 1)}
                                    className="block w-10 h-10 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div className="flex flex-col pl-2 space-y-1">
                                <div className="text-gray-500 text-xs">
                                    {formattedNum(farm.sushiRewardPerDay)} SUSHI / day
                                </div>
                                {/* <div className="text-gray-500 text-xs">
                                    {formattedNum(farm.secondaryRewardPerDay)} MATIC / day
                                </div> */}
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-gray-500 text-right">{formattedNum(farm.tvl, true)} </div>
                                <div className="text-gray-500 text-right">
                                    {formattedNum(farm.totalAssetStaked, false)} KMP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-gray-500 text-right font-semibold text-base sm:text-lg">
                                    {farm.roiPerYear > 100 ? '10000%+' : formattedPercent(farm.roiPerYear * 100)}
                                    {/* {formattedPercent(farm.roiPerMonth * 100)}{' '} */}
                                </div>
                                <div className="text-gray-500 text-right text-xs">annualized</div>
                                {/* <div className="text-gray-500 text-right text-xs">per month</div> */}
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
