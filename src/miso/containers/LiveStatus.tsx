import React, { useContext } from 'react'
import styled from 'styled-components'

import { MisoContext } from '../context'
import { textCheck, to18Decimals, toPrecision, divNumbers, subNumbers } from '../utils'

import { DutchProgress } from './Progress'

const CardContainer = styled.div``
const BaseDivider = styled.div`
    width: 100%;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    flex: 0 0 100%;
    max-width: 100%;
`

interface LiveStatusProps {
    status?: any
    tokenInfo?: any
    marketInfo?: any
    totalCommitments?: any
    totalTokensCommitted?: any
    userInfo?: any
    price?: any
}

export default function LiveStatus({
    status,
    tokenInfo,
    marketInfo,
    totalCommitments,
    totalTokensCommitted,
    userInfo,
    price
}: LiveStatusProps) {
    const { state } = useContext(MisoContext)

    const maxTokenAmount = () => {
        return toPrecision(Math.max(0, subNumbers(to18Decimals(marketInfo?.totalTokens), totalTokensCommitted)), 5)
    }
    const percentRemaining = () => {
        return parseFloat(toPrecision(divNumbers(maxTokenAmount(), to18Decimals(marketInfo?.totalTokens)) * 100, 5))
    }

    const dutchProgress = () => {
        try {
            const startPrice = marketInfo?.startPrice
            const minimumPrice = marketInfo?.minimumPrice
            const currentPrice = price

            const d1 = startPrice - minimumPrice
            const d2 = Math.max(0, currentPrice - minimumPrice)
            const progress = 100 - (100 * d2) / d1

            return progress
        } catch (e) {
            return 0
        }
    }

    return (
        <CardContainer className="bg-dark-900 rounded px-5 py-3">
            <div className="flex sm:flex-row flex-col justify-between mt-2 project-status_text">
                <div className="flex flex-col">
                    <span className="text-xs mb-1 uppercase font-bold text-center sm:text-left">Amount For Sale:</span>
                    <div className="flex justify-content-center justify-content-sm-start">
                        <p className="text-base text-white font-bold text-capitalize live">
                            {marketInfo?.totalTokens} &nbsp;
                            <span className="text-sm">{textCheck(tokenInfo?.symbol)}</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs mb-1 text-center uppercase font-bold">amount raised:</span>
                    <p className="text-base text-white font-bold text-center">
                        {totalCommitments} &nbsp;
                        {textCheck(marketInfo?.paymentCurrency?.symbol)}
                    </p>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs mb-1 text-center uppercase font-bold text-center">Remaining:</span>
                    <p className="text-base text-white font-bold text-center">{percentRemaining()} &nbsp; %</p>
                </div>
                <div className="flex flex-col">
                    <span className=" text-xs mb-1 sm:text-right text-center uppercase font-bold">Participants:</span>
                    <p className="text-base text-white font-bold sm:text-right text-center">
                        {state.commitments.totalParticipants}
                    </p>
                </div>
            </div>
            <BaseDivider className="mt-2 py-2" />
            {status.type === 'dutch' && (
                <DutchProgress
                    finalize={true}
                    progress={dutchProgress()}
                    userInfo={userInfo}
                    marketInfo={marketInfo}
                    price={price}
                />
            )}
        </CardContainer>
    )
}
