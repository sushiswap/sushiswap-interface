import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

function TradeSummary() {
    return (
        <>
            <AutoColumn style={{ padding: '0 16px' }} className="text-sm">
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary">Your Pool Tokens</div>
                    </RowFixed>
                    <RowFixed>
                        <div className="text-white">
                            1.576 →&nbsp;
                            <span className="text-green">1.787 ETH/SUSHI SLP</span>
                        </div>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary">Your Pool Share</div>
                    </RowFixed>
                    <RowFixed>
                        <div className="text-white">
                            &lt; 0.01% →&nbsp;
                            <span className="text-green">0.01%</span>
                        </div>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary">Liquidity Provider Fee</div>
                    </RowFixed>
                    <RowFixed>
                        <div className="text-white">0.00283 ETH</div>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary">Network Fee</div>
                    </RowFixed>
                    <RowFixed>
                        <div className="text-white">0.008654 ETH</div>
                    </RowFixed>
                </RowBetween>
            </AutoColumn>
        </>
    )
}

export interface AdvancedLiquidityDetailsProps {
    show?: Boolean
}

export function AdvancedLiquidityDetails() {
    return (
        <AutoColumn gap="0px">
            <TradeSummary />
        </AutoColumn>
    )
}
