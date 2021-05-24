import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { DuplicateIcon } from '@heroicons/react/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faBook } from '@fortawesome/free-solid-svg-icons'
import {
    faGithub,
    faTelegram,
    faWeixin,
    faDiscord,
    faMedium,
    faReddit,
    faTwitter
} from '@fortawesome/free-brands-svg-icons'

import Logo from 'assets/miso/token_placeholder.png'
import BatchIcon from 'assets/miso/batch.svg'
import DutchIcon from 'assets/miso/dutch.svg'
import CrowdSaleIcon from 'assets/miso/crowdsale.svg'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { truncate } from '../utils'

const CardContainer = styled.div``
const TokenImage = styled.div`
    height: 45px;
    width: 45px;
    @media screen and (min-width: 1200px) and (max-width: 1300px) {
        width: 40px;
    }
`
const StatusIndicator = styled.span<{ status: any }>`
    height: 8px;
    width: 8px;
    display: block;
    background-color: ${({ status }) =>
        status.auction === 'live'
            ? '#95ce22'
            : status.auction === 'upcoming'
            ? '#22c8ce'
            : status.auction === 'finished' && status.auctionSuccessful
            ? '#1d5ddc'
            : '#cc0044'} !important;
`
const Duration = styled.div`
    min-height: 50px;
    min-width: 152px;
    .bg-primary {
        height: 100%;
        padding: 4px 14px;
        background-color: #f46e41 !important;
        .abbr {
            font-size: 11px;
        }
    }
`
const BaseDivider = styled.div`
    width: 100%;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    flex: 0 0 100%;
    max-width: 100%;
`
const CopyBox = styled.div`
    padding: 4px 6px;
    position: relative;
    span {
        z-index: 2;
        opacity: 0;
        transition: all 0.3s ease-in;
    }
    svg {
        position: relative;
        z-index: 2;
    }
    .copy-box_icon::after {
        position: absolute;
        border-radius: 2px;
        content: '';
        transition: all 0.3s ease-in;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: transparent;
    }
    .copy-box_icon:hover {
        & ~ span {
            opacity: 1;
            transition: all 0.3s ease-in;
        }
        &:after {
            content: '';
            opacity: 1;
            background: #202231;
            transition: all 0.3s ease-in;
        }
    }
`
const SocialIcon = styled.a`
    min-width: 140px;
    margin-bottom: 1rem;
    span {
        text-decoration: underline;
    }
`

interface AboutCardProps {
    auctionId: string
    user?: any
    status?: any
    info?: any
    price?: string | number
    type?: string
}

export default function AboutCard({ auctionId, user, status, info, price }: AboutCardProps) {
    const [isCopied, setCopied] = useCopyClipboard()

    const icons: any = {
        whitepaper: faFile,
        github: faGithub,
        telegram: faTelegram,
        wechat: faWeixin,
        discord: faDiscord,
        medium: faMedium,
        reddit: faReddit,
        twitter: faTwitter,
        docs: faBook
    }
    const auctionIcons: any = {
        dutch: DutchIcon,
        batch: BatchIcon,
        crowdsale: CrowdSaleIcon
    }

    const SECONDS = 1000
    const MINUTES = SECONDS * 60
    const HOURS = MINUTES * 60
    const DAYS = HOURS * 24

    const [displayDays, setDisplayDays] = useState<string | number>()
    const [displayHours, setDisplayHours] = useState<string | number>()
    const [displayMinutes, setDisplayMinutes] = useState<string | number>()
    const [displaySeconds, setDisplaySeconds] = useState<string | number>()

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

    return (
        <CardContainer className="bg-dark-900 rounded px-5 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex items-center">
                    <TokenImage className="mr-2">
                        <img src={info.icon || Logo} className="img-fluid" />
                    </TokenImage>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <h4 className="card-title font-bold capitalize text-xl text-white mb-1">{info.title}</h4>
                            {status.auction !== 'upcoming' && status.auction !== 'finished' && (
                                <span className="text-sm font-bold capitalize text-white flex items-center pl-2">
                                    <StatusIndicator className="rounded-full mr-2" status={status}></StatusIndicator>
                                    {status.auction}
                                </span>
                            )}
                        </div>
                        <p className="font-bold uppercase text-sm">
                            Token Price:
                            <span className="text-white mx-1">{price}</span>
                            {info.tokenPair}
                        </p>
                    </div>
                    <div>
                        {(status.auction === 'upcoming' || status.auction === 'finished') && (
                            <span className="text-sm font-bold capitalize text-white flex items-center pl-2">
                                <StatusIndicator className="rounded-full mr-2" status={status}></StatusIndicator>
                                {status.auction}
                            </span>
                        )}
                    </div>
                </div>
                {status.auction !== 'upcoming' && status.auction !== 'finished' && (
                    <Duration className="sm:mt-0 mt-3">
                        <div className="bg-primary rounded-md">
                            <div className="flex justify-around text-white">
                                <div className="flex flex-col items-center uppercase">
                                    <span className="text-sm font-bold">{displayDays}</span>
                                    <span className="abbr">days</span>
                                </div>
                                &nbsp;:&nbsp;
                                <div className="flex flex-col items-center uppercase">
                                    <span className="text-sm font-bold">{displayHours}</span>
                                    <span className="abbr">hrs</span>
                                </div>
                                &nbsp;:&nbsp;
                                <div className="flex flex-col items-center uppercase">
                                    <span className="text-sm font-bold">{displayMinutes}</span>
                                    <span className="abbr">min</span>
                                </div>
                                &nbsp;:&nbsp;
                                <div className="flex flex-col items-center uppercase">
                                    <span className="text-sm font-bold">{displaySeconds}</span>
                                    <span className="abbr">Sec</span>
                                </div>
                            </div>
                        </div>
                    </Duration>
                )}
            </div>
            <BaseDivider className="mb-4 mt-2 py-1" />
            <div className="pt-2">
                <div className="pt-3 mt-1 pr-5">
                    <h5 className="text-xs font-bold uppercase mb-0">CONTRACT:</h5>
                    <div className="flex items-center">
                        <p className="font-bold text-white uppercase mb-0">{truncate(auctionId, 6)}</p>
                        <CopyBox className="flex items-center ml-2">
                            <div className="copy-box_icon">
                                <DuplicateIcon
                                    className="cursor-pointer"
                                    height="20"
                                    width="20"
                                    color="#F46E41"
                                    onClick={() => setCopied(auctionId)}
                                />
                            </div>
                            <span className="font-bold text-white text-sm pl-1">copy</span>
                        </CopyBox>
                    </div>
                </div>
                <div className="pt-3">
                    <h5 className="text-xs font-bold mb-2 uppercase">Website:</h5>
                    <a
                        href="https://sake.sushi.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-white pt-0 mt-0"
                    >
                        <u>{'https://sake.sushi.com/'}</u>
                    </a>
                </div>
                {Object.keys(info.icons.social).length > 0 && (
                    <div className="pt-3">
                        <div className="flex justify-between flex-wrap">
                            <div className="flex flex-col mb-3">
                                <h5 className="text-xs font-bold uppercase mb-2">About:</h5>
                                <div className="flex flex-wrap">
                                    {Object.keys(info.icons.social).map((index: string) => (
                                        <SocialIcon
                                            href={info.icons.social[index]}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="pr-4 font-bold capitalize"
                                            key={index}
                                        >
                                            <FontAwesomeIcon icon={icons[index]} size="lg" className="mr-1" />
                                            <span>{index}</span>
                                        </SocialIcon>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {info.description && (
                    <div className="pt-4 pr-5">
                        <h5 className="text-xs mb-1 font-bold uppercase">Description:</h5>
                        <p className="text-sm">{info.description}</p>
                    </div>
                )}
                {!info.description && <BaseDivider className="my-4 py-2" />}
                <div className="pt-4 pr-5">
                    <h5 className="text-xs font-bold uppercase mb-4">Auction Type:</h5>
                    <div className="flex items-center">
                        <span className="mr-3">
                            <img
                                src={status.type && auctionIcons[status.type]}
                                width={45}
                                height={45}
                                className="mr-2 cursor-pointer"
                            />
                        </span>
                        <span className="capitalize font-bold text-white">{status.type}</span>
                    </div>
                </div>
            </div>
        </CardContainer>
    )
}
