import { AddressZero } from '@ethersproject/constants'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { ChainId, JSBI } from '@sushiswap/sdk'
import { useSushiRollContract } from 'hooks/useContract'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import Circle from '../../assets/images/blue-loader.svg'
import { ButtonConfirmed } from '../../components/ButtonLegacy'
import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { FixedHeightRow } from '../../components/PositionCard'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow, RowFixed } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useMigrateState, { MigrateState } from '../../hooks/useMigrateState'
import { BackArrow, CloseIcon, CustomLightSpinner, TYPE } from '../../theme'
import LPToken from '../../types/LPToken'
import MetamaskError from '../../types/MetamaskError'
import AppBody from '../AppBody'
import { EmptyState } from '../MigrateV1/EmptyState'
import { MaxButton } from '../Pool/styleds'
import { Helmet } from 'react-helmet'

const Border = styled.div`
    width: 100%;
    height: 1px;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    background-color: ${({ theme }) => theme.bg2};
`

const ZERO = JSBI.BigInt(0)

const AmountInput = ({ state }: { state: MigrateState }) => {
    const onPressMax = useCallback(() => {
        if (state.selectedLPToken) {
            let balance = state.selectedLPToken.balance.raw
            if (state.selectedLPToken.address === AddressZero) {
                // Subtract 0.01 ETH for gas fee
                const fee = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16))
                balance = JSBI.greaterThan(balance, fee) ? JSBI.subtract(balance, fee) : ZERO
            }

            state.setAmount(formatUnits(balance.toString(), state.selectedLPToken.decimals))
        }
    }, [state])

    useEffect(() => {
        if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
            state.setAmount('')
        }
    }, [state])

    if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
        return <span />
    }

    return (
        <>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>Amount of Tokens</TYPE.mediumHeader>
            <LightCard>
                <FixedHeightRow>
                    <NumericalInput value={state.amount} onUserInput={val => state.setAmount(val)} />
                    <MaxButton onClick={onPressMax} width="10px">
                        MAX
                    </MaxButton>
                </FixedHeightRow>
            </LightCard>
            <Border />
        </>
    )
}

interface PositionCardProps {
    lpToken: LPToken
    onToggle: (lpToken: LPToken) => void
    isSelected: boolean
    updating: boolean
    exchange: string | undefined
}

const LPTokenSelect = ({ lpToken, onToggle, isSelected, updating, exchange }: PositionCardProps) => {
    const theme = useContext(ThemeContext)

    // console.log(updating)
    let version
    if (exchange === 'Uniswap') {
        version = 'v2'
    } else if (exchange === 'PancakeSwapV1') {
        version = 'v1'
    } else {
        version = ''
    }
    return (
        <LightCard onClick={() => onToggle(lpToken)}>
            <AutoColumn gap="12px">
                <FixedHeightRow>
                    <RowFixed>
                        <DoubleCurrencyLogo
                            currency0={lpToken.tokenA}
                            currency1={lpToken.tokenB}
                            margin={true}
                            size={20}
                        />
                        <TYPE.body fontWeight={500}>{`${lpToken.tokenA.symbol}/${lpToken.tokenB.symbol}`}</TYPE.body>
                        <Text
                            fontSize={12}
                            fontWeight={500}
                            ml="0.5rem"
                            px="0.75rem"
                            py="0.25rem"
                            style={{ borderRadius: '1rem' }}
                            backgroundColor={theme.yellow1}
                            color={'black'}
                        >
                            {version}
                        </Text>
                    </RowFixed>
                    {updating ? (
                        <CustomLightSpinner src={Circle} alt="loader" size="20px" />
                    ) : isSelected ? (
                        <CloseIcon />
                    ) : (
                        <ChevronRight />
                    )}
                </FixedHeightRow>
            </AutoColumn>
        </LightCard>
    )
}

const MigrateModeSelect = ({ state }: { state: MigrateState }) => {
    function toggleMode(mode = undefined) {
        state.setMode(mode !== state.mode ? mode : undefined)
    }

    const items = [
        {
            key: 'permit',
            text: 'Non-hardware Wallet',
            description: 'Migration is done in one-click using your signature(permit)'
        },
        {
            key: 'approve',
            text: 'Hardware Wallet',
            description: 'You need to first approve LP tokens and then migrate it'
        }
    ]

    return (
        <>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>Wallet Type</TYPE.mediumHeader>
            {items.reduce((acc: any, { key, text, description }: any) => {
                if (state.mode === undefined || key === state.mode)
                    acc.push(
                        <div key={key} className="cursor-pointer">
                            <LightCard onClick={() => toggleMode(key)}>
                                <AutoColumn gap="12px">
                                    <RowFixed>
                                        <AutoRow>
                                            <AutoRow marginBottom="2px">
                                                <TYPE.body fontWeight={500}>{text}</TYPE.body>
                                            </AutoRow>
                                            <AutoRow>
                                                <TYPE.darkGray fontSize=".75rem">{description}</TYPE.darkGray>
                                            </AutoRow>
                                        </AutoRow>
                                        {key === state.mode ? <CloseIcon /> : <ChevronRight />}
                                    </RowFixed>
                                </AutoColumn>
                            </LightCard>
                        </div>
                    )
                return acc
            }, [])}
            <Border />
        </>
    )
}

const MigrateButtons = ({ state, exchange }: { state: MigrateState; exchange: string | undefined }) => {
    const [error, setError] = useState<MetamaskError>({})
    const sushiRollContract = useSushiRollContract()
    const [approval, approve] = useApproveCallback(state.selectedLPToken?.balance, sushiRollContract?.address)
    const noLiquidityTokens = !!state.selectedLPToken?.balance && state.selectedLPToken?.balance.equalTo(ZERO)
    const isButtonDisabled = !state.amount

    useEffect(() => {
        setError({})
    }, [state.selectedLPToken])

    if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
        return <span />
    }

    const insufficientAmount = JSBI.lessThan(
        state.selectedLPToken.balance.raw,
        JSBI.BigInt(parseUnits(state.amount || '0', state.selectedLPToken.decimals).toString())
    )

    const onPress = async () => {
        setError({})
        try {
            await state.onMigrate()
        } catch (e) {
            console.log(e)
            setError(e)
        }
    }

    return (
        <AutoColumn gap="20px">
            <LightCard>
                <AutoRow style={{ flex: '1', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <TYPE.body fontSize=".875rem" fontWeight={500}>
                        {state.selectedLPToken.symbol}
                    </TYPE.body>
                    <TYPE.body fontSize=".875rem" fontWeight={500}>
                        {state.amount}
                    </TYPE.body>
                </AutoRow>
                {insufficientAmount ? (
                    <AutoColumn gap="12px" style={{ flex: '1' }}>
                        <TYPE.darkGray fontSize=".875rem" style={{ textAlign: 'center' }}>
                            Insufficient Balance
                        </TYPE.darkGray>
                    </AutoColumn>
                ) : state.loading ? (
                    <Dots>Loading</Dots>
                ) : (
                    <AutoRow>
                        {state.mode === 'approve' && (
                            <AutoColumn gap="12px" style={{ flex: '1', marginRight: 12 }}>
                                <ButtonConfirmed
                                    onClick={approve}
                                    confirmed={approval === ApprovalState.APPROVED}
                                    disabled={approval !== ApprovalState.NOT_APPROVED || isButtonDisabled}
                                    altDisabledStyle={approval === ApprovalState.PENDING}
                                >
                                    {approval === ApprovalState.PENDING ? (
                                        <Dots>Approving</Dots>
                                    ) : approval === ApprovalState.APPROVED ? (
                                        'Approved'
                                    ) : (
                                        'Approve'
                                    )}
                                </ButtonConfirmed>
                            </AutoColumn>
                        )}
                        <AutoColumn gap="12px" style={{ flex: '1' }}>
                            <ButtonConfirmed
                                disabled={
                                    noLiquidityTokens ||
                                    state.isMigrationPending ||
                                    (state.mode === 'approve' && approval !== ApprovalState.APPROVED) ||
                                    isButtonDisabled
                                }
                                onClick={onPress}
                            >
                                {state.isMigrationPending ? <Dots>Migrating</Dots> : 'Migrate'}
                            </ButtonConfirmed>
                        </AutoColumn>
                    </AutoRow>
                )}
                {error.message && error.code !== 4001 && (
                    <TYPE.body color="red" fontWeight={500} fontSize="0.875rem" marginTop="1.5rem" textAlign="center">
                        {error.message}
                    </TYPE.body>
                )}
            </LightCard>
            <TYPE.darkGray fontSize="0.75rem" textAlign="center">
                {}
                {`Your ${exchange} ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity will become Sushiswap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity.`}
            </TYPE.darkGray>
        </AutoColumn>
    )
}

const UniswapLiquidityPairs = ({ state, exchange }: { state: MigrateState; exchange: undefined | string }) => {
    let content: JSX.Element

    function onToggle(lpToken: LPToken) {
        state.setSelectedLPToken(state.selectedLPToken !== lpToken ? lpToken : undefined)
        state.setAmount('')
    }

    if (!state.mode) {
        content = <span />
    } else if (state.lpTokens.length === 0) {
        content = <EmptyState message="No Liquidity found." />
    } else {
        content = (
            <>
                {state.lpTokens.reduce<JSX.Element[]>((acc, lpToken) => {
                    if (lpToken.balance && JSBI.greaterThan(lpToken.balance.raw, JSBI.BigInt(0))) {
                        acc.push(
                            <div key={lpToken.address} className="cursor-pointer">
                                <LPTokenSelect
                                    lpToken={lpToken}
                                    onToggle={onToggle}
                                    isSelected={state.selectedLPToken === lpToken}
                                    updating={state.updatingLPTokens}
                                    exchange={exchange}
                                />
                            </div>
                        )
                    }
                    return acc
                }, [])}
            </>
        )
    }

    return (
        <>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>Your {exchange} Liquidity</TYPE.mediumHeader>
            {content}
            <Border />
        </>
    )
}

const MigrateV2 = () => {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()
    const state = useMigrateState()

    let exchange
    if (chainId === ChainId.MAINNET) {
        exchange = 'Uniswap'
    } else if (chainId === ChainId.BSC) {
        exchange = 'PancakeSwapV1'
    }

    return (
        <>
            <Helmet>
                <title>Migrate | Sushi</title>
                <meta name="description" content="Migrate LP tokens to Sushi LP tokens" />
            </Helmet>
            <AppBody style={{ padding: 24 }}>
                <AutoColumn gap="16px">
                    <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
                        <BackArrow to="/pool" />
                        <TYPE.mediumHeader>Migrate {exchange} Liquidity</TYPE.mediumHeader>
                        <div>
                            <QuestionHelper text={`Migrate your ${exchange} LP tokens to SushiSwap LP tokens.`} />
                        </div>
                    </AutoRow>
                    <TYPE.darkGray style={{ marginBottom: 8, fontWeight: 400 }}>
                        For each pool shown below, click migrate to remove your liquidity from {exchange} and deposit it
                        into Sushiswap.
                    </TYPE.darkGray>

                    {!account ? (
                        <LightCard padding="40px">
                            <TYPE.body color={theme.text3} textAlign="center">
                                Connect to a wallet to view your liquidity.
                            </TYPE.body>
                        </LightCard>
                    ) : state.loading ? (
                        <LightCard padding="40px">
                            <TYPE.body color={theme.text3} textAlign="center">
                                <Dots>Loading</Dots>
                            </TYPE.body>
                        </LightCard>
                    ) : (
                        <>
                            <MigrateModeSelect state={state} />
                            <UniswapLiquidityPairs state={state} exchange={exchange} />
                            <AmountInput state={state} />
                            <MigrateButtons state={state} exchange={exchange} />
                        </>
                    )}
                </AutoColumn>
            </AppBody>
        </>
    )
}

export default MigrateV2
