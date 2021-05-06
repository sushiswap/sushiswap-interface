import { BigNumber } from '@ethersproject/bignumber'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { ChainId, Currency, currencyEquals, ETHER, Percent, WETH } from '@sushiswap/sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ArrowDown, Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import { BlueCard } from '../../components/CardLegacy'
import { AutoColumn } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import PercentInputPanel from '../../components/PercentInputPanel'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { usePairContract } from '../../hooks/useContract'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useDerivedMintInfo } from '../../state/mint/hooks'
import { Field } from '../../state/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { calculateGasMargin, calculateSlippageAmount, getRouterAddress, getRouterContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { Wrapper } from '../Pool/styleds'
import { Helmet } from 'react-helmet'
import Header from '../../components/ExchangeHeader'
import { NavLink } from '../../components/Link'
import AdvancedLiquidityDetailsDropdown from '../../components/Liquidity/AdvancedLiquidityDetailsDropdown'
import LiquidityHeader from '../../components/Liquidity/LiquidityHeader'
import LiquidityPrice from '../../components/Liquidity/LiquidityPrice'
import RemoveLiquidityReceiveDetails from '../../components/Liquidity/RemoveLiquidityReceiveDetails'
import { Alert } from '../../components'

export default function RemoveLiquidity({
    history,
    match: {
        params: { currencyIdA, currencyIdB }
    }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
    const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
    const { account, chainId, library } = useActiveWeb3React()
    const [tokenA, tokenB] = useMemo(() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)], [
        currencyA,
        currencyB,
        chainId
    ])

    const theme = useContext(ThemeContext)

    // toggle wallet when disconnected
    const toggleWalletModal = useWalletModalToggle()

    // burn state
    const { price } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
    const { independentField, typedValue } = useBurnState()
    const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
    const { onUserInput: _onUserInput } = useBurnActionHandlers()
    const isValid = !error

    // modal and loading
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

    // txn values
    const [txHash, setTxHash] = useState<string>('')
    const deadline = useTransactionDeadline()
    const [allowedSlippage] = useUserSlippageTolerance()

    const formattedAmounts = {
        [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('')
            ? ''
            : parsedAmounts[Field.LIQUIDITY_PERCENT].greaterThan('100')
            ? '100'
            : parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
            ? '0'
            : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
            ? '<1'
            : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
        [Field.LIQUIDITY]:
            independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
        [Field.CURRENCY_A]:
            independentField === Field.CURRENCY_A
                ? typedValue
                : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
        [Field.CURRENCY_B]:
            independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''
    }

    const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

    // pair contract
    const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

    // allowance handling
    const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(
        null
    )
    const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], getRouterAddress(chainId))

    const isArgentWallet = useIsArgentWallet()

    async function onAttemptToApprove() {
        if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
        const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
        if (!liquidityAmount) throw new Error('missing liquidity amount')

        if (isArgentWallet) {
            return approveCallback()
        }

        if (chainId !== ChainId.HARMONY) {
            // try to gather a signature for permission
            const nonce = await pairContract.nonces(account)

            const EIP712Domain = [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' }
            ]
            const domain = {
                name: 'SushiSwap LP Token',
                version: '1',
                chainId: chainId,
                verifyingContract: pair.liquidityToken.address
            }
            const Permit = [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' }
            ]
            const message = {
                owner: account,
                spender: getRouterAddress(chainId),
                value: liquidityAmount.raw.toString(),
                nonce: nonce.toHexString(),
                deadline: deadline.toNumber()
            }
            const data = JSON.stringify({
                types: {
                    EIP712Domain,
                    Permit
                },
                domain,
                primaryType: 'Permit',
                message
            })

            library
                .send('eth_signTypedData_v4', [account, data])
                .then(splitSignature)
                .then(signature => {
                    setSignatureData({
                        v: signature.v,
                        r: signature.r,
                        s: signature.s,
                        deadline: deadline.toNumber()
                    })
                })
                .catch(error => {
                    // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
                    if (error?.code !== 4001) {
                        approveCallback()
                    }
                })
        } else {
            return approveCallback()
        }
    }

    // wrapped onUserInput to clear signatures
    const onUserInput = useCallback(
        (field: Field, typedValue: string) => {
            setSignatureData(null)
            return _onUserInput(field, typedValue)
        },
        [_onUserInput]
    )

    const onLiquidityPercentInput = useCallback(
        (typedValue: string): void => onUserInput(Field.LIQUIDITY_PERCENT, typedValue),
        [onUserInput]
    )
    const onLiquidityInput = useCallback((typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue), [
        onUserInput
    ])
    const onCurrencyAInput = useCallback((typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue), [
        onUserInput
    ])
    const onCurrencyBInput = useCallback((typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue), [
        onUserInput
    ])

    // tx sending
    const addTransaction = useTransactionAdder()
    async function onRemove() {
        if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
        const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
        if (!currencyAmountA || !currencyAmountB) {
            throw new Error('missing currency amounts')
        }
        const router = getRouterContract(chainId, library, account)

        const amountsMin = {
            [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
            [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0]
        }

        if (!currencyA || !currencyB) throw new Error('missing tokens')
        const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
        if (!liquidityAmount) throw new Error('missing liquidity amount')

        const currencyBIsETH = currencyB === ETHER
        const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH

        if (!tokenA || !tokenB) throw new Error('could not wrap')

        let methodNames: string[], args: Array<string | string[] | number | boolean>
        // we have approval, use normal remove liquidity
        if (approval === ApprovalState.APPROVED) {
            // removeLiquidityETH
            if (oneCurrencyIsETH) {
                methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
                args = [
                    currencyBIsETH ? tokenA.address : tokenB.address,
                    liquidityAmount.raw.toString(),
                    amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
                    amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
                    account,
                    deadline.toHexString()
                ]
            }
            // removeLiquidity
            else {
                methodNames = ['removeLiquidity']
                args = [
                    tokenA.address,
                    tokenB.address,
                    liquidityAmount.raw.toString(),
                    amountsMin[Field.CURRENCY_A].toString(),
                    amountsMin[Field.CURRENCY_B].toString(),
                    account,
                    deadline.toHexString()
                ]
            }
        }
        // we have a signataure, use permit versions of remove liquidity
        else if (signatureData !== null) {
            // removeLiquidityETHWithPermit
            if (oneCurrencyIsETH) {
                methodNames = [
                    'removeLiquidityETHWithPermit',
                    'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'
                ]
                args = [
                    currencyBIsETH ? tokenA.address : tokenB.address,
                    liquidityAmount.raw.toString(),
                    amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
                    amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
                    account,
                    signatureData.deadline,
                    false,
                    signatureData.v,
                    signatureData.r,
                    signatureData.s
                ]
            }
            // removeLiquidityETHWithPermit
            else {
                methodNames = ['removeLiquidityWithPermit']
                args = [
                    tokenA.address,
                    tokenB.address,
                    liquidityAmount.raw.toString(),
                    amountsMin[Field.CURRENCY_A].toString(),
                    amountsMin[Field.CURRENCY_B].toString(),
                    account,
                    signatureData.deadline,
                    false,
                    signatureData.v,
                    signatureData.r,
                    signatureData.s
                ]
            }
        } else {
            throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
        }

        const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
            methodNames.map(methodName =>
                router.estimateGas[methodName](...args)
                    .then(calculateGasMargin)
                    .catch(error => {
                        console.error(`estimateGas failed`, methodName, args, error)
                        return undefined
                    })
            )
        )

        const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
            BigNumber.isBigNumber(safeGasEstimate)
        )

        // all estimations failed...
        if (indexOfSuccessfulEstimation === -1) {
            console.error('This transaction would fail. Please contact support.')
        } else {
            const methodName = methodNames[indexOfSuccessfulEstimation]
            const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

            setAttemptingTxn(true)
            await router[methodName](...args, {
                gasLimit: safeGasEstimate
            })
                .then((response: TransactionResponse) => {
                    setAttemptingTxn(false)

                    addTransaction(response, {
                        summary:
                            'Remove ' +
                            parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
                            ' ' +
                            currencyA?.getSymbol(chainId) +
                            ' and ' +
                            parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
                            ' ' +
                            currencyB?.getSymbol(chainId)
                    })

                    setTxHash(response.hash)

                    ReactGA.event({
                        category: 'Liquidity',
                        action: 'Remove',
                        label: [currencyA?.getSymbol(chainId), currencyB?.getSymbol(chainId)].join('/')
                    })
                })
                .catch((error: Error) => {
                    setAttemptingTxn(false)
                    // we only care if the error is something _other_ than the user rejected the tx
                    console.error(error)
                })
        }
    }

    function modalHeader() {
        return (
            <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
                <RowBetween align="flex-end">
                    <Text fontSize={24} fontWeight={500}>
                        {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
                    </Text>
                    <RowFixed gap="4px">
                        <CurrencyLogo currency={currencyA} size={'24px'} />
                        <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
                            {currencyA?.getSymbol(chainId)}
                        </Text>
                    </RowFixed>
                </RowBetween>
                <RowFixed>
                    <Plus size="16" color={theme.text2} />
                </RowFixed>
                <RowBetween align="flex-end">
                    <Text fontSize={24} fontWeight={500}>
                        {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
                    </Text>
                    <RowFixed gap="4px">
                        <CurrencyLogo currency={currencyB} size={'24px'} />
                        <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
                            {currencyB?.getSymbol(chainId)}
                        </Text>
                    </RowFixed>
                </RowBetween>

                <TYPE.italic fontSize={14} className="text-gray-500" textAlign="left" padding={'20px 0 20px 0'}>
                    {`Output is estimated. If the price changes by more than ${allowedSlippage /
                        100}% your transaction will revert.`}
                </TYPE.italic>
            </AutoColumn>
        )
    }

    function modalBottom() {
        return (
            <>
                <RowBetween>
                    <Text color={theme.text2} fontWeight={500} fontSize={16}>
                        {'SUSHI ' + currencyA?.getSymbol(chainId) + '/' + currencyB?.getSymbol(chainId)} Burned
                    </Text>
                    <RowFixed>
                        <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} />
                        <Text fontWeight={500} fontSize={16}>
                            {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
                        </Text>
                    </RowFixed>
                </RowBetween>
                {pair && (
                    <>
                        <RowBetween>
                            <Text color={theme.text2} fontWeight={500} fontSize={16}>
                                Price
                            </Text>
                            <Text fontWeight={500} fontSize={16} color={theme.text1}>
                                1 {currencyA?.getSymbol(chainId)} ={' '}
                                {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.getSymbol(chainId)}
                            </Text>
                        </RowBetween>
                        <RowBetween>
                            <div />
                            <Text fontWeight={500} fontSize={16} color={theme.text1}>
                                1 {currencyB?.getSymbol(chainId)} ={' '}
                                {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.getSymbol(chainId)}
                            </Text>
                        </RowBetween>
                    </>
                )}
                <ButtonPrimary
                    disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
                    onClick={onRemove}
                >
                    <Text fontWeight={500} fontSize={20}>
                        Confirm
                    </Text>
                </ButtonPrimary>
            </>
        )
    }

    const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencyA?.getSymbol(
        chainId
    )} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.getSymbol(chainId)}`

    const liquidityPercentChangeCallback = useCallback(
        (value: number) => {
            onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
        },
        [onUserInput]
    )

    const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
    const oneCurrencyIsWETH = Boolean(
        chainId &&
            ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
                (currencyB && currencyEquals(WETH[chainId], currencyB)))
    )

    const handleSelectCurrencyA = useCallback(
        (currency: Currency) => {
            if (currencyIdB && currencyId(currency) === currencyIdB) {
                history.push(`/remove/${currencyId(currency)}/${currencyIdA}`)
            } else {
                history.push(`/remove/${currencyId(currency)}/${currencyIdB}`)
            }
        },
        [currencyIdA, currencyIdB, history]
    )
    const handleSelectCurrencyB = useCallback(
        (currency: Currency) => {
            if (currencyIdA && currencyId(currency) === currencyIdA) {
                history.push(`/remove/${currencyIdB}/${currencyId(currency)}`)
            } else {
                history.push(`/remove/${currencyIdA}/${currencyId(currency)}`)
            }
        },
        [currencyIdA, currencyIdB, history]
    )

    const handleDismissConfirmation = useCallback(() => {
        setShowConfirm(false)
        setSignatureData(null) // important that we clear signature data to avoid bad sigs
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onUserInput(Field.LIQUIDITY_PERCENT, '0')
        }
        setTxHash('')
    }, [onUserInput, txHash])

    const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
        Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
        liquidityPercentChangeCallback
    )

    return (
        <>
            <Helmet>
                <title>Remove Liquidity | Sushi</title>
            </Helmet>

            <div className="w-full max-w-2xl mb-5 px-4">
                <NavLink
                    className="text-center text-secondary hover:text-high-emphesis text-base font-medium"
                    to={'/pool'}
                >
                    View Your Liquidity Positions &gt;
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
            <div className="bg-dark-900 w-full max-w-2xl rounded  shadow-liquidity-purple-glow">
                <Header input={currencyA} output={currencyB} />
                <Wrapper>
                    <TransactionConfirmationModal
                        isOpen={showConfirm}
                        onDismiss={handleDismissConfirmation}
                        attemptingTxn={attemptingTxn}
                        hash={txHash ? txHash : ''}
                        content={() => (
                            <ConfirmationModalContent
                                title={'You will receive'}
                                onDismiss={handleDismissConfirmation}
                                topContent={modalHeader}
                                bottomContent={modalBottom}
                            />
                        )}
                        pendingText={pendingText}
                    />
                    <AutoColumn gap="md">
                        <Alert
                            showIcon={false}
                            message={
                                <>
                                    <b>Tip:</b> Removing pool tokens converts your position back into underlying tokens
                                    at the current rate, proportional to your share of the pool. Accrued fees are
                                    included in the amounts you receive.
                                </>
                            }
                            type="information"
                        />

                        <LiquidityHeader input={currencyA} output={currencyB} />
                        <PercentInputPanel
                            value={formattedAmounts[Field.LIQUIDITY_PERCENT]}
                            onUserInput={onLiquidityPercentInput}
                            id="liquidity-percent"
                        />
                        <AutoColumn justify="space-between">
                            <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                                <button className="bg-dark-900 rounded-full p-3px -mt-6 -mb-6 z-10">
                                    <div className="bg-dark-800 hover:bg-dark-700 rounded-full p-3">
                                        <ArrowDown size="32" color={theme.text2} />
                                    </div>
                                </button>
                            </AutoRow>
                        </AutoColumn>
                        <RemoveLiquidityReceiveDetails
                            currencyA={currencyA}
                            amountA={formattedAmounts[Field.CURRENCY_A] || '-'}
                            currencyB={currencyB}
                            amountB={formattedAmounts[Field.CURRENCY_B] || '-'}
                            hasWETH={oneCurrencyIsWETH}
                            hasETH={oneCurrencyIsETH}
                            id="liquidity-receive"
                        />
                        {currencyA && currencyB && pair && (
                            <LiquidityPrice input={currencyA} output={currencyB} price={price} />
                        )}
                        <div style={{ position: 'relative' }}>
                            {!account ? (
                                <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
                            ) : (
                                <RowBetween>
                                    <ButtonConfirmed
                                        onClick={onAttemptToApprove}
                                        confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                                        disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                                        mr="0.5rem"
                                        fontWeight={500}
                                        fontSize={16}
                                    >
                                        {approval === ApprovalState.PENDING ? (
                                            <Dots>Approving</Dots>
                                        ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                                            'Approved'
                                        ) : (
                                            'Approve'
                                        )}
                                    </ButtonConfirmed>
                                    <ButtonError
                                        onClick={() => {
                                            setShowConfirm(true)
                                        }}
                                        disabled={
                                            !isValid || (signatureData === null && approval !== ApprovalState.APPROVED)
                                        }
                                        error={
                                            !isValid &&
                                            !!parsedAmounts[Field.CURRENCY_A] &&
                                            !!parsedAmounts[Field.CURRENCY_B]
                                        }
                                    >
                                        <Text fontSize={16} fontWeight={500}>
                                            {error || 'Confirm Withdrawal'}
                                        </Text>
                                    </ButtonError>
                                </RowBetween>
                            )}
                        </div>
                    </AutoColumn>
                </Wrapper>
            </div>

            {/* <div className="w-full max-w-2xl flex flex-col mt-4">
                <AdvancedLiquidityDetailsDropdown show={Boolean(typedValue && parseInt(typedValue))} />
            </div> */}
            {pair ? (
                // <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
                //     <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                // </AutoColumn>
                <div className="w-full max-w-2xl flex flex-col">
                    <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                </div>
            ) : null}
        </>
    )
}
