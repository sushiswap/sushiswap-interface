import React, { useState } from 'react'
import { Alert, Button, Dots } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowUpRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { useApproveCallback, ApprovalState } from 'hooks/useApproveCallback'
import { e10, minimum } from 'kashi/functions/math'
import { easyAmount } from 'kashi/functions/kashi'
import { TransactionReview, Warnings } from 'kashi/entities'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import { Token, TokenAmount, WETH } from '@sushiswap/sdk'
import { useKashiApprovalPending } from 'state/application/hooks'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { useKashiApproveCallback, BentoApprovalState } from 'kashi/hooks'

export default function LendWithdrawAction({ pair }: any): JSX.Element {
    const { account, chainId } = useActiveWeb3React()
    const pendingApprovalMessage = useKashiApprovalPending()

    // State
    const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
    const [value, setValue] = useState('')
    const [pinMax, setPinMax] = useState(false)

    const [approvalState, approve] = useApproveCallback(
        new TokenAmount(
            new Token(chainId || 1, pair.asset.address, pair.asset.decimals, pair.asset.symbol, pair.asset.name),
            value.toBigNumber(pair.asset.decimals).toString()
        ),
        BENTOBOX_ADDRESS
    )
    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback(
        KASHI_ADDRESS
    )

    // Calculated
    const displayValue = pinMax
        ? easyAmount(minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value), pair.asset).string
        : value

    const warnings = new Warnings()
        .add(pair.currentExchangeRate.isZero(), 'Oracle exchange rate has NOT been set', true)
        .add(
            pair.currentUserAssetAmount.value.lt(value.toBigNumber(pair.asset.decimals)),
            `Please make sure your ${
                useBento ? 'BentoBox' : 'wallet'
            } balance is sufficient to withdraw and then try again.`,
            true
        )

    const transactionReview = new TransactionReview()
    if (displayValue) {
        const amount = displayValue.toBigNumber(pair.asset.decimals)
        const newUserAssetAmount = pair.currentUserAssetAmount.value.sub(amount)
        transactionReview.addTokenAmount('Balance', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
        const newUtilization = e10(18).muldiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.sub(amount))
        transactionReview.addPercentage('Borrowed', pair.utilization.value, newUtilization)
    }

    // Handlers
    async function onExecute(cooker: KashiCooker) {
        const fraction = pinMax
            ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
            : value.toBigNumber(pair.asset.decimals).muldiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

        await cooker.removeAsset(fraction, useBento).cook()
    }

    return (
        <>
            <div className="text-3xl text-high-emphesis mt-6">Withdraw {pair.asset.symbol}</div>

            <div className="flex justify-between my-4">
                <div className="text-base text-secondary">
                    <span>
                        <ArrowUpRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span> Withdraw Asset &quot;{pair.asset.symbol}&quot; To </span>
                    <span>
                        <Button
                            variant="outlined"
                            color="blue"
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
                    Balance: {pair.currentUserAssetAmount.string}
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
                <>
                    {approvalState === ApprovalState.NOT_APPROVED ||
                        (approvalState === ApprovalState.PENDING && (
                            <Button color="blue" onClick={approve} className="mb-4">
                                {approvalState === ApprovalState.PENDING ? (
                                    <Dots>Approving {pair.asset.symbol}</Dots>
                                ) : (
                                    `Approve ${pair.asset.symbol}`
                                )}
                            </Button>
                        ))}

                    {!(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) && (
                        <Button
                            color="blue"
                            onClick={() => onCook(pair, onExecute)}
                            disabled={displayValue.toBigNumber(0).lte(0) || warnings.some(warning => warning.breaking)}
                        >
                            Withdraw
                        </Button>
                    )}
                </>
            )}
        </>
    )
}
