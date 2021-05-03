import { transparentize } from 'polished'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { Wrapper } from '../../components/swap/styleds'
//import { WrapperNoPadding } from '../../components/swap/styleds'
import { useDarkModeManager } from '../../state/user/hooks'
import { ExternalLink, TYPE } from '../../theme'
import AppBody from '../AppBody'
import InariHeader from './InariHeader'
import SushiInputPanel from './SushiInputPanel'
import { Helmet } from 'react-helmet'

const PageWrapper = styled(AutoColumn)`
    max-width: 420px;
    width: 100%;
`

export default function Inari() {
    const theme = useContext(ThemeContext)
    const darkMode = useDarkModeManager()

    return (
        <>
            <Helmet>
                <title>Inari | Sushi</title>
                <meta name="description" content="Migrate SUSHI -> xSUSHI -> BENTO" />
            </Helmet>
            <PageWrapper>
                <AppBody>
                    <InariHeader
                        label={'SUSHI → xSUSHI → BENTO'}
                    />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomTop={true}
                                functionText={'SUSHI → xSUSHI → BENTO'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>

                <AppBody style={{ marginTop: '20px' }}>
                    <InariHeader
                        label={'SUSHI → xSUSHI → AAVE'}
                    />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomTop={true}
                                functionText={'SUSHI → xSUSHI → AAVE'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>

                <AppBody style={{ marginTop: '20px' }}>
                    <InariHeader
                        label={'SUSHI → xSUSHI → CREAM -> BENTO'}
                    />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomTop={true}
                                functionText={'SUSHI → xSUSHI → CREAM -> BENTO'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>

                <AppBody style={{ marginTop: '20px' }}>
                    <InariHeader
                        label={'SUSHI → xSUSHI → CREAM'}
                    />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomTop={true}
                                functionText={'SUSHI → xSUSHI → CREAM'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>
            </PageWrapper>
        </>
    )
}
