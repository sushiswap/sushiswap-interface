import React, { useContext, useState } from 'react'
import { Token, TokenAmount, WETH } from '@sushiswap/sdk'
import { Alert, Dots, Button, Checkbox } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight, ArrowUpRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { minimum, e10, ZERO, maximum } from 'kashi/functions/math'
import { TransactionReview } from 'kashi/entities/TransactionReview'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import QuestionHelper from 'components/QuestionHelper'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Warning, Warnings } from 'kashi/entities/Warnings'
import { useKashiApprovalPending } from 'state/application/hooks'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { useKashiApproveCallback, BentoApprovalState } from 'kashi/hooks'
import { formattedNum } from 'utils'
import { KashiContext } from 'kashi/context'
import WarningsView from 'kashi/components/Warnings'
import Badge from 'kashi/components/Badge'
import { MaxUint256 } from '@ethersproject/constants'
import { useTokenAllowance } from 'data/Allowances'

interface BorrowProps {
    pair: any
}

export default function Borrow({ pair }: BorrowProps) {
    const { account, chainId } = useActiveWeb3React()
    const pendingApprovalMessage = useKashiApprovalPending()
    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback(
        KASHI_ADDRESS
    )

    // State
    const [useBentoCollateral, setUseBentoCollateral] = useState<boolean>(pair.collateral.bentoBalance.gt(0))
    const [useBentoBorrow, setUseBentoBorrow] = useState<boolean>(true)
    const [collateralValue, setCollateralValue] = useState('')
    const [borrowValue, setBorrowValue] = useState('')
    const [updateOracle, setUpdateOracle] = useState(false)
    const [pinBorrowMax, setPinBorrowMax] = useState(false)

    const [swap, setSwap] = useState(false)

    const token = new Token(
        chainId || 1,
        pair.collateral.address,
        pair.collateral.decimals,
        pair.collateral.symbol,
        pair.collateral.name
    )

    const currentAllowance = useTokenAllowance(token, account ?? undefined, BENTOBOX_ADDRESS)

    const [approvalState, approve] = useApproveCallback(
        new TokenAmount(token, currentAllowance?.equalTo('0') ? MaxUint256.toString() : collateralValue),
        BENTOBOX_ADDRESS
    )

    const info = useContext(KashiContext).state.info

    // Calculated
    const assetNative = WETH[chainId || 1].address == pair.collateral.address
    const balance = useBentoCollateral
        ? pair.collateral.bentoBalance
        : assetNative
        ? info?.ethBalance
        : pair.collateral.balance
    const maxCollateral = (useBentoCollateral
        ? pair.collateral.bentoBalance
        : assetNative
        ? maximum(info?.ethBalance.sub(e10(17)) || ZERO, ZERO)
        : pair.collateral.balance
    ).toFixed(pair.collateral.decimals)

    const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

    const nextUserCollateralValue = pair.userCollateralAmount.value.add(
        collateralValue.toBigNumber(pair.collateral.decimals)
    )

    const nextMaxBorrowableOracle = nextUserCollateralValue.muldiv(e10(16).mul('75'), pair.oracleExchangeRate)
    const nextMaxBorrowableSpot = nextUserCollateralValue.muldiv(e10(16).mul('75'), pair.spotExchangeRate)
    const nextMaxBorrowableStored = nextUserCollateralValue.muldiv(
        e10(16).mul('75'),
        displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate
    )
    const nextMaxBorrowMinimum = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
    const nextMaxBorrowSafe = nextMaxBorrowMinimum.muldiv('95', '100').sub(pair.currentUserBorrowAmount.value)
    const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

    const maxBorrow = nextMaxBorrowPossible.toFixed(pair.asset.decimals)

    const displayBorrowValue = pinBorrowMax ? maxBorrow : borrowValue

    const nextBorrowValue = pair.currentUserBorrowAmount.value.add(displayBorrowValue.toBigNumber(pair.asset.decimals))
    const nextHealth = nextBorrowValue.muldiv('1000000000000000000', nextMaxBorrowMinimum)

    const collateralValueSet = !collateralValue.toBigNumber(pair.collateral.decimals).isZero()
    const borrowValueSet = !displayBorrowValue.toBigNumber(pair.asset.decimals).isZero()

    let actionName = 'Nothing to do'
    if (collateralValueSet) {
        if (borrowValueSet) {
            actionName = 'Add collateral and borrow'
        } else {
            actionName = 'Add collateral'
        }
    } else if (borrowValueSet) {
        actionName = 'Borrow'
    }

    const borrowAmount = displayBorrowValue.toBigNumber(pair.asset.decimals)

    const collateralWarnings = new Warnings().add(
        balance?.lt(collateralValue.toBigNumber(pair.collateral.decimals)),
        `Please make sure your ${
            useBentoCollateral ? 'BentoBox' : 'wallet'
        } balance is sufficient to deposit and then try again.`,
        true
    )

    const borrowWarnings = new Warnings()
        .add(
            nextMaxBorrowMinimum.lt(pair.currentUserBorrowAmount.value),
            'You have surpassed your borrow limit and may be liquidated at any moment. Repay now or add collateral!',
            true,
            new Warning(
                nextMaxBorrowSafe.lt(0),
                'You have surpassed your borrow limit and assets are at a high risk of liquidation.',
                true,
                new Warning(
                    displayBorrowValue.length > 0 &&
                        borrowAmount.gt(nextMaxBorrowMinimum.sub(pair.currentUserBorrowAmount.value)),
                    "You don't have enough collateral to borrow this amount.",
                    true,
                    new Warning(
                        displayBorrowValue.length > 0 && borrowAmount.gt(nextMaxBorrowSafe),
                        'You will surpass your borrow limit and assets will be at a high risk of liquidation.',
                        false
                    )
                )
            )
        )
        .add(
            displayBorrowValue.length > 0 &&
                pair.maxAssetAvailable.lt(displayBorrowValue.toBigNumber(pair.asset.decimals)),
            'Not enough liquidity in this pair.',
            true
        )

    const transactionReview = new TransactionReview()
    if (
        (collateralValue || displayBorrowValue) &&
        !collateralWarnings.broken &&
        (!borrowWarnings.broken || !displayBorrowValue)
    ) {
        if (collateralValueSet) {
            transactionReview.addTokenAmount(
                'Collateral',
                pair.userCollateralAmount.value,
                nextUserCollateralValue,
                pair.collateral
            )
            transactionReview.addUSD(
                'Collateral USD',
                pair.userCollateralAmount.value,
                nextUserCollateralValue,
                pair.collateral
            )
        }
        if (borrowValueSet) {
            transactionReview.addTokenAmount(
                'Borrowed',
                pair.currentUserBorrowAmount.value,
                nextBorrowValue,
                pair.asset
            )
            transactionReview.addUSD('Borrowed USD', pair.currentUserBorrowAmount.value, nextBorrowValue, pair.asset)
        }
        if (displayUpdateOracle) {
            transactionReview.addRate('Exchange Rate', pair.currentExchangeRate, pair.oracleExchangeRate, pair)
        }
        transactionReview.addTokenAmount(
            'Borrow Limit',
            pair.maxBorrowable.safe.value,
            nextMaxBorrowSafe.sub(displayBorrowValue.toBigNumber(pair.asset.decimals)),
            pair.asset
        )
        transactionReview.addPercentage('Limit Used', pair.health.value, nextHealth)
        transactionReview.addPercentage('Borrow APR', pair.interestPerYear.value, pair.currentInterestPerYear.value)
    }

    // Handlers
    function onLeverage() {
        //
    }

    const showApprove =
        chainId &&
        pair.collateral.address !== WETH[chainId].address &&
        !useBentoCollateral &&
        collateralValue &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

    async function onExecute(cooker: KashiCooker): Promise<string> {
        let summary = ''
        if (collateralValueSet) {
            cooker.addCollateral(collateralValue.toBigNumber(pair.collateral.decimals), useBentoCollateral)
            summary = 'Add collateral'
        }
        if (borrowValueSet) {
            if (displayUpdateOracle) {
                cooker.updateExchangeRate(true, ZERO, ZERO)
            }
            cooker.borrow(displayBorrowValue.toBigNumber(pair.asset.decimals), useBentoBorrow)
            summary += (summary ? ' and ' : '') + 'Borrow'
        }
        return summary
    }

    return (
        <>
            <div className="text-3xl text-high-emphesis mt-6 mb-4">Borrow {pair.asset.symbol}</div>

            <div className="flex items-center justify-between my-4">
                <div className="flex items-center text-base text-secondary">
                    <span>
                        <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span className="mx-2"> Add {pair.collateral.symbol} collateral from </span>
                    <span>
                        <Button
                            variant="outlined"
                            color="pink"
                            className="focus:ring focus:ring-pink"
                            onClick={() => {
                                setUseBentoCollateral(!useBentoCollateral)
                            }}
                        >
                            {useBentoCollateral ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary text-right">
                    Balance: {formattedNum(Math.max(0, balance.toFixed(pair.collateral.decimals)))}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={collateralValue}
                    onUserInput={setCollateralValue}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="pink"
                        onClick={() => setCollateralValue(maxCollateral)}
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
                    <span className="mx-2"> Borrow {pair.asset.symbol} to </span>
                    <span>
                        <Button
                            variant="outlined"
                            color="pink"
                            className="focus:ring focus:ring-pink"
                            onClick={() => {
                                setUseBentoBorrow(!useBentoBorrow)
                            }}
                        >
                            {useBentoBorrow ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary text-right">Max: {formattedNum(maxBorrow)}</div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={displayBorrowValue}
                    onUserInput={setBorrowValue}
                    onFocus={() => {
                        setBorrowValue(displayBorrowValue)
                        setPinBorrowMax(false)
                    }}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="pink"
                        onClick={() => {
                            setPinBorrowMax(true)
                        }}
                        className="absolute right-4 focus:ring focus:ring-pink"
                    >
                        MAX
                    </Button>
                )}
            </div>

            <WarningsView warnings={collateralWarnings}></WarningsView>
            <WarningsView warnings={borrowWarnings}></WarningsView>

            {borrowValueSet && (displayUpdateOracle || pair.currentExchangeRate.gt(pair.oracleExchangeRate)) && (
                <div className="flex items-center mb-4">
                    <Checkbox
                        color="pink"
                        checked={displayUpdateOracle}
                        disabled={pair.currentExchangeRate.isZero()}
                        onChange={event => setUpdateOracle(event.target.checked)}
                    />
                    <span className="text-primary ml-2 mr-1">Update exchange rate from the oracle</span>
                    <QuestionHelper
                        text={
                            pair.currentExchangeRate.gt(0)
                                ? 'The exchange rate from the oracle is only updated when needed. When the price in Kashi is different from the oracle, this may reduce the amount you can borrow. Updating the exchange rate from the oracle may increase your borrow limit.'
                                : 'The exchange rate has not been updated from the oracle yet in this market. If you borrow, it will be updated.'
                        }
                    />
                </div>
            )}

            <div className="flex items-center mb-4">
                <Checkbox
                    color="pink"
                    checked={swap}
                    onChange={event => setSwap(event.target.checked)}
                    disabled={true}
                    className="cursor-not-allowed"
                />
                <span className="text-low-emphesis ml-2 mr-1">
                    Swap borrowed {pair.asset.symbol} for {pair.collateral.symbol} collateral
                </span>
                <QuestionHelper
                    text={
                        <span>
                            Swapping your borrowed tokens for collateral allows for opening long/short positions with
                            leverage in a single transaction.
                            <br />
                            <br /> This feature will be enabled soon.
                        </span>
                    }
                />
                <Badge color="pink" className="ml-auto">
                    COMING SOON
                </Badge>
            </div>

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
                <>
                    {showApprove && (
                        <Button color="pink" onClick={approve} className="mb-4">
                            {approvalState === ApprovalState.PENDING ? (
                                <Dots>Approving {pair.collateral.symbol}</Dots>
                            ) : (
                                `Approve ${pair.collateral.symbol}`
                            )}
                        </Button>
                    )}

                    {!showApprove && (
                        <Button
                            color="pink"
                            onClick={() => onCook(pair, onExecute)}
                            disabled={
                                (collateralValue.toBigNumber(pair.collateral.decimals).lte(0) &&
                                    borrowValue.toBigNumber(pair.asset.decimals).lte(0)) ||
                                collateralWarnings.broken ||
                                (borrowValue.length > 0 && borrowWarnings.broken)
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
