import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import { Currency, NATIVE, TokenAmount, WETH, currencyEquals } from '@sushiswap/sdk'
import React, { useCallback, useMemo, useState } from 'react'
import { AutoRow, RowBetween } from '../../components/Row'
import { Trans, t } from '@lingui/macro'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { calculateGasMargin, calculateSlippageAmount } from '../../functions/trade'
import { currencyId, maxAmountSpend, wrappedCurrency } from '../../functions/currency'
import { getRouterAddress, getRouterContract } from '../../functions/contract'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'

import AdvancedLiquidityDetailsDropdown from '../../containers/liquidity/AdvancedLiquidityDetailsDropdown'
import Alert from '../../components/Alert'
import { AutoColumn } from '../../components/Column'
import { BigNumber } from '@ethersproject/bignumber'
import { ConfirmAddModalBottom } from '../../containers/liquidity/ConfirmAddModalBottom'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import Dots from '../../components/Dots'
import { Field } from '../../state/mint/actions'
import Head from 'next/head'
import Header from '../../components/ExchangeHeader'
import Layout from '../../components/Layout'
import LiquidityHeader from '../../containers/liquidity/LiquidityHeader'
import LiquidityPrice from '../../containers/liquidity/LiquidityPrice'
import { MinimalPositionCard } from '../../components/PositionCard'
import NavLink from '../../components/NavLink'
import { PairState } from '../../hooks/usePairs'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { TransactionResponse } from '@ethersproject/providers'
import UnsupportedCurrencyFooter from '../../containers/swap/UnsupportedCurrencyFooter'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useIsTransactionUnsupported } from '../../hooks/Trades'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import CurrencyLogo from '../../components/CurrencyLogo'

export default function Add() {
    const { i18n } = useLingui()
    const { account, chainId, library } = useActiveWeb3React()
    const router = useRouter()
    const tokens = router.query.tokens
    const [currencyIdA, currencyIdB] = tokens as string[]

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
        error,
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
        [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }

    // get the max amounts user can add
    const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmountSpend(currencyBalances[field]),
            }
        },
        {}
    )

    const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
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
            [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
        }

        let estimate,
            method: (...args: any) => Promise<TransactionResponse>,
            args: Array<string | string[] | number>,
            value: BigNumber | null
        if (currencyA === NATIVE || currencyB === NATIVE) {
            const tokenBIsETH = currencyB === NATIVE
            estimate = router.estimateGas.addLiquidityETH
            method = router.addLiquidityETH
            args = [
                wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
                (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
                amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
                amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
                account,
                deadline.toHexString(),
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
                deadline.toHexString(),
            ]
            value = null
        }

        setAttemptingTxn(true)
        await estimate(...args, value ? { value } : {})
            .then((estimatedGasLimit) =>
                method(...args, {
                    ...(value ? { value } : {}),
                    gasLimit: calculateGasMargin(estimatedGasLimit),
                }).then((response) => {
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
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId),
                    })

                    setTxHash(response.hash)

                    ReactGA.event({
                        category: 'Liquidity',
                        action: 'Add',
                        label: [
                            currencies[Field.CURRENCY_A]?.getSymbol(chainId),
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId),
                        ].join('/'),
                    })
                })
            )
            .catch((error) => {
                setAttemptingTxn(false)
                // we only care if the error is something _other_ than the user rejected the tx
                if (error?.code !== 4001) {
                    console.error(error)
                }
            })
    }

    const modalHeader = () => {
        return noLiquidity ? (
            <div className="pb-4">
                <div className="flex justify-start items-center gap-3">
                    <div className="text-2xl font-bold text-high-emphesis">
                        {currencies[Field.CURRENCY_A]?.getSymbol(chainId) +
                            '/' +
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId)}
                    </div>
                    <div className="grid gap-2 grid-flow-col">
                        <CurrencyLogo currency={currencyA} squared size={48} />
                        <CurrencyLogo currency={currencyB} squared size={48} />
                    </div>
                </div>
            </div>
        ) : (
            <div className="pb-4">
                <div className="flex justify-start items-center gap-3">
                    <div className="text-[2.275rem] font-bold text-high-emphesis">
                        {liquidityMinted?.toSignificant(6)}
                    </div>
                    <div className="grid gap-2 grid-flow-col">
                        <CurrencyLogo currency={currencyA} squared size={48} />
                        <CurrencyLogo currency={currencyB} squared size={48} />
                    </div>
                </div>
                <div className="text-2xl font-medium text-high-emphesis">
                    {currencies[Field.CURRENCY_A]?.getSymbol(chainId)}/
                    {currencies[Field.CURRENCY_B]?.getSymbol(chainId)}
                    &nbsp;<Trans>Pool Tokens</Trans>
                </div>
                <div className="text-sm text-secondary pt-3">
                    {t`Output is estimated. If the price changes by more than ${
                        allowedSlippage / 100
                    }% your transaction will revert.`}
                </div>
            </div>
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
                router.push(`/add/${currencyIdB}/${currencyIdA}`)
            } else {
                router.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
            }
        },
        [currencyIdB, router, currencyIdA]
    )
    const handleCurrencyBSelect = useCallback(
        (currencyB: Currency) => {
            const newCurrencyIdB = currencyId(currencyB)
            if (currencyIdA === newCurrencyIdB) {
                if (currencyIdB) {
                    router.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
                } else {
                    router.push(`/add/${newCurrencyIdB}`)
                }
            } else {
                router.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
            }
        },
        [currencyIdA, router, currencyIdB]
    )

    const handleDismissConfirmation = useCallback(() => {
        setShowConfirm(false)
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onFieldAInput('')
        }
        setTxHash('')
    }, [onFieldAInput, txHash])

    const isCreate = router.pathname.includes('/create')

    const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

    return (
        <Layout>
            <Head>
                <title>Add Liquidity | Sushi</title>
                <meta
                    name="description"
                    content="Add liquidity to the SushiSwap AMM to enable gas optimised and low slippage trades across countless networks"
                />
            </Head>
            <div className="w-full max-w-2xl px-4 mb-5">
                <NavLink
                    className="text-base font-medium text-center text-secondary hover:text-high-emphesis"
                    href={'/pool'}
                >
                    <a>{i18n._(t`View Your Liquidity Positions`)} &gt;</a>
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
            <div className="z-10 w-full max-w-2xl p-4 rounded bg-dark-900 shadow-liquidity-purple-glow">
                <Header input={currencies[Field.CURRENCY_A]} output={currencies[Field.CURRENCY_B]} />
                <div>
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
                                <button className="z-10 -mt-6 -mb-6 rounded-full bg-dark-900 p-3px">
                                    <div className="p-3 rounded-full bg-dark-800 hover:bg-dark-700">
                                        <Plus size="32" />
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
                            <ButtonPrimary disabled={true}>{i18n._(t`Unsupported Asset`)}</ButtonPrimary>
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
                </div>
            </div>
            <div className="z-0 w-full max-w-2xl">
                {!addIsUnsupported ? (
                    pair && !noLiquidity && pairState !== PairState.INVALID ? (
                        <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                    ) : (
                        <AdvancedLiquidityDetailsDropdown show={Boolean(typedValue)} />
                    )
                ) : (
                    <UnsupportedCurrencyFooter
                        show={addIsUnsupported}
                        currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
                    />
                )}
            </div>
        </Layout>
    )
}
