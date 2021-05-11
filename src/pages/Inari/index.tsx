import { transparentize } from 'polished'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { Wrapper } from '../../components/swap/styleds'
//import { WrapperNoPadding } from '../../components/swap/styleds'
import { useDarkModeManager } from '../../state/user/hooks'
import { ExternalLink, TYPE } from '../../theme'
import InariHeader from './InariHeader'
import SushiInputPanel from './SushiInputPanel'
import BentoWithdrawalPanel from './BentoWithdrawalPanel'
import AxsushiWithdrawalPanel from './AxsushiWithdrawalPanel'
import CrXSushiWithdrawalPanel from './crXSushiWithdrawalPanel'
import { Helmet } from 'react-helmet'

export default function Inari() {
    const theme = useContext(ThemeContext)
    const darkMode = useDarkModeManager()

    return (
        <>
            <Helmet>
                <title>Inari | Sushi</title>
                <meta name="description" content="Migrate SUSHI → xSUSHI → BENTO" />
            </Helmet>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl w-full">
                <div className="relative w-full max-w-lg rounded bg-dark-900">
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
                            <BentoWithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                                tokenSymbol={'xSUSHI'}
                                tokenAddress={'0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272'}
                                functionText={'SUSHI → xSUSHI → BENTO'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </div>

                <div className="relative w-full max-w-lg rounded bg-dark-900">
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
                            <AxsushiWithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                            />
                        </AutoColumn>
                    </Wrapper>
                </div>

                <div className="relative w-full max-w-lg rounded bg-dark-900">
                    <InariHeader label={'SUSHI → xSUSHI → CREAM → BENTO'} />
                    <Wrapper id="swap-page">
                        <AutoColumn style={{ paddingBottom: '10px' }}>
                            <SushiInputPanel
                                label={''}
                                disableCurrencySelect={true}
                                id="stake-liquidity-token"
                                buttonText="Deposit"
                                cornerRadiusBottomNone={true}
                                functionText={'SUSHI → xSUSHI → CREAM → BENTO'}
                            />
                            <BentoWithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                                tokenSymbol={'crXSUSHI'}
                                tokenAddress={'0x228619cca194fbe3ebeb2f835ec1ea5080dafbb2'}
                                functionText={'SUSHI → xSUSHI → CREAM → BENTO'}
                            />
                        </AutoColumn>
                    </Wrapper>
                </div>

                <div className="relative w-full max-w-lg rounded bg-dark-900">
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
                            <CrXSushiWithdrawalPanel
                                label={''}
                                disableCurrencySelect={true}
                                customBalanceText={'Available to withdraw: '}
                                id="withdraw-liquidity-token"
                                buttonText="Withdraw"
                                cornerRadiusTopNone={true}
                            />
                        </AutoColumn>
                    </Wrapper>
                </div>
            </div>
        </>
    )
}
