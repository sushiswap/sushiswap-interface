import { Trade, TradeType } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import { ExternalLink } from '../Link'

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
    trade?: Trade
    show?: Boolean
}

export function AdvancedLiquidityDetails({ trade }: AdvancedLiquidityDetailsProps) {
    const theme = useContext(ThemeContext)

    const [allowedSlippage] = useUserSlippageTolerance()

    const showRoute = Boolean(trade && trade.route.path.length > 2)

    return (
        <AutoColumn gap="0px">
            {
                <>
                    <TradeSummary />
                </>
            }
        </AutoColumn>
    )
}
