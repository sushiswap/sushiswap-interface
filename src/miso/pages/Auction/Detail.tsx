import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import { AboutCard, LiveStatus } from '../../components'

const AuctinDetailContainer = styled.div``

export default function AuctionDetail({
    match: {
        params: { auctionID }
    }
}: RouteComponentProps<{ auctionID: string }>) {
    const { i18n } = useLingui()

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Miso`)} | Sushi</title>
            </Helmet>
            <AuctinDetailContainer className="grid grid-cols-1 lg:grid-cols-2 gap-7 w-full">
                <AboutCard
                    auctionID={auctionID}
                    info={{
                        icon: null,
                        title: 'Sake (SAK3)',
                        tokenPair: 'SUSHI/SAK3',
                        website: 'https://sake.sushi.com',
                        icons: {
                            social: {
                                twitter: 'https://twitter.com/0xSAKE',
                                discord: 'https://discord.gg/MYFm8nn4QB'
                            }
                        },
                        description:
                            'SAKE is the worlds first tokenized sake and the debut product of MISO launchpad. Only 888 bottles of SAKE will ever be produced, with ownership of a SAKE bottle dictated by the SAK3 token.'
                    }}
                    status={{
                        auction: 'live'
                    }}
                    type="dutch"
                />
                <LiveStatus
                    marketInfo={{
                        totalTokens: 200,
                        paymentCurrency: {
                            symbol: 'SUSHI'
                        }
                    }}
                    tokenInfo={{
                        symbol: 'SAK3'
                    }}
                />
            </AuctinDetailContainer>
        </>
    )
}
