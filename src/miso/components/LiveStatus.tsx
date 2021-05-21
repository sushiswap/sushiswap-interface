import React from 'react'
import styled from 'styled-components'

import { textCheck } from '../utils'

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
    userInfo?: any
}

export default function LiveStatus({ status, tokenInfo, marketInfo, userInfo }: LiveStatusProps) {
    return (
        <CardContainer className="bg-dark-900 rounded px-5 py-3">
            <div
                className="
          flex
          sm:flex-row flex-col
          justify-between
          mt-2
          project-status_text
        "
            >
                <div className="flex flex-col">
                    <span
                        className="
              text-xs
              mb-1
              uppercase
              font-bold
              text-center sm:text-left
            "
                    >
                        Amount For Sale:
                    </span>
                    <div className="flex justify-content-center justify-content-sm-start">
                        <p className="text-base text-white font-bold text-capitalize live">
                            {marketInfo.totalTokens} &nbsp;
                            <span className="text-sm">{textCheck(tokenInfo.symbol)}</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs mb-1 text-center uppercase font-bold">amount raised:</span>
                    <p className="text-base text-white font-bold text-center">
                        {2680} &nbsp;
                        {textCheck(marketInfo.paymentCurrency.symbol)}
                    </p>
                </div>
                <div className="flex flex-col">
                    <span
                        className="
              text-xs
              mb-1
              text-center uppercase
              font-bold
              text-center
            "
                    >
                        Remaining:
                    </span>
                    <p className="text-base text-white font-bold text-center">{100} &nbsp; %</p>
                </div>
                <div className="flex flex-col">
                    <span
                        className="
              text-xs
              mb-1
              sm:text-right text-center uppercase
              font-bold
            "
                    >
                        Participants:
                    </span>
                    <p className="text-base text-white font-bold sm:text-right text-center">20</p>
                </div>
            </div>
            <BaseDivider className="mt-2 py-2" />
        </CardContainer>
    )
}
