import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import { AboutCard } from '../../components'
import { LiveStatus } from '../../containers'
import { MisoContext } from '../../context'
import { useAuctionTemplateId, useAuctionData, useAuctionDocuments } from '../../hooks'
import { toPrecision, toDecimals, to18Decimals, clearingPrice } from '../../utils'

const AuctinDetailContainer = styled.div``

export default function AuctionDetail({
    match: {
        params: { auctionId }
    }
}: RouteComponentProps<{ auctionId: string }>) {
    const { i18n } = useLingui()
    const { state } = useContext(MisoContext)

    const marketTemplateId = useAuctionTemplateId(auctionId)
    const [type, tokenInfo, marketInfo, auctionSuccessful, date, auction] = useAuctionData(auctionId, marketTemplateId)
    const [website, icon, description, socialIcons] = useAuctionDocuments(auctionId)
    const [commitmentsTotal, setCommitmentsTotal] = useState<string>()
    const [totalTokensCommitted, setTotalTokensCommitted] = useState<string>()
    const [currentPrice, setCurrentPrice] = useState<string>()

    const updateDutchData = () => {
        if (marketInfo) {
            const info = {
                currentTimestamp: Date.now() / 1000,
                startTime: marketInfo.startTime,
                endTime: marketInfo.endTime,
                startPrice: to18Decimals(marketInfo.startPrice),
                minimumPrice: to18Decimals(marketInfo.minimumPrice),
                totalTokens: to18Decimals(marketInfo.totalTokens),
                commitmentsTotal: to18Decimals(commitmentsTotal)
            }
            const price = clearingPrice(info)
            const curPrice = toPrecision(toDecimals(price), 3)
            setCurrentPrice(curPrice)
            const tokensCommitted = parseFloat(info.commitmentsTotal) / parseFloat(curPrice)
            setTotalTokensCommitted(toPrecision(tokensCommitted, 3))
        }
    }
    useEffect(() => {
        if (type === 'dutch') {
            updateDutchData()
        }
    }, [commitmentsTotal, type, marketInfo])
    useEffect(() => {
        setCommitmentsTotal(toPrecision(toDecimals(state.commitments.commitmentsTotal), 3))
    }, [state.commitments.commitmentsTotal])
    useEffect(() => {
        if (marketInfo?.commitmentsTotal) {
            setCommitmentsTotal(marketInfo?.commitmentsTotal)
        }
    }, [marketInfo?.commitmentsTotal])

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Miso`)} | Sushi</title>
            </Helmet>
            <AuctinDetailContainer className="grid grid-cols-1 lg:grid-cols-2 gap-7 w-full">
                <AboutCard
                    auctionId={auctionId}
                    info={{
                        icon: icon,
                        title: `${tokenInfo?.name} (${tokenInfo?.symbol})`,
                        tokenPair: `${marketInfo?.paymentCurrency?.symbol}/${tokenInfo?.symbol}`,
                        website: website,
                        icons: {
                            social: socialIcons
                        },
                        description: description
                    }}
                    status={{
                        auction: auction,
                        date: date,
                        type: type,
                        auctionSuccessful: auctionSuccessful
                    }}
                    price={currentPrice}
                />
                <LiveStatus
                    marketInfo={marketInfo}
                    tokenInfo={tokenInfo}
                    totalCommitments={commitmentsTotal}
                    totalTokensCommitted={totalTokensCommitted}
                    status={{
                        auction: auction,
                        date: date,
                        type: type,
                        auctionSuccessful: auctionSuccessful
                    }}
                    price={currentPrice}
                />
            </AuctinDetailContainer>
        </>
    )
}
