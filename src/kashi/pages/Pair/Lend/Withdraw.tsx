import React, { useState } from 'react'
import { Button } from 'components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { useActiveWeb3React } from 'hooks'
import { e10, minimum } from 'kashi/functions/math'
import { easyAmount } from 'kashi/functions/kashi'
import { TransactionReview, Warnings } from 'kashi/entities'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KASHI_ADDRESS } from '../../../constants'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import { useKashiApprovalPending } from 'state/application/hooks'
import { useKashiApproveCallback, BentoApprovalState } from 'kashi/hooks'
import { formattedNum } from 'utils'
import SmartNumberInput from 'kashi/components/SmartNumberInput'
import WarningsView from 'kashi/components/Warnings'
import { KashiApproveButton } from 'kashi/components/Button'

export default function LendWithdrawAction({ pair }: any): JSX.Element {
    const { account } = useActiveWeb3React()
    const pendingApprovalMessage = useKashiApprovalPending()

    // State
    const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
    const [value, setValue] = useState('')
    const [pinMax, setPinMax] = useState(false)

    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback()

    // Calculated
    const max = minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value)
    const displayValue = pinMax ? max.toFixed(pair.asset.decimals) : value

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

            <SmartNumberInput
                color="blue"
                token={pair.asset}
                value={displayValue}
                setValue={setValue}
                useBentoTitleDirection="up"
                useBentoTitle="to"
                useBento={useBento}
                setUseBento={setUseBento}
                max={max}
                pinMax={pinMax}
                setPinMax={setPinMax}
                showMax={true}
            />

            <WarningsView warnings={warnings} />
            <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

            <KashiApproveButton
                color="blue"
                content={(onCook: any) => (
                    <Button
                        onClick={() => onCook(pair, onExecute)}
                        disabled={displayValue.toBigNumber(pair.asset.decimals).lte(0) || warnings.broken}
                    >
                        Withdraw
                    </Button>
                )}
            />
        </>
    )
}
