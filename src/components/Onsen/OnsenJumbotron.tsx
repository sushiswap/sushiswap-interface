import LeaderboardCard from './LeaderboardCard'
import { ONSEN_VIEWS } from '../../constants/onsen'
import React from 'react'
import { formattedNum } from '../../utils'

export default function OnsenJumbotron({ onsenView }: any) {
    const onsenTotalDeposits = '123,234,678,123'
    const userTotalAssets = 35678
    const userTotalStaked = 34458.33
    const userTotalRewards = 1219.67
    const farmsCount = 4
    return (
        <div>
            <div className="flex flex-row justify-between">
                <div className="py-6">
                    {onsenView === ONSEN_VIEWS.ALL_POOLS && (
                        <>
                            <div className="font-bold text-h1 text-high-emphesis mb-4">Yield Farming with ONSEN</div>

                            <div>
                                <div className="inline text-cyan-blue font-bold text-h1">${onsenTotalDeposits} </div>
                                <div className="inline text-body">is currently desposited in Onsen</div>
                            </div>
                        </>
                    )}
                    {onsenView === ONSEN_VIEWS.USER_POOLS && (
                        <>
                            <div className="font-bold text-h3 text-high-emphesis">My Positions</div>
                            <div className="pt-6">
                                <div>
                                    <div className="inline text-body">You have </div>
                                    <div className="inline text-h4 text-cyan-blue font-bold">
                                        {formattedNum(userTotalAssets, true)}{' '}
                                    </div>
                                    <div className="inline text-body">total assets in the ONSEN:</div>
                                </div>
                                <div>
                                    <div className="inline text-h4 text-blue font-bold">
                                        {formattedNum(userTotalStaked, true)}{' '}
                                    </div>
                                    <div className="inline text-body">assets staked and </div>
                                    <div className="inline text-h4 text-pink font-bold">
                                        {formattedNum(userTotalRewards, true)}{' '}
                                    </div>
                                    <div className="inline text-body">rewards earned.</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <LeaderboardCard className="hidden md:flex" />
            </div>

            <div className="text-h5 text-high-emphesis py-4">Explore {farmsCount} Farms (and counting).</div>
        </div>
    )
}
