import { BigNumber } from '@ethersproject/bignumber'
import { Token, TokenAmount, WETH } from '@sushiswap/sdk'
import { Input as NumericalInput } from 'components/NumericalInput'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Alert, Button, Dots, TransactionReviewView } from 'kashi/components'
import WarningsView from 'kashi/components/Warnings'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { KashiContext } from 'kashi/context'
import { KashiCooker, TransactionReview, Warning, Warnings } from 'kashi/entities'
import { toAmount, toShare } from 'kashi/functions/bentobox'
import { e10, maximum, minimum, ZERO } from 'kashi/functions/math'
import { BentoApprovalState, useKashiApproveCallback } from 'kashi/hooks'
import React, { useContext, useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'react-feather'
import { useKashiApprovalPending } from 'state/application/hooks'
import { formattedNum } from 'utils'

interface RepayProps {
    pair: any
}

export default function Repay({ pair }: RepayProps) {
    const { account, chainId } = useActiveWeb3React()
    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback(
        KASHI_ADDRESS
    )
    const pendingApprovalMessage = useKashiApprovalPending()

    // State
    const [useBentoRepay, setUseBentoRepayAsset] = useState<boolean>(pair.asset.bentoBalance.gt(0))
    const [useBentoRemove, setUseBentoRemoveCollateral] = useState<boolean>(true)

    const [repayValue, setRepayAssetValue] = useState('')
    const [removeValue, setRemoveCollateralValue] = useState('')
    const [updateOracle, setUpdateOracle] = useState(false)
    const [pinRemoveMax, setPinRemoveMax] = useState(false)
    const [pinRepayMax, setPinRepayMax] = useState(false)

    const info = useContext(KashiContext).state.info

    // Calculated
    const assetNative = WETH[chainId || 1].address == pair.asset.address

    const balance = useBentoRepay
        ? toAmount(pair.asset, pair.asset.bentoBalance)
        : assetNative
        ? info?.ethBalance
        : pair.asset.balance

    const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

    const displayRepayValue = pinRepayMax
        ? minimum(pair.currentUserBorrowAmount.value, balance).toFixed(pair.asset.decimals)
        : repayValue

    const [approvalState, approve] = useApproveCallback(
        new TokenAmount(
            new Token(chainId || 1, pair.asset.address, pair.asset.decimals, pair.asset.symbol, pair.asset.name),
            displayRepayValue.toBigNumber(pair.asset.decimals).toString()
        ),
        BENTOBOX_ADDRESS
    )

    const nextUserBorrowAmount = pair.currentUserBorrowAmount.value.sub(
        displayRepayValue.toBigNumber(pair.asset.decimals)
    )

    const nextMinCollateralOracle = nextUserBorrowAmount.muldiv(pair.oracleExchangeRate, e10(16).mul('75'))
    const nextMinCollateralSpot = nextUserBorrowAmount.muldiv(pair.spotExchangeRate, e10(16).mul('75'))
    const nextMinCollateralStored = nextUserBorrowAmount.muldiv(
        displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate,
        e10(16).mul('75')
    )
    const nextMinCollateralMinimum = maximum(nextMinCollateralOracle, nextMinCollateralSpot, nextMinCollateralStored)
    const nextMaxRemoveCollateral = maximum(
        pair.userCollateralAmount.value.sub(nextMinCollateralMinimum.mul(100).div(95)),
        ZERO
    )
    const maxRemoveCollateral = nextMaxRemoveCollateral.toFixed(pair.collateral.decimals)

    const displayRemoveValue = pinRemoveMax ? maxRemoveCollateral : removeValue

    const nextUserCollateralAmount = pair.userCollateralAmount.value.sub(
        displayRemoveValue.toBigNumber(pair.collateral.decimals)
    )

    const nextMaxBorrowableOracle = nextUserCollateralAmount.muldiv(e10(16).mul('75'), pair.oracleExchangeRate)
    const nextMaxBorrowableSpot = nextUserCollateralAmount.muldiv(e10(16).mul('75'), pair.spotExchangeRate)
    const nextMaxBorrowableStored = nextUserCollateralAmount.muldiv(
        e10(16).mul('75'),
        displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate
    )
    const nextMaxBorrowMinimum = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
    const nextMaxBorrowSafe = nextMaxBorrowMinimum.muldiv('95', '100').sub(pair.currentUserBorrowAmount.value)
    const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

    const maxBorrow = nextMaxBorrowPossible.toFixed(pair.asset.decimals)

    const nextHealth = pair.currentUserBorrowAmount.value
        .sub(displayRepayValue.toBigNumber(pair.asset.decimals))
        .muldiv(BigNumber.from('1000000000000000000'), nextMaxBorrowMinimum)

    const transactionReview = new TransactionReview()
    if (displayRepayValue || displayRemoveValue) {
        transactionReview.addTokenAmount(
            'Borrow Limit',
            pair.maxBorrowable.safe.value,
            nextMaxBorrowSafe.add(displayRepayValue.toBigNumber(pair.asset.decimals)),
            pair.asset
        )
        transactionReview.addPercentage('Health', pair.health.value, nextHealth)
    }

    const warnings = new Warnings()
        .add(
            assetNative && !useBentoRepay && pinRepayMax,
            `You cannot MAX repay ${pair.asset.symbol} directly from your wallet. Please deposit your ${pair.asset.symbol} into the BentoBox first, then repay. Because your debt is slowly accrueing interest we can't predict how much it will be once your transaction gets mined.`,
            true
        )
        .add(
            displayRemoveValue.toBigNumber(pair.collateral.decimals).gt(pair.userCollateralAmount.value),
            'You have insufficient collateral. Please enter a smaller amount or repay more.',
            true
        )
        .add(
            displayRepayValue.toBigNumber(pair.asset.decimals).gt(pair.currentUserBorrowAmount.value),
            "You can't repay more than you owe. To fully repay, please click the 'max' button.",
            true,
            new Warning(
                balance?.lt(displayRepayValue.toBigNumber(pair.asset.decimals)),
                `Please make sure your ${
                    useBentoRepay ? 'BentoBox' : 'wallet'
                } balance is sufficient to repay and then try again.`,
                true
            )
        )
        .add(
            displayRemoveValue
                .toBigNumber(pair.collateral.decimals)
                .gt(maximum(pair.userCollateralAmount.value.sub(nextMinCollateralMinimum), ZERO)),
            'Removing this much collateral would put you into insolvency.',
            true,
            new Warning(
                displayRemoveValue.toBigNumber(pair.collateral.decimals).gt(nextMaxRemoveCollateral),
                'Removing this much collateral would put you very close to insolvency.',
                false
            )
        )

    // Handlers
    async function onExecute(cooker: KashiCooker) {
        let summary = ''
        if (pinRepayMax && pair.userBorrowPart.gt(0) && balance.gte(pair.currentUserBorrowAmount.value)) {
            cooker.repayPart(pair.userBorrowPart, useBentoRepay)
            summary = 'Repay Max'
        } else if (displayRepayValue.toBigNumber(pair.asset.decimals).gt(0)) {
            cooker.repay(displayRepayValue.toBigNumber(pair.asset.decimals), useBentoRepay)
            summary = 'Repay'
        }
        if (
            displayRemoveValue.toBigNumber(pair.collateral.decimals).gt(0) ||
            (pinRemoveMax && pair.userCollateralShare.gt(0))
        ) {
            const share =
                pinRemoveMax &&
                (nextUserBorrowAmount.isZero() ||
                    (pinRepayMax && pair.userBorrowPart.gt(0) && balance.gte(pair.currentUserBorrowAmount.value)))
                    ? pair.userCollateralShare
                    : toShare(pair.collateral, displayRemoveValue.toBigNumber(pair.collateral.decimals))

            cooker.removeCollateral(share, useBentoRemove)
            summary += (summary ? ' and ' : '') + 'Remove Collateral'
        }
        setPinRemoveMax(false)
        setRemoveCollateralValue('')
        setRepayAssetValue('')
        return summary
    }

    const showApprove =
        chainId &&
        pair.asset.address !== WETH[chainId].address &&
        !useBentoRepay &&
        displayRepayValue &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

    const removeValueSet =
        !displayRemoveValue.toBigNumber(pair.collateral.decimals).isZero() ||
        (pinRemoveMax && pair.userCollateralShare.gt(ZERO))
    const repayValueSet = !displayRepayValue.toBigNumber(pair.asset.decimals).isZero()

    let actionName = 'Nothing to do'
    if (removeValueSet) {
        if (repayValueSet) {
            actionName = 'Repay and remove collateral'
        } else {
            actionName = 'Remove collateral'
        }
    } else if (repayValueSet) {
        actionName = 'Repay'
    }

    return (
        <>
            <div className="text-3xl text-high-emphesis mt-6 mb-4">Repay {pair.asset.symbol}</div>

            <div className="flex items-center justify-between my-4">
                <div className="flex items-center text-base text-secondary">
                    <span>
                        <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span className="mx-2"> Repay {pair.asset.symbol} trom </span>
                    <span>
                        <Button
                            variant="outlined"
                            color="pink"
                            size="small"
                            className="focus:ring focus:ring-pink"
                            onClick={() => {
                                setUseBentoRepayAsset(!useBentoRepay)
                            }}
                        >
                            {useBentoRepay ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary text-right" style={{ display: 'inline', cursor: 'pointer' }}>
                    Balance: {formattedNum(balance.toFixed(pair.asset.decimals))}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={displayRepayValue}
                    onUserInput={setRepayAssetValue}
                    onFocus={() => {
                        setRepayAssetValue('')
                        setPinRepayMax(false)
                    }}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="pink"
                        size="small"
                        onClick={() => {
                            setPinRepayMax(true)
                        }}
                        className="absolute right-4 focus:ring focus:ring-pink"
                    >
                        MAX
                    </Button>
                )}
            </div>

            <div className="flex items-center justify-between my-4">
                <div className="flex items-center text-base text-secondary">
                    <span>
                        <ArrowUpRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span className="mx-2">Remove {pair.collateral.symbol} to</span>
                    <span>
                        <Button
                            variant="outlined"
                            color="pink"
                            size="small"
                            className="focus:ring focus:ring-pink"
                            onClick={() => {
                                setUseBentoRemoveCollateral(!useBentoRemove)
                            }}
                        >
                            {useBentoRemove ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary text-right" style={{ display: 'inline', cursor: 'pointer' }}>
                    Max: {formattedNum(maxRemoveCollateral)}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={displayRemoveValue}
                    onUserInput={setRemoveCollateralValue}
                    onFocus={() => {
                        setRemoveCollateralValue(displayRemoveValue)
                        setPinRemoveMax(false)
                    }}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="pink"
                        size="small"
                        onClick={() => setPinRemoveMax(true)}
                        className="absolute right-4 focus:ring focus:ring-pink"
                    >
                        MAX
                    </Button>
                )}
            </div>

            <WarningsView warnings={warnings}></WarningsView>
            <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

            {approveKashiFallback && (
                <Alert
                    message="Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used."
                    className="mb-4"
                />
            )}

            {showApprove && (
                <Button color="pink" onClick={approve} className="mb-4">
                    {approvalState === ApprovalState.PENDING ? (
                        <Dots>Approving {pair.asset.symbol}</Dots>
                    ) : (
                        `Approve ${pair.asset.symbol}`
                    )}
                </Button>
            )}

            {!showApprove && (
                <>
                    {(kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
                        kashiApprovalState === BentoApprovalState.PENDING) &&
                        !kashiPermit && (
                            <Button color="pink" onClick={onApprove} className="mb-4">
                                {kashiApprovalState === BentoApprovalState.PENDING ? (
                                    <Dots>{pendingApprovalMessage}</Dots>
                                ) : (
                                    `Approve Kashi`
                                )}
                            </Button>
                        )}

                    {(kashiApprovalState === BentoApprovalState.APPROVED || kashiPermit) && (
                        <Button
                            color="pink"
                            onClick={() => onCook(pair, onExecute)}
                            disabled={
                                (displayRepayValue.toBigNumber(pair.asset.decimals).lte(0) &&
                                    displayRemoveValue.toBigNumber(pair.collateral.decimals).lte(0) &&
                                    (!pinRemoveMax || pair.userCollateralShare.isZero())) ||
                                warnings.some(warning => warning.breaking)
                            }
                        >
                            {actionName}
                        </Button>
                    )}
                </>
            )}
        </>
    )
}
