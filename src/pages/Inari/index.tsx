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
import WithdrawalPanel from './WithdrawalPanel'
import { Helmet } from 'react-helmet'

export default function Inari() {
    const theme = useContext(ThemeContext)
    const darkMode = useDarkModeManager()

    return (
        <>
            <Helmet>
                <title>Inari | Sushi</title>
                <meta name="description" content="Migrate SUSHI -> xSUSHI -> BENTO" />
            </Helmet>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl w-full">
                <AppBody>
                    <InariHeader label={'SUSHI → xSUSHI → BENTO'} />
                    <Wrapper id="swap-page">
                        <AutoColumn>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomNone={true}
                                functionText={'SUSHI → xSUSHI → BENTO'}
                            />
                            <WithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                                tokenName={'BENTO'}
                                tokenBalanceText={'0xF5BCE5077908a1b7370B9ae04AdC565EBd643966'}
                                functionText={'SUSHI → xSUSHI → BENTO'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>

                <AppBody>
                    <InariHeader label={'SUSHI → xSUSHI → AAVE'} />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomNone={true}
                                functionText={'SUSHI → xSUSHI → AAVE'}
                            />
                            <WithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                                tokenName={'aXSUSHI'}
                                tokenBalanceText={'0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a'}
                                functionText={'SUSHI → xSUSHI → AAVE'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>

                <AppBody>
                    <InariHeader label={'SUSHI → xSUSHI → CREAM -> BENTO'} />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomNone={true}
                                functionText={'SUSHI → xSUSHI → CREAM -> BENTO'}
                            />
                            <WithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                                tokenName={'BENTO'}
                                tokenBalanceText={'0xF5BCE5077908a1b7370B9ae04AdC565EBd643966'}
                                functionText={'SUSHI → xSUSHI → CREAM -> BENTO'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>

                <AppBody>
                    <InariHeader label={'SUSHI → xSUSHI → CREAM'} />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomNone={true}
                                functionText={'SUSHI → xSUSHI → CREAM'}
                            />
                            <WithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                                tokenName={'crXSUSHI'}
                                tokenBalanceText={'0x228619cca194fbe3ebeb2f835ec1ea5080dafbb2'}
                                functionText={'SUSHI → xSUSHI → CREAM'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </AppBody>
            </div>
        </>
    )
}
