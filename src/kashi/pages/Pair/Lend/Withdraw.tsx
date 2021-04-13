import { Input as NumericalInput } from 'components/NumericalInput'
import { useActiveWeb3React } from 'hooks'
import { Alert, Button, Dots } from 'kashi/components'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KASHI_ADDRESS } from 'kashi/constants'
import { TransactionReview, Warnings } from 'kashi/entities'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import { easyAmount } from 'kashi/functions/kashi'
import { e10, minimum } from 'kashi/functions/math'
import { BentoApprovalState, useKashiApproveCallback } from 'kashi/hooks'
import React, { useState } from 'react'
import { ArrowUpRight } from 'react-feather'
import { useKashiApprovalPending } from 'state/application/hooks'
import { formattedNum } from 'utils'

export default function LendWithdrawAction({ pair }: any): JSX.Element {
    const { account, chainId } = useActiveWeb3React()
    const pendingApprovalMessage = useKashiApprovalPending()

    // State
    const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
    const [value, setValue] = useState('')
    const [pinMax, setPinMax] = useState(false)

    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback(
        KASHI_ADDRESS
    )

    // Calculated
    const displayValue = pinMax
        ? easyAmount(minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value), pair.asset).string
        : value

    const fraction = pinMax
        ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
        : value.toBigNumber(pair.asset.decimals).muldiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

    const warnings = new Warnings()
        .add(
            pair.currentUserAssetAmount.value.lt(value.toBigNumber(pair.asset.decimals)),
            `Please make sure your ${
                useBento ? 'BentoBox' : 'wallet'
            } balance is sufficient to withdraw and then try again.`,
            true
        )
        .add(
            pair.maxAssetAvailableFraction.lt(fraction),
            "The isn't enough liquidity available at the moment to withdraw this amount. Please try withdrawing less or later.",
            true
        )

    const transactionReview = new TransactionReview()
    if (displayValue && !warnings.broken) {
        const amount = displayValue.toBigNumber(pair.asset.decimals)
        const newUserAssetAmount = pair.currentUserAssetAmount.value.sub(amount)
        transactionReview.addTokenAmount('Balance', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
        transactionReview.addUSD('Balance USD', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)

        const newUtilization = e10(18).muldiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.sub(amount))
        transactionReview.addPercentage('Borrowed', pair.utilization.value, newUtilization)
    }

    // Handlers
    async function onExecute(cooker: KashiCooker) {
        const fraction = pinMax
            ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
            : value.toBigNumber(pair.asset.decimals).muldiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

        cooker.removeAsset(fraction, useBento)
        return `Withdraw ${pair.asset.symbol}`
    }

    return (
        <>
            <div className="text-3xl text-high-emphesis mt-6">Withdraw {pair.asset.symbol}</div>

            <div className="flex justify-between my-4">
                <div className="text-base text-secondary">
                    <span>
                        <ArrowUpRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span> to </span>
                    <span>
                        <Button
                            variant="outlined"
                            color="blue"
                            size="small"
                            className="focus:ring focus:ring-blue"
                            onClick={() => {
                                setUseBento(!useBento)
                            }}
                        >
                            {useBento ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
                    Balance: {formattedNum(pair.currentUserAssetAmount.string)} {pair.asset.symbol}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-blue"
                    value={displayValue}
                    onUserInput={setValue}
                    onFocus={() => {
                        setValue(displayValue)
                        setPinMax(false)
                    }}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="blue"
                        size="small"
                        onClick={() => setPinMax(true)}
                        className="absolute right-4 focus:ring focus:ring-blue"
                    >
                        MAX
                    </Button>
                )}
            </div>

            {warnings.map((warning, i) => (
                <Alert
                    key={i}
                    type={warning.breaking ? 'error' : 'warning'}
                    message={warning.message}
                    className="mb-4"
                />
            ))}

            <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

            {approveKashiFallback && (
                <Alert
                    message="Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used."
                    className="mb-4"
                />
            )}

            {(kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
                kashiApprovalState === BentoApprovalState.PENDING) &&
                !kashiPermit && (
                    <Button color="blue" onClick={onApprove} className="mb-4">
                        {kashiApprovalState === BentoApprovalState.PENDING ? (
                            <Dots>{pendingApprovalMessage}</Dots>
                        ) : (
                            `Approve Kashi`
                        )}
                    </Button>
                )}

            {(kashiApprovalState === BentoApprovalState.APPROVED || kashiPermit) && (
                <Button
                    color="blue"
                    onClick={() => onCook(pair, onExecute)}
                    disabled={displayValue.toBigNumber(pair.asset.decimals).lte(0) || warnings.broken}
                >
                    Withdraw
                </Button>
            )}
        </>
    )
}
