import React, { useState } from 'react'
import { Alert, Button, TransactionReviewView, Dots } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight, ArrowUpRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { minimum, e10 } from 'kashi/functions/math'
import { Warnings, TransactionReview, KashiCooker } from 'kashi/entities'
import { KASHI_ADDRESS, BENTOBOX_ADDRESS } from 'kashi/constants'
import { useKashiApproveCallback, BentoApprovalState } from 'kashi/hooks'
import { useKashiApprovalPending } from 'state/application/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Token, TokenAmount, WETH } from '@sushiswap/sdk'

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
    const [useBentoRepayAsset, setUseBentoRepayAsset] = useState<boolean>(pair.collateral.bentoBalance.gt(0))
    const [useBentoRemoveCollateral, setUseBentoRemoveCollateral] = useState<boolean>(true)

    const [repayAssetValue, setRepayAssetValue] = useState('0')
    const [removeCollateralValue, setRemoveCollateralValue] = useState('')
    const [pendingTx, setPendingTx] = useState(false)

    const [approvalState, approve] = useApproveCallback(
        new TokenAmount(
            new Token(chainId || 1, pair.asset.address, pair.asset.decimals, pair.asset.symbol, pair.asset.name),
            repayAssetValue.toBigNumber(pair.asset.decimals).toString()
        ),
        BENTOBOX_ADDRESS
    )

    // Calculated
    const balance = useBentoRepayAsset ? pair.asset.bentoBalance : pair.asset.balance

    const nextMaxBorrowableOracle = pair.userCollateralAmount.value
        .sub(removeCollateralValue.toBigNumber(pair.collateral.decimals))
        .muldiv(e10(16).mul('75'), pair.oracleExchangeRate)

    const nextMaxBorrowableSpot = pair.userCollateralAmount.value
        .sub(removeCollateralValue.toBigNumber(pair.collateral.decimals))
        .muldiv(e10(16).mul('75'), pair.spotExchangeRate)

    const nextMaxBorrowableStored = pair.userCollateralAmount.value
        .sub(removeCollateralValue.toBigNumber(pair.collateral.decimals))
        .muldiv(e10(16).mul('75'), pair.currentExchangeRate)

    const nextMaxBorrowMinimum = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
    const nextMaxBorrowSafe = nextMaxBorrowMinimum.muldiv('95', '100').sub(pair.currentUserBorrowAmount.value)
    const nextMaxBorrowPossible = minimum(nextMaxBorrowSafe, pair.totalAssetAmount.value)

    const nextHealth = pair.currentUserBorrowAmount.value
        .sub(repayAssetValue.toBigNumber(pair.asset.decimals))
        .muldiv(BigNumber.from('1000000000000000000'), nextMaxBorrowMinimum)

    const transactionReview = new TransactionReview()

    if (repayAssetValue || removeCollateralValue) {
        transactionReview.addTokenAmount('Borrow Limit', pair.maxBorrowable.safe.value, nextMaxBorrowSafe, pair.asset)
        transactionReview.addPercentage('Health', pair.health.value, nextHealth)
    }

    const warnings = new Warnings()
        .add(pair.currentExchangeRate.isZero(), 'Oracle exchange rate has NOT been set', true)
        .add(
            pair.userCollateralAmount.value.isZero(),
            'You have insufficient collateral. Please enter a smaller amount, add more collateral, or repay now.',
            true
        )

    const maxRepayAsset = balance.sub(pair.currentUserBorrowAmount.value).gte(0)
        ? pair.currentUserBorrowAmount.string
        : balance.toFixed(pair.asset.decimals)

    const nextUserCollateralAmount = pair.userCollateralAmount.value.sub(
        removeCollateralValue.toBigNumber(pair.collateral.decimals)
    )

    const maxRemoveCollateral = nextUserCollateralAmount.gt(0)
        ? nextUserCollateralAmount
              .sub(
                  nextUserCollateralAmount
                      .mul(
                          nextMaxBorrowSafe.sub(
                              nextMaxBorrowPossible.sub(
                                  pair.currentUserBorrowAmount.value.sub(
                                      repayAssetValue.toBigNumber(pair.asset.decimals)
                                  )
                              )
                          )
                      )
                      .div(nextMaxBorrowSafe)
              )
              .toFixed(pair.collateral.decimals)
        : '0'

    // Handlers
    async function onExecute(cooker: KashiCooker) {
        let summary = ""
        if (repayAssetValue.toBigNumber(pair.asset.decimals).gt(0)) {
            cooker.repay(repayAssetValue.toBigNumber(pair.asset.decimals), useBentoRepayAsset)
            summary = "Repay"
        }
        if (removeCollateralValue.toBigNumber(pair.collateral.decimals).gt(0)) {
            cooker.removeCollateral(
                removeCollateralValue.toBigNumber(pair.collateral.decimals),
                useBentoRemoveCollateral
            )
            summary += (summary ? " and " : "") + summary
        }
        return summary
    }

    const showApprove =
        chainId &&
        pair.asset.address !== WETH[chainId].address &&
        !useBentoRepayAsset &&
        repayAssetValue &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

    return (
        <>
            <div className="text-3xl text-high-emphesis mt-6 mb-4">Repay {pair.asset.symbol}</div>

            <div className="flex items-center justify-between my-4">
                <div className="flex items-center text-base text-secondary">
                    <span>
                        <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span className="mx-2"> Repay Asset &quot;{pair.asset.symbol}&quot; From </span>
                    <span>
                        <Button
                            variant="outlined"
                            color="pink"
                            className="focus:ring focus:ring-pink"
                            onClick={() => {
                                setUseBentoRepayAsset(!useBentoRepayAsset)
                            }}
                        >
                            {useBentoRepayAsset ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
                    Balance: {balance.toFixed(pair.asset.decimals)}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={repayAssetValue}
                    onUserInput={setRepayAssetValue}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="pink"
                        onClick={() => {
                            setRepayAssetValue(maxRepayAsset)
                        }}
                        className="absolute right-4 focus:ring focus:ring-pink"
                    >
                        MAX
                    </Button>
                )}
            </div>

            {showApprove && (
                <Button color="pink" onClick={approve} className="mb-4">
                    {approvalState === ApprovalState.PENDING ? (
                        <Dots>Approving {pair.asset.symbol}</Dots>
                    ) : (
                        `Approve ${pair.asset.symbol}`
                    )}
                </Button>
            )}

            <div className="flex items-center justify-between my-4">
                <div className="flex items-center text-base text-secondary">
                    <span>
                        <ArrowUpRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span className="mx-2">Remove Collateral &quot;{pair.collateral.symbol}&quot; To</span>
                    <span>
                        <Button
                            variant="outlined"
                            color="pink"
                            className="focus:ring focus:ring-pink"
                            onClick={() => {
                                setUseBentoRemoveCollateral(!useBentoRemoveCollateral)
                            }}
                        >
                            {useBentoRemoveCollateral ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
                    Max: {maxRemoveCollateral}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={removeCollateralValue}
                    onUserInput={setRemoveCollateralValue}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="pink"
                        onClick={() => setRemoveCollateralValue(maxRemoveCollateral)}
                        className="absolute right-4 focus:ring focus:ring-pink"
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
                        pendingTx ||
                        (balance.eq(0) && pair.userCollateralAmount.eq(0)) ||
                        (repayAssetValue.toBigNumber(pair.asset.decimals).lte(0) &&
                            removeCollateralValue.toBigNumber(pair.collateral.decimals).lte(0)) ||
                        warnings.some(warning => warning.breaking)
                    }
                >
                    Repay
                </Button>
            )}
        </>
    )
}
