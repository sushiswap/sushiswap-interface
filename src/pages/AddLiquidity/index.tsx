import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import { Currency, ETHER, TokenAmount, WETH, currencyEquals } from '@sushiswap/sdk'
import { Dots, Wrapper } from '../Pool/styleds'
import React, { useCallback, useContext, useState } from 'react'
import Row, { AutoRow, RowBetween, RowFlat } from '../../components/Row'
import { Trans, t } from '@lingui/macro'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { calculateGasMargin, calculateSlippageAmount, getRouterAddress, getRouterContract } from '../../utils'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'

import AdvancedLiquidityDetailsDropdown from '../../components/Liquidity/AdvancedLiquidityDetailsDropdown'
import Alert from '../../components/Alert'
import { AutoColumn } from '../../components/Column'
import { BigNumber } from '@ethersproject/bignumber'
import Button from '../../components/Button'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { Field } from '../../state/mint/actions'
import Header from '../../components/ExchangeHeader'
import { Helmet } from 'react-helmet'
import { LightCard } from '../../components/CardLegacy'
import LiquidityHeader from '../../components/Liquidity/LiquidityHeader'
import LiquidityPrice from '../../components/Liquidity/LiquidityPrice'
import { MinimalPositionCard } from '../../components/PositionCard'
import { NavLink } from '../../components/Link'
import { PairState } from '../../data/Reserves'
import { Plus } from 'react-feather'
import { PoolPriceBar } from './PoolPriceBar'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { TYPE } from '../../theme'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { TransactionResponse } from '@ethersproject/providers'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { currencyId } from '../../utils/currencyId'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { useLingui } from '@lingui/react'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { wrappedCurrency } from '../../utils/wrappedCurrency'

export default function AddLiquidity({
    match: {
        params: { currencyIdA, currencyIdB }
    },
    history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
    const { i18n } = useLingui()
    const { account, chainId, library } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

    const currencyA = useCurrency(currencyIdA)
    const currencyB = useCurrency(currencyIdB)

    const oneCurrencyIsWETH = Boolean(
        chainId &&
            ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
                (currencyB && currencyEquals(currencyB, WETH[chainId])))
    )

    const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

    const expertMode = useIsExpertMode()

    // mint state
    const { independentField, typedValue, otherTypedValue } = useMintState()
    const {
        dependentField,
        currencies,
        pair,
        pairState,
        currencyBalances,
        parsedAmounts,
        price,
        noLiquidity,
        liquidityMinted,
        poolTokenPercentage,
        error
    } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

    const isValid = !error

    // modal and loading
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

    // txn values
    const deadline = useTransactionDeadline() // custom from users settings
    const [allowedSlippage] = useUserSlippageTolerance() // custom from users
    const [txHash, setTxHash] = useState<string>('')

    // get formatted amounts
    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
    }

    // get the max amounts user can add
    const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmountSpend(currencyBalances[field])
            }
        },
        {}
    )

    const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
            }
        },
        {}
    )

    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], getRouterAddress(chainId))
    const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], getRouterAddress(chainId))

    const addTransaction = useTransactionAdder()

    async function onAdd() {
        if (!chainId || !library || !account) return
        const router = getRouterContract(chainId, library, account)

        const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
        if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
            return
        }

        const amountsMin = {
            [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
            [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
        }

        let estimate,
            method: (...args: any) => Promise<TransactionResponse>,
            args: Array<string | string[] | number>,
            value: BigNumber | null
        if (currencyA === ETHER || currencyB === ETHER) {
            const tokenBIsETH = currencyB === ETHER
            estimate = router.estimateGas.addLiquidityETH
            method = router.addLiquidityETH
            args = [
                wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
                (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
                amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
                amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
                account,
                deadline.toHexString()
            ]
            value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
        } else {
            estimate = router.estimateGas.addLiquidity
            method = router.addLiquidity
            args = [
                wrappedCurrency(currencyA, chainId)?.address ?? '',
                wrappedCurrency(currencyB, chainId)?.address ?? '',
                parsedAmountA.raw.toString(),
                parsedAmountB.raw.toString(),
                amountsMin[Field.CURRENCY_A].toString(),
                amountsMin[Field.CURRENCY_B].toString(),
                account,
                deadline.toHexString()
            ]
            value = null
        }

        setAttemptingTxn(true)
        await estimate(...args, value ? { value } : {})
            .then(estimatedGasLimit =>
                method(...args, {
                    ...(value ? { value } : {}),
                    gasLimit: calculateGasMargin(estimatedGasLimit)
                }).then(response => {
                    setAttemptingTxn(false)

                    addTransaction(response, {
                        summary:
                            'Add ' +
                            parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
                            ' ' +
                            currencies[Field.CURRENCY_A]?.getSymbol(chainId) +
                            ' and ' +
                            parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
                            ' ' +
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId)
                    })

                    setTxHash(response.hash)

                    ReactGA.event({
                        category: 'Liquidity',
                        action: 'Add',
                        label: [
                            currencies[Field.CURRENCY_A]?.getSymbol(chainId),
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId)
                        ].join('/')
                    })
                })
            )
            .catch(error => {
                setAttemptingTxn(false)
                // we only care if the error is something _other_ than the user rejected the tx
                if (error?.code !== 4001) {
                    console.error(error)
                }
            })
    }

    const modalHeader = () => {
        return noLiquidity ? (
            <AutoColumn gap="20px">
                <LightCard mt="20px" borderRadius="20px">
                    <RowFlat>
                        <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
                            {currencies[Field.CURRENCY_A]?.getSymbol(chainId) +
                                '/' +
                                currencies[Field.CURRENCY_B]?.getSymbol(chainId)}
                        </Text>
                        <DoubleCurrencyLogo
                            currency0={currencies[Field.CURRENCY_A]}
                            currency1={currencies[Field.CURRENCY_B]}
                            size={30}
                        />
                    </RowFlat>
                </LightCard>
            </AutoColumn>
        ) : (
            <AutoColumn gap="20px">
                <RowFlat style={{ marginTop: '20px' }}>
                    <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
                        {liquidityMinted?.toSignificant(6)}
                    </Text>
                    <DoubleCurrencyLogo
                        currency0={currencies[Field.CURRENCY_A]}
                        currency1={currencies[Field.CURRENCY_B]}
                        size={30}
                    />
                </RowFlat>
                <Row>
                    <Text fontSize="24px">
                        {currencies[Field.CURRENCY_A]?.getSymbol(chainId)}/
                        {currencies[Field.CURRENCY_B]?.getSymbol(chainId)}
                        <Trans>Pool Tokens</Trans>
                    </Text>
                </Row>
                <TYPE.italic fontSize={14} className="text-gray-500" textAlign="left" padding={'20px 0 20px 0'}>
                    {t`Output is estimated. If the price changes by more than ${allowedSlippage /
                        100}% your transaction will revert.`}
                </TYPE.italic>
            </AutoColumn>
        )
    }

    const modalBottom = () => {
        return (
            <ConfirmAddModalBottom
                price={price}
                currencies={currencies}
                parsedAmounts={parsedAmounts}
                noLiquidity={noLiquidity}
                onAdd={onAdd}
                poolTokenPercentage={poolTokenPercentage}
            />
        )
    }

    const pendingText = t`Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencies[
        Field.CURRENCY_A
    ]?.getSymbol(chainId)} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[
        Field.CURRENCY_B
    ]?.getSymbol(chainId)}`

    const handleCurrencyASelect = useCallback(
        (currencyA: Currency) => {
            const newCurrencyIdA = currencyId(currencyA)
            if (newCurrencyIdA === currencyIdB) {
                history.push(`/add/${currencyIdB}/${currencyIdA}`)
            } else {
                history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
            }
        },
        [currencyIdB, history, currencyIdA]
    )
    const handleCurrencyBSelect = useCallback(
        (currencyB: Currency) => {
            const newCurrencyIdB = currencyId(currencyB)
            if (currencyIdA === newCurrencyIdB) {
                if (currencyIdB) {
                    history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
                } else {
                    history.push(`/add/${newCurrencyIdB}`)
                }
            } else {
                history.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
            }
        },
        [currencyIdA, history, currencyIdB]
    )

    const handleDismissConfirmation = useCallback(() => {
        setShowConfirm(false)
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onFieldAInput('')
        }
        setTxHash('')
    }, [onFieldAInput, txHash])

    const isCreate = history.location.pathname.includes('/create')

    const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Add Liquidity`)} | Sushi</title>
            </Helmet>
            <div className="w-full max-w-2xl mb-5 px-4">
                <NavLink
                    className="text-center text-secondary hover:text-high-emphesis text-base font-medium"
                    to={'/pool'}
                >
                    {i18n._(t`View Your Liquidity Positions`)} &gt;
                </NavLink>
                {/* <button
                    style={{
                        backgroundColor: 'rgba(167, 85, 221, 0.25)',
                        border: '1px solid #A755DD',
                        borderRadius: 20,
                        padding: '5px 40px'
                        fontSize: 14,
                    }}
                >
                    FARM THE {currencies[Field.CURRENCY_A]?.getSymbol(chainId)}-
                    {currencies[Field.CURRENCY_B]?.getSymbol(chainId)} POOL
                </button> */}
            </div>
            <div className="bg-dark-900 w-full max-w-2xl rounded z-10 shadow-liquidity-purple-glow">
                <Header input={currencies[Field.CURRENCY_A]} output={currencies[Field.CURRENCY_B]} />
                <Wrapper>
                    <TransactionConfirmationModal
                        isOpen={showConfirm}
                        onDismiss={handleDismissConfirmation}
                        attemptingTxn={attemptingTxn}
                        hash={txHash}
                        content={() => (
                            <ConfirmationModalContent
                                title={noLiquidity ? i18n._(t`You are creating a pool`) : i18n._(t`You will receive`)}
                                onDismiss={handleDismissConfirmation}
                                topContent={modalHeader}
                                bottomContent={modalBottom}
                            />
                        )}
                        pendingText={pendingText}
                    />
                    <AutoColumn gap="md">
                        {noLiquidity ||
                            (isCreate ? (
                                <Alert
                                    message={i18n._(
                                        t`When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click supply to review`
                                    )}
                                    type="information"
                                />
                            ) : (
                                <>
                                    <Alert
                                        showIcon={false}
                                        message={
                                            <Trans>
                                                <b>Tip:</b> When you add liquidity, you will receive pool tokens
                                                representing your position. These tokens automatically earn fees
                                                proportional to your share of the pool, and can be redeemed at any time.
                                            </Trans>
                                        }
                                        type="information"
                                    />
                                    {pair && !noLiquidity && pairState !== PairState.INVALID && (
                                        <LiquidityHeader
                                            input={currencies[Field.CURRENCY_A]}
                                            output={currencies[Field.CURRENCY_B]}
                                        />
                                    )}
                                </>
                            ))}

                        <CurrencyInputPanel
                            value={formattedAmounts[Field.CURRENCY_A]}
                            onUserInput={onFieldAInput}
                            onMax={() => {
                                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                            }}
                            onCurrencySelect={handleCurrencyASelect}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                            currency={currencies[Field.CURRENCY_A]}
                            id="add-liquidity-input-tokena"
                            showCommonBases
                        />

                        <AutoColumn justify="space-between">
                            <AutoRow
                                justify={expertMode ? 'space-between' : 'flex-start'}
                                style={{ padding: '0 1rem' }}
                            >
                                <button className="bg-dark-900 rounded-full p-3px -mt-6 -mb-6 z-10">
                                    <div className="bg-dark-800 hover:bg-dark-700 rounded-full p-3">
                                        <Plus size="32" color={theme.text2} />
                                    </div>
                                </button>
                            </AutoRow>
                        </AutoColumn>
                        <CurrencyInputPanel
                            value={formattedAmounts[Field.CURRENCY_B]}
                            onUserInput={onFieldBInput}
                            onCurrencySelect={handleCurrencyBSelect}
                            onMax={() => {
                                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                            }}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                            currency={currencies[Field.CURRENCY_B]}
                            id="add-liquidity-input-tokenb"
                            showCommonBases
                        />
                        {currencies[Field.CURRENCY_A] &&
                            currencies[Field.CURRENCY_B] &&
                            pairState !== PairState.INVALID && (
                                <>
                                    <LiquidityPrice
                                        input={currencies[Field.CURRENCY_A]}
                                        output={currencies[Field.CURRENCY_B]}
                                        price={price}
                                    />
                                    {/* <PoolPriceBar
                                        currencies={currencies}
                                        poolTokenPercentage={poolTokenPercentage}
                                        noLiquidity={noLiquidity}
                                        price={price}
                                    /> */}
                                </>
                            )}

                        {addIsUnsupported ? (
                            <ButtonPrimary disabled={true}>
                                <TYPE.main mb="4px">{i18n._(t`Unsupported Asset`)}</TYPE.main>
                            </ButtonPrimary>
                        ) : !account ? (
                            <ButtonLight onClick={toggleWalletModal}>{i18n._(t`Connect Wallet`)}</ButtonLight>
                        ) : (
                            <AutoColumn gap={'md'}>
                                {(approvalA === ApprovalState.NOT_APPROVED ||
                                    approvalA === ApprovalState.PENDING ||
                                    approvalB === ApprovalState.NOT_APPROVED ||
                                    approvalB === ApprovalState.PENDING) &&
                                    isValid && (
                                        <RowBetween>
                                            {approvalA !== ApprovalState.APPROVED && (
                                                <ButtonPrimary
                                                    onClick={approveACallback}
                                                    disabled={approvalA === ApprovalState.PENDING}
                                                    width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                                                >
                                                    {approvalA === ApprovalState.PENDING ? (
                                                        <Dots>
                                                            {t`Approving ${currencies[Field.CURRENCY_A]?.getSymbol(
                                                                chainId
                                                            )}`}
                                                        </Dots>
                                                    ) : (
                                                        i18n._(
                                                            t`Approve ${currencies[Field.CURRENCY_A]?.getSymbol(
                                                                chainId
                                                            )}`
                                                        )
                                                    )}
                                                </ButtonPrimary>
                                            )}
                                            {approvalB !== ApprovalState.APPROVED && (
                                                <ButtonPrimary
                                                    onClick={approveBCallback}
                                                    disabled={approvalB === ApprovalState.PENDING}
                                                    width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                                                >
                                                    {approvalB === ApprovalState.PENDING ? (
                                                        <Dots>
                                                            {t`Approving ${currencies[Field.CURRENCY_B]?.getSymbol(
                                                                chainId
                                                            )}`}
                                                        </Dots>
                                                    ) : (
                                                        i18n._(
                                                            t`Approve ${currencies[Field.CURRENCY_B]?.getSymbol(
                                                                chainId
                                                            )}`
                                                        )
                                                    )}
                                                </ButtonPrimary>
                                            )}
                                        </RowBetween>
                                    )}
                                <ButtonError
                                    onClick={() => {
                                        expertMode ? onAdd() : setShowConfirm(true)
                                    }}
                                    disabled={
                                        !isValid ||
                                        approvalA !== ApprovalState.APPROVED ||
                                        approvalB !== ApprovalState.APPROVED
                                    }
                                    error={
                                        !isValid &&
                                        !!parsedAmounts[Field.CURRENCY_A] &&
                                        !!parsedAmounts[Field.CURRENCY_B]
                                    }
                                >
                                    <Text fontSize={20} fontWeight={500}>
                                        {error ?? i18n._(t`Confirm Adding Liquidity`)}
                                    </Text>
                                </ButtonError>
                            </AutoColumn>
                        )}
                    </AutoColumn>
                </Wrapper>
            </div>
            <div className="w-full max-w-2xl z-0">
                {!addIsUnsupported ? (
                    pair && !noLiquidity && pairState !== PairState.INVALID ? (
                        <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                    ) : null
                ) : (
                    //  <AdvancedLiquidityDetailsDropdown show={Boolean(typedValue)} />
                    <UnsupportedCurrencyFooter
                        show={addIsUnsupported}
                        currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
                    />
                )}
            </div>
        </>
    )
}
