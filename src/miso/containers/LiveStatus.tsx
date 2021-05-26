import React, { useContext, useEffect, useState } from 'react'
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

    const [finalize, setFinalize] = useState({
        author: false,
        user: false
    })
    const [upcomingVideo, setUpcomingVideo] = useState(true)

    const maxTokenAmount = () => {
        return toPrecision(Math.max(0, subNumbers(to18Decimals(marketInfo?.totalTokens), totalTokensCommitted)), 5)
    }
    const percentRemaining = () => {
        return parseFloat(toPrecision(divNumbers(maxTokenAmount(), to18Decimals(marketInfo?.totalTokens)) * 100, 5))
    }
    const isUpcoming = () => {
        const currentTimestamp = Date.now() / 1000
        return marketInfo?.startTime > currentTimestamp
    }

    const SECONDS = 1000
    const MINUTES = SECONDS * 60
    const HOURS = MINUTES * 60
    const DAYS = HOURS * 24

    const [displayDays, setDisplayDays] = useState<string | number>()
    const [displayHours, setDisplayHours] = useState<string | number>()
    const [displayMinutes, setDisplayMinutes] = useState<string | number>()
    const [displaySeconds, setDisplaySeconds] = useState<string | number>()
    const getFullTime = () => {
        return `${displayDays}d : ${displayHours}h : ${displayMinutes}m : ${displaySeconds}s`
    }
    // Show CountDown
    useEffect(() => {
        if (status.auction === 'finished') return
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const countDownDate = new Date(status.date).getTime()
            const distance = countDownDate - now
            if (distance < 0) {
                clearInterval(timer)
                return
            }

            const days = Math.floor(distance / DAYS)
            const hours = Math.floor((distance % DAYS) / HOURS)
            const minutes = Math.floor((distance % HOURS) / MINUTES)
            const seconds = Math.floor((distance % MINUTES) / SECONDS)

            // Update display days, hours, minutes and seconds
            setDisplaySeconds(seconds < 10 ? '0' + seconds : seconds)
            setDisplayMinutes(minutes < 10 ? '0' + minutes : minutes)
            setDisplayHours(hours < 10 ? '0' + hours : hours)
            setDisplayDays(days < 10 ? '0' + days : days)
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [status.date])
    const getStatus = () => {
        if (displayDays === '00' && displayHours === '00' && displayMinutes === '00' && displaySeconds === '00') {
            return false
        }
        return true
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
            {!isUpcoming() && status?.auction !== 'finished' && !marketInfo?.finalized ? (
                <>
                    {status.type === 'dutch' && (
                        <DutchProgress
                            finalize={finalize.user}
                            progress={dutchProgress()}
                            userInfo={userInfo}
                            marketInfo={marketInfo}
                            price={price}
                        />
                    )}
                </>
            ) : !isUpcoming() || marketInfo?.finalized ? (
                <div className="flex">
                    {status?.auctionSuccessful && (
                        <div className="finalized-box">
                            <video
                                className="finalized-video"
                                autoPlay
                                poster={`${process.env.PUBLIC_URL}/miso/video/covers/light_mode_bg.jpg`}
                            >
                                <source
                                    src={`${process.env.PUBLIC_URL}/miso/video/light_mode.webm`}
                                    type="video/webm"
                                />
                                <source src={`${process.env.PUBLIC_URL}/miso/video/light_mode.mp4`} type="video/mp4" />
                            </video>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col flex-grow my-5 py-4 upcoming-counter">
                    {upcomingVideo ? (
                        <div className="flex">
                            <video
                                className="finalized-video"
                                autoPlay
                                poster={`${process.env.PUBLIC_URL}/miso/video/covers/light_mode-upcoming.jpg`}
                                onEnded={() => setUpcomingVideo(false)}
                            >
                                <source
                                    src={`${process.env.PUBLIC_URL}/miso/video/light_mode_upcoming.webm`}
                                    type="video/webm"
                                />
                                <source
                                    src={`${process.env.PUBLIC_URL}/miso/video/light_mode_upcoming.mp4`}
                                    type="video/mp4"
                                />
                            </video>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="text-white text-center">COUNTDOWN</div>
                            <div className="text-white font-bold text-center text-4xl">
                                <span className="counter-line">{getFullTime()}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {getStatus() && status?.auction !== 'upcoming' && <BaseDivider className="mb-5 pb-2" />}
        </CardContainer>
    )
}
