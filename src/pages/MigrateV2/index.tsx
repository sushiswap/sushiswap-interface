import { AddressZero } from '@ethersproject/constants'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { JSBI } from '@sushiswap/sdk'
import { useSushiRollContract } from 'hooks/useContract'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import Circle from '../../assets/images/blue-loader.svg'
import { ButtonConfirmed } from '../../components/Button'
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
import { BodyWrapper } from '../AppBody'
import { EmptyState } from '../MigrateV1/EmptyState'
import { MaxButton } from '../Pool/styleds'

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
    onClick: (lpToken: LPToken) => void
    onDismiss: () => void
    isSelected: boolean
    updating: boolean
}

const LPTokenSelect = ({ lpToken, onClick, onDismiss, isSelected, updating }: PositionCardProps) => {
    const theme = useContext(ThemeContext)
    // console.log(updating)
    return (
        <LightCard>
            <AutoColumn gap="12px">
                <FixedHeightRow>
                    <RowFixed onClick={() => onClick(lpToken)}>
                        <DoubleCurrencyLogo
                            currency0={lpToken.tokenA}
                            currency1={lpToken.tokenB}
                            margin={true}
                            size={20}
                        />
                        <TYPE.body fontWeight={500} style={{ marginLeft: '' }}>
                            {`${lpToken.tokenA.symbol}/${lpToken.tokenB.symbol}`}
                        </TYPE.body>
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
                            V2
                        </Text>
                    </RowFixed>
                    {updating ? (
                        <CustomLightSpinner src={Circle} alt="loader" size="20px" />
                    ) : isSelected ? (
                        <CloseIcon onClick={onDismiss} />
                    ) : (
                        <ChevronRight onClick={() => onClick(lpToken)} />
                    )}
                </FixedHeightRow>
            </AutoColumn>
        </LightCard>
    )
}

const MigrateModeSelect = ({ state }: { state: MigrateState }) => {
    const unsetMode = () => state.setMode(undefined)

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
                        <LightCard key={key}>
                            <AutoColumn gap="12px">
                                <RowFixed>
                                    <AutoRow onClick={() => state.setMode(key)}>
                                        <AutoRow marginBottom="2px">
                                            <TYPE.body fontWeight={500}>{text}</TYPE.body>
                                        </AutoRow>
                                        <AutoRow>
                                            <TYPE.darkGray fontSize=".75rem">{description}</TYPE.darkGray>
                                        </AutoRow>
                                    </AutoRow>
                                    {key === state.mode ? (
                                        <CloseIcon onClick={unsetMode} />
                                    ) : (
                                        <ChevronRight onClick={unsetMode} />
                                    )}
                                </RowFixed>
                            </AutoColumn>
                        </LightCard>
                    )
                return acc
            }, [])}
            <Border />
        </>
    )
}

const MigrateButtons = ({ state }: { state: MigrateState }) => {
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
                {`Your Uniswap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity will become Sushiswap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity.`}
            </TYPE.darkGray>
        </AutoColumn>
    )
}

const UniswapLiquidityPairs = ({ state }: { state: MigrateState }) => {
    let content: JSX.Element
    const onClick = useCallback(
        lpToken => {
            state.setAmount('')
            state.setSelectedLPToken(lpToken)
        },
        [state]
    )

    const onDismiss = useCallback(() => {
        state.setAmount('')
        state.setSelectedLPToken(undefined)
    }, [state])

    if (!state.mode) {
        content = <span />
    } else if (state.lpTokens.length === 0) {
        content = <EmptyState message="No V2 Liquidity found." />
    } else {
        content = (
            <>
                {state.lpTokens.reduce<JSX.Element[]>((acc, lpToken) => {
                    if (lpToken.balance && JSBI.greaterThan(lpToken.balance.raw, JSBI.BigInt(0))) {
                        acc.push(
                            <LPTokenSelect
                                lpToken={lpToken}
                                key={lpToken.address}
                                onClick={onClick}
                                onDismiss={onDismiss}
                                isSelected={state.selectedLPToken === lpToken}
                                updating={state.updatingLPTokens}
                            />
                        )
                    }
                    return acc
                }, [])}
            </>
        )
    }

    return (
        <>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>Your Uniswap Liquidity</TYPE.mediumHeader>
            {content}
            <Border />
        </>
    )
}

const MigrateV2 = () => {
    const theme = useContext(ThemeContext)
    const { account } = useActiveWeb3React()
    const state = useMigrateState()

    return (
        <BodyWrapper style={{ padding: 24 }}>
            <AutoColumn gap="16px">
                <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
                    <BackArrow to="/pool" />
                    <TYPE.mediumHeader>Migrate Uniswap Liquidity</TYPE.mediumHeader>
                    <div>
                        <QuestionHelper text="Migrate your Uniswap LP tokens to SushiSwap LP tokens." />
                    </div>
                </AutoRow>
                <TYPE.darkGray style={{ marginBottom: 8, fontWeight: 400 }}>
                    For each pool shown below, click migrate to remove your liquidity from Uniswap and deposit it into
                    Sushiswap.
                </TYPE.darkGray>

                {!account ? (
                    <LightCard padding="40px">
                        <TYPE.body color={theme.text3} textAlign="center">
                            Connect to a wallet to view your V2 liquidity.
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
                        <UniswapLiquidityPairs state={state} />
                        <AmountInput state={state} />
                        <MigrateButtons state={state} />
                    </>
                )}
            </AutoColumn>
        </BodyWrapper>
    )
}

export default MigrateV2
