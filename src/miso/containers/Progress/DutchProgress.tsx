import React from 'react'
import styled from 'styled-components'

import { MouseoverTooltip } from '../../../components/Tooltip'

const ProgressStatus = styled.div`
    min-height: 234px;
    border-left: 1px solid;
    border-right: 1px solid;
    position: relative;
    .text {
        font-size: 11px;
        @media screen and (max-width: 450px) {
            font-size: 10px;
        }
    }
    .bg-light {
        background: rgba(255, 255, 255, 0.2) !important;
    }
    .finalize-box {
        left: -5px;
        top: -15%;
        height: 130%;
        width: 102%;
    }
    &.border-light {
        border-color: rgba(255, 255, 255, 0.1);
    }
    .bg-success {
        background-color: #95ce22 !important;
    }
`
const ProgressStatus_StartPrice = styled.span`
  left: 0;
  top: 0;
  margin-top: -6px;
  margin-left: 4px;
  @media screen and (max-width: 500px) {
  margin-top: -2px;
  span {
    &:first-child {
    font-size: 10px !important;
    }
    font-size: 12px !important;
  }
  }
}`
const ProgressStatus_ReservePrice = styled.span`
    right: 0;
    top: 0;
    margin-top: -6px;
    margin-right: 4px;
    text-align: right;
    @media screen and (max-width: 500px) {
        margin-top: -2px;
        span {
            &:first-child {
                font-size: 10px !important;
            }
            font-size: 12px !important;
        }
    }
`
const ProgressStatus_StartAuction = styled.span`
    transform: translateY(100%);
    @media screen and (max-width: 500px) {
        span {
            font-size: 10px !important;
        }
    }
`
const ProgressStatus_EndAuction = styled.span`
    transform: translateY(100%);
    @media screen and (max-width: 500px) {
        span {
            font-size: 10px !important;
        }
    }
`
const ProgressStatus_Current = styled.span`
    top: 0;
    left: 4px;
    height: 100%;
    .text-top {
        top: -6px;
    }
    .text-bottom {
        bottom: 12px;
    }
    span {
        white-space: nowrap;
        @media screen and (max-width: 500px) {
            font-size: 12px !important;
        }
    }
    @media screen and (max-width: 500px) {
        .text-bottom span {
            &:first-child {
                font-size: 10px !important;
            }
            font-size: 12px !important;
        }
    }
    &.right-top {
        transform: translateX(-100%);
        text-align: left;
        height: 100%;
        .line {
            right: 0;
        }
        .text {
            right: 0;
        }
    }
    &.left-top {
        transform: translateX(-100%);
        text-align: right;
        height: 100%;
        span.text-top {
            transform: translate(-107%, 4%);
        }
        .line {
            right: 0;
        }
        .text {
            right: 0;
        }
    }
    &.bottom-right {
        left: 9px !important;
    }
`
const ProgressStatus_Line = styled.span`
    height: 4px;
    border-radius: 4px;
    background: hsla(142, 19%, 23%, 0.741);
    top: 50%;
    left: 0;
    right: 0;
    width: 103.3%;
    transform: translateX(-1.6%) rotate(9deg);

    .fill {
        display: inline-block;
        height: 4px;
        border-radius: 4px;
    }
    .text-box {
        position: absolute;
        height: 75px;
        top: 0;
        transform: translateY(-85%) rotate(-9deg);
        &.down {
            transform: translate(5px, 10px) rotate(-9deg);
        }
        .line {
            position: absolute;
            top: 0;
            height: 78%;
            width: 2px;
        }
    }
    &.dutch {
        // transform: rotate(20deg);
    }
`
const ProgressStatus_Line_LeftDot = styled.span`
    position: absolute;
    content: '';
    z-index: 50;
    left: 0;
    top: 50%;
    border: 2px solid rgb(0, 10, 53);
    height: 15px;
    width: 15px;
    display: block;
    transform: translateY(-50%);
    border-radius: 100%;
`
const ProgressStatus_Line_RightDot = styled.span`
    position: absolute;
    content: '';
    z-index: 50;
    right: 0;
    top: 50%;
    border: 2px solid rgb(0, 10, 53);
    height: 15px;
    width: 15px;
    display: block;
    transform: translateY(-50%);
    border-radius: 100%;
`
const DutchBottom = styled.span`
    position: absolute;
    bottom: 0;
    height: 10px;
    transform: translateY(50%);
`
const DutchBottomLine = styled.span`
    width: calc(100% / 4);
    &:not(:last-child)::after {
        content: '';
        height: 100%;
        display: block;
        right: 0;
        position: absolute;
        border-right: 1px solid;
    }

    &::before {
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid;
        display: block;
        top: 50%;
        position: absolute;
        transform: translateY(-50%);
    }
`

export default function DutchProgress({ finalize, userInfo, marketInfo, progress, price }: any) {
    const isClaimed = () => {
        const claimed = parseFloat(userInfo?.claimed)
        const tokensClaimable = parseFloat(userInfo?.tokensClaimable)
        return claimed > 0 && tokensClaimable === 0
    }
    const computedProgress = () => {
        {
            /*if (progress > 99 && $route.name.includes('auctions-address')) {
      if ($route.name.includes('auctions-address')) {
        return progress - 2.1
      }
    } else */
        }
        if (progress > 99) {
            return progress - 3.2
        }

        return progress - 1
    }
    return (
        <ProgressStatus className={`flex my-10 ${finalize ? 'border-light' : ''}`}>
            <div
                className="flex w-full relative"
                style={{
                    opacity: isClaimed() ? 0.1 : ''
                }}
            >
                <ProgressStatus_StartPrice className="absolute flex flex-col">
                    <MouseoverTooltip
                        text="A Dutch auction starts high and ends low. Everyone pays the same final price."
                        placement="top-end"
                    >
                        <span className="font-bold text-xs uppercase">starting price</span>
                    </MouseoverTooltip>
                    <span className="font-bold text-white uppercase">
                        {marketInfo?.startPrice} {marketInfo?.paymentCurrency?.symbol}
                    </span>
                </ProgressStatus_StartPrice>

                <ProgressStatus_ReservePrice className="absolute flex flex-col">
                    <MouseoverTooltip
                        text="The auction will end when price drops to the reserve price, if not already sold out"
                        placement="top-end"
                    >
                        <span className="font-bold text-xs uppercase">RESERVE PRICE</span>
                    </MouseoverTooltip>
                    <span className="font-bold text-white uppercase">
                        {marketInfo?.minimumPrice} {marketInfo?.paymentCurrency?.symbol}
                    </span>
                </ProgressStatus_ReservePrice>

                <ProgressStatus_StartAuction className="absolute bottom-0 left-0 flex flex-col">
                    <span className="font-bold pt-1 text-xs uppercase">AUCTION START</span>
                </ProgressStatus_StartAuction>

                <ProgressStatus_EndAuction className="absolute bottom-0 right-0 flex flex-col">
                    <span className="font-bold pt-1 text-xs uppercase">AUCTION END</span>
                </ProgressStatus_EndAuction>

                <ProgressStatus_Line className="inline-block absolute dutch">
                    <span
                        className="fill absolute bg-success"
                        style={{
                            width: progress + '%'
                        }}
                    />
                    <ProgressStatus_Line_LeftDot className="bg-success" />
                    <ProgressStatus_Line_RightDot className="bg-success" />
                    {progress > 0 && (
                        <span
                            className={`text-box flex items-end ${progress < 28 ? 'down' : ''}`}
                            style={{ left: computedProgress() + '%' }}
                        >
                            <ProgressStatus_Current
                                className={`flex flex-col absolute
                  ${progress > 75 ? 'left-top' : 'right-top'}
                  ${progress < 28 ? 'bottom-right' : ''}
                `}
                            >
                                {progress <= 75 && <span className="line bg-light" />}

                                <span
                                    className={`flex flex-col absolute
                    ${progress > 75 ? 'mr-2' : 'ml-2'}
                    ${progress > 28 ? 'text-top' : 'text-bottom'}
                  `}
                                >
                                    <MouseoverTooltip
                                        text="This is the current auction price. The auction ends successfully when the token price (total commitments/tokens) reaches this price"
                                        placement="top-end"
                                    >
                                        <span className="font-bold text-xs">AUCTION PRICE</span>
                                    </MouseoverTooltip>
                                    <span className="font-bold text-white">
                                        {price} {marketInfo?.paymentCurrency.symbol}
                                    </span>
                                </span>
                                {progress > 75 && <span className="line bg-light" />}
                            </ProgressStatus_Current>
                        </span>
                    )}
                </ProgressStatus_Line>

                <DutchBottom className="w-full flex">
                    {[0, 1, 2, 3, 4].map(item => (
                        <DutchBottomLine key={item} className="relative"></DutchBottomLine>
                    ))}
                </DutchBottom>
            </div>
            {isClaimed() && (
                <div className="absolute finalize-box flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="text-xl text-white font-bold">Your tokens have been</div>
                        <div className="text-3xl text-white font-bold">CLAIMED</div>
                    </div>
                </div>
            )}
        </ProgressStatus>
    )
}
