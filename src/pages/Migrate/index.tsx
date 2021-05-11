import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { BackArrow, CloseIcon } from '../../theme'
import { ChainId, JSBI } from '@sushiswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { formatUnits, parseUnits } from '@ethersproject/units'
import useMigrateState, { MigrateState } from '../../hooks/useMigrateState'

import { AddressZero } from '@ethersproject/constants'
import Badge from 'kashi/components/Badge'
import { Button } from '../../components'
import { ButtonConfirmed } from '../../components/ButtonLegacy'
import { ChevronRight } from 'react-feather'
import { Dots } from '../../components/swap/styleds'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { EmptyState } from '../../components/EmptyState'
import { Helmet } from 'react-helmet'
import LPToken from '../../types/LPToken'
import MetamaskError from '../../types/MetamaskError'
import { Input as NumericalInput } from '../../components/NumericalInput'
import QuestionHelper from '../../components/QuestionHelper'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useSushiRollContract } from 'hooks/useContract'

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
        return (
            <>
                <Typography variant="caption" className="text-secondary">
                    Amount of Tokens
                </Typography>
                <div className="rounded p-3 bg-dark-800 cursor-not-allowed text-center">
                    <Typography variant="body" className="text-secondary">
                        {state.mode && state.lpTokens.length === 0 ? 'No LP tokens found' : 'Select an LP Token'}
                    </Typography>
                </div>
            </>
        )
    }

    return (
        <>
            <Typography variant="caption" className="text-secondary">
                {t`Amount of Tokens`}
            </Typography>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={state.amount}
                    onUserInput={val => state.setAmount(val)}
                />
                <Button
                    variant="outlined"
                    color="pink"
                    size="small"
                    onClick={onPressMax}
                    className="absolute right-4 focus:ring focus:ring-pink"
                >
                    {t`MAX`}
                </Button>
            </div>
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
    return (
        <div
            key={lpToken.address}
            className="cursor-pointer flex justify-between items-center rounded px-3 py-5 bg-dark-800 hover:bg-dark-700"
            onClick={() => onToggle(lpToken)}
        >
            <div className="flex items-center space-x-3">
                <DoubleCurrencyLogo currency0={lpToken.tokenA} currency1={lpToken.tokenB} size={20} />
                <Typography
                    variant="body"
                    className="text-primary"
                >{`${lpToken.tokenA.symbol}/${lpToken.tokenB.symbol}`}</Typography>
                {lpToken.version && <Badge color="pink">{lpToken.version}</Badge>}
            </div>
            {isSelected ? <CloseIcon /> : <ChevronRight />}
        </div>
    )
}

const MigrateModeSelect = ({ state }: { state: MigrateState }) => {
    function toggleMode(mode = undefined) {
        state.setMode(mode !== state.mode ? mode : undefined)
    }

    const items = [
        {
            key: 'permit',
            text: t`Non-hardware Wallet`,
            description: t`Migration is done in one-click using your signature (permit)`
        },
        {
            key: 'approve',
            text: t`Hardware Wallet`,
            description: t`You need to first approve LP tokens and then migrate it`
        }
    ]

    return (
        <>
            {items.reduce((acc: any, { key, text, description }: any) => {
                if (state.mode === undefined || key === state.mode)
                    acc.push(
                        <div
                            key={key}
                            className="cursor-pointer flex justify-between items-center rounded p-3 bg-dark-800 hover:bg-dark-700"
                            onClick={() => toggleMode(key)}
                        >
                            <div>
                                <div>
                                    <Typography variant="caption">{text}</Typography>
                                </div>
                                <div>
                                    <Typography variant="caption2" className="text-secondary">
                                        {description}
                                    </Typography>
                                </div>
                            </div>
                            {key === state.mode ? <CloseIcon /> : <ChevronRight />}
                        </div>
                    )
                return acc
            }, [])}
        </>
    )
}

const MigrateButtons = ({ state, exchange }: { state: MigrateState; exchange: string | undefined }) => {
    const [error, setError] = useState<MetamaskError>({})
    const sushiRollContract = useSushiRollContract(
        state.selectedLPToken?.version ? state.selectedLPToken?.version : undefined
    )
    console.log(
        'sushiRollContract address',
        sushiRollContract?.address,
        state.selectedLPToken?.balance,
        state.selectedLPToken?.version
    )

    const [approval, approve] = useApproveCallback(state.selectedLPToken?.balance, sushiRollContract?.address)
    const noLiquidityTokens = !!state.selectedLPToken?.balance && state.selectedLPToken?.balance.equalTo(ZERO)
    const isButtonDisabled = !state.amount

    useEffect(() => {
        setError({})
    }, [state.selectedLPToken])

    if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken || !state.amount) {
        return <ButtonConfirmed disabled={true}>Migrate</ButtonConfirmed>
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
        <div className="space-y-4">
            {insufficientAmount ? (
                <div className="text-sm text-primary">{t`Insufficient Balance`}</div>
            ) : state.loading ? (
                <Dots>{t`Loading`}</Dots>
            ) : (
                <>
                    <div className="flex justify-between">
                        <div className="text-sm text-secondary">
                            {t`Balance`}:{' '}
                            <span className="text-primary">{state.selectedLPToken.balance.toSignificant(4)}</span>
                        </div>
                    </div>
                    {state.mode === 'approve' && (
                        <ButtonConfirmed
                            onClick={approve}
                            confirmed={approval === ApprovalState.APPROVED}
                            disabled={approval !== ApprovalState.NOT_APPROVED || isButtonDisabled}
                            altDisabledStyle={approval === ApprovalState.PENDING}
                        >
                            {approval === ApprovalState.PENDING ? (
                                <Dots>{t`Approving`}</Dots>
                            ) : approval === ApprovalState.APPROVED ? (
                                t`Approved`
                            ) : (
                                t`Approve`
                            )}
                        </ButtonConfirmed>
                    )}
                    {((state.mode === 'approve' && approval === ApprovalState.APPROVED) || state.mode === 'permit') && (
                        <ButtonConfirmed
                            disabled={noLiquidityTokens || state.isMigrationPending || isButtonDisabled}
                            onClick={onPress}
                        >
                            {state.isMigrationPending ? <Dots>{t`Migrating`}</Dots> : t`Migrate`}
                        </ButtonConfirmed>
                    )}
                </>
            )}
            {error.message && error.code !== 4001 && (
                <div className="text-red text-center font-medium">{error.message}</div>
            )}
            <div className="text-sm text-low-emphesis text-center">
                {t`Your ${exchange} ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity will become SushiSwap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity.`}
            </div>
        </div>
    )
}

const ExchangeLiquidityPairs = ({ state, exchange }: { state: MigrateState; exchange: undefined | string }) => {
    function onToggle(lpToken: LPToken) {
        state.setSelectedLPToken(state.selectedLPToken !== lpToken ? lpToken : undefined)
        state.setAmount('')
    }

    if (!state.mode) {
        return null
    }

    if (state.lpTokens.length === 0) {
        return <EmptyState message={t`No Liquidity found`} />
    }

    return (
        <>
            {state.lpTokens.reduce<JSX.Element[]>((acc, lpToken) => {
                if (lpToken.balance && JSBI.greaterThan(lpToken.balance.raw, JSBI.BigInt(0))) {
                    acc.push(
                        <LPTokenSelect
                            lpToken={lpToken}
                            onToggle={onToggle}
                            isSelected={state.selectedLPToken === lpToken}
                            updating={state.updatingLPTokens}
                            exchange={exchange}
                        />
                    )
                }
                return acc
            }, [])}
        </>
    )
}

const MigrateV2 = () => {
    const { account, chainId } = useActiveWeb3React()

    const state = useMigrateState()

    let exchange

    if (chainId === ChainId.MAINNET) {
        exchange = 'Uniswap'
    } else if (chainId === ChainId.BSC) {
        exchange = 'PancakeSwap'
    } else if (chainId === ChainId.MATIC) {
        exchange = 'QuickSwap'
    }

    return (
        <>
            <Helmet>
                <title>Migrate LP tokens | Sushi</title>
                <meta name="description" content="Migrate LP tokens to Sushi LP tokens" />
            </Helmet>

            <div className="text-2xl text-center mb-8">{t`Migrate ${exchange} Liquidity`}</div>

            <div className="bg-dark-900 shadow-swap-blue-glow w-full max-w-lg rounded p-5 space-y-4">
                {/* <div className="flex justify-between items-center p-3">
                    <BackArrow to="/pool" />
                    <div>Select your wallet</div>
                    <QuestionHelper text={`Migrate your ${exchange} LP tokens to SushiSwap LP tokens.`} />
                </div> */}
                {!account ? (
                    <Typography variant="body" className="text-primary text-center p-4">
                        {t`Connect to a wallet to view your liquidity`}
                    </Typography>
                ) : state.loading ? (
                    <Typography variant="body" className="text-primary text-center p-4">
                        <Dots>{t`Loading your {exchange} liquidity positions`}</Dots>
                    </Typography>
                ) : (
                    <>
                        {!state.loading && <Typography variant="body">{t`Your Wallet`}</Typography>}
                        <MigrateModeSelect state={state} />
                        {!state.loading && (
                            <div>
                                <Typography variant="body">{t`Your Liquidity`}</Typography>
                                <Typography variant="caption" className="text-secondary">
                                    {t`Click on a pool below, input the amount you wish to migrate or select max, and click
                                    migrate`}
                                </Typography>
                            </div>
                        )}
                        <ExchangeLiquidityPairs state={state} exchange={exchange} />
                        <AmountInput state={state} />
                        <MigrateButtons state={state} exchange={exchange} />
                    </>
                )}
            </div>
        </>
    )
}

export default MigrateV2
