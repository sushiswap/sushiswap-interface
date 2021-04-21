import React, { useContext, useState } from 'react'
import { WETH } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Alert, Button, Checkbox, Dots } from 'components'
import Badge from 'components/Badge'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import { Warning, Warnings } from 'kashi/entities/Warnings'
import { SUSHISWAP_MULTISWAPPER_ADDRESS } from 'kashi/constants'
import { KashiContext } from 'kashi/context'
import WarningsView from 'kashi/components/Warnings'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useTradeExactIn } from 'hooks/Trades'
import { useCurrency } from 'hooks/Tokens'
import { tryParseAmount } from 'state/swap/hooks'
import { TransactionReview } from 'kashi/entities'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices'
import { Field } from 'state/swap/actions'
import TradeReview from 'kashi/components/TradeReview'
import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, ethers } from 'ethers'
import { toShare, ZERO, e10, minimum, maximum } from 'kashi/functions'
import { KashiApproveButton, TokenApproveButton } from 'kashi/components/Button'
import SmartNumberInput from 'kashi/components/SmartNumberInput'
import { ExchangeRateCheckBox, SwapCheckbox } from 'components/Checkbox'

interface BorrowProps {
    pair: any
}

export default function Borrow({ pair }: BorrowProps) {
    const { account, chainId } = useActiveWeb3React()
    const info = useContext(KashiContext).state.info

    // State
    const [useBentoCollateral, setUseBentoCollateral] = useState<boolean>(pair.collateral.bentoBalance.gt(0))
    const [useBentoBorrow, setUseBentoBorrow] = useState<boolean>(true)
    const [collateralValue, setCollateralValue] = useState('')
    const [borrowValue, setBorrowValue] = useState('')
    const [updateOracle, setUpdateOracle] = useState(false)
    const [swap, setSwap] = useState(false)

    const assetToken = useCurrency(pair.asset.address) || undefined
    const collateralToken = useCurrency(pair.collateral.address) || undefined

    // Calculated
    const assetNative = WETH[chainId || 1].address == pair.collateral.address
    const collateralBalance = useBentoCollateral
        ? pair.collateral.bentoBalance
        : assetNative
        ? info?.ethBalance
        : pair.collateral.balance

    const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

    // Swap
    const [allowedSlippage] = useUserSlippageTolerance() // 10 = 0.1%
    const parsedAmount = tryParseAmount(borrowValue, assetToken)
    const foundTrade = useTradeExactIn(parsedAmount, collateralToken) || undefined
    const extraCollateral = swap
        ? computeSlippageAdjustedAmounts(foundTrade, allowedSlippage)
              [Field.OUTPUT]?.toFixed(pair.collateral.decimals)
              .toBigNumber(pair.collateral.decimals) || ZERO
        : ZERO
    const nextUserCollateralValue = pair.userCollateralAmount.value
        .add(collateralValue.toBigNumber(pair.collateral.decimals))
        .add(extraCollateral)

    // Calculate max borrow
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

    const nextBorrowValue = pair.currentUserBorrowAmount.value.add(borrowValue.toBigNumber(pair.asset.decimals))
    const nextHealth = nextBorrowValue.muldiv('1000000000000000000', nextMaxBorrowMinimum)

    const collateralValueSet = !collateralValue.toBigNumber(pair.collateral.decimals).isZero()
    const borrowValueSet = !borrowValue.toBigNumber(pair.asset.decimals).isZero()

    const trade = swap && borrowValueSet ? foundTrade : undefined

    const borrowAmount = borrowValue.toBigNumber(pair.asset.decimals)

    const collateralWarnings = new Warnings().add(
        collateralBalance?.lt(collateralValue.toBigNumber(pair.collateral.decimals)),
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
                    borrowValue.length > 0 &&
                        borrowAmount.gt(nextMaxBorrowMinimum.sub(pair.currentUserBorrowAmount.value)),
                    "You don't have enough collateral to borrow this amount.",
                    true,
                    new Warning(
                        borrowValue.length > 0 && borrowAmount.gt(nextMaxBorrowSafe),
                        'You will surpass your borrow limit and assets will be at a high risk of liquidation.',
                        false
                    )
                )
            )
        )
        .add(
            borrowValue.length > 0 && pair.maxAssetAvailable.lt(borrowValue.toBigNumber(pair.asset.decimals)),
            'Not enough liquidity in this pair.',
            true
        )

    const transactionReview = new TransactionReview()
    if ((collateralValue || borrowValue) && !collateralWarnings.broken && (!borrowWarnings.broken || !borrowValue)) {
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
            nextMaxBorrowSafe.sub(borrowValue.toBigNumber(pair.asset.decimals)),
            pair.asset
        )
        transactionReview.addPercentage('Limit Used', pair.health.value, nextHealth)
        transactionReview.addPercentage('Borrow APR', pair.interestPerYear.value, pair.currentInterestPerYear.value)
    }

    let actionName = 'Nothing to do'
    if (collateralValueSet) {
        if (borrowValueSet) {
            actionName = trade ? 'Borrow, swap and add collateral' : 'Add collateral and borrow'
        } else {
            actionName = 'Add collateral'
        }
    } else if (borrowValueSet) {
        actionName = trade ? 'Borrow, swap and add as collateral' : 'Borrow'
    }

    const actionDisabled =
        (collateralValue.toBigNumber(pair.collateral.decimals).lte(0) &&
            borrowValue.toBigNumber(pair.asset.decimals).lte(0)) ||
        collateralWarnings.broken ||
        (borrowValue.length > 0 && borrowWarnings.broken)

    // Handlers
    async function onExecute(cooker: KashiCooker): Promise<string> {
        let summary = ''
        if (borrowValueSet) {
            if (displayUpdateOracle) {
                cooker.updateExchangeRate(true, ZERO, ZERO)
            }
            cooker.borrow(
                borrowValue.toBigNumber(pair.asset.decimals),
                swap || useBentoBorrow,
                swap ? SUSHISWAP_MULTISWAPPER_ADDRESS : ''
            )
            summary += (summary ? ' and ' : '') + 'Borrow'
        }
        if (borrowValueSet && trade) {
            const path = trade.route.path.map(token => token.address) || []
            if (path.length > 4) {
                throw 'Path too long'
            }
            const data = defaultAbiCoder.encode(
                ['address', 'address', 'uint256', 'address', 'address', 'address', 'uint256'],
                [
                    pair.asset.address,
                    pair.collateral.address,
                    extraCollateral,
                    path.length > 2 ? path[2] : ethers.constants.AddressZero,
                    path.length > 3 ? path[3] : ethers.constants.AddressZero,
                    account,
                    toShare(pair.collateral, collateralValue.toBigNumber(pair.collateral.decimals))
                ]
            )
            cooker.action(
                SUSHISWAP_MULTISWAPPER_ADDRESS,
                ZERO,
                ethers.utils.hexConcat([ethers.utils.hexlify('0x3087d742'), data]),
                false,
                true,
                1
            )
        }
        if (collateralValueSet) {
            cooker.addCollateral(
                swap ? BigNumber.from(-1) : collateralValue.toBigNumber(pair.collateral.decimals),
                useBentoCollateral
            )
            summary = 'Add collateral'
        }
        return summary
    }

    return (
        <>
            <div className="text-3xl text-high-emphesis mt-6 mb-4">Borrow {pair.asset.symbol}</div>

            <SmartNumberInput
                color="pink"
                token={pair.collateral}
                value={collateralValue}
                setValue={setCollateralValue}
                useBentoTitleDirection="down"
                useBentoTitle={`Add ${pair.collateral.symbol} collateral from`}
                useBento={useBentoCollateral}
                setUseBento={setUseBentoCollateral}
                maxTitle="Balance"
                max={collateralBalance}
                showMax={true}
            />

            <SmartNumberInput
                color="pink"
                token={pair.asset}
                value={borrowValue}
                setValue={setBorrowValue}
                useBentoTitleDirection="up"
                useBentoTitle={`Borrow ${pair.asset.symbol} to`}
                useBento={useBentoBorrow}
                setUseBento={setUseBentoBorrow}
                maxTitle="Max"
                max={nextMaxBorrowPossible}
            />

            <WarningsView warnings={collateralWarnings}></WarningsView>
            <WarningsView warnings={borrowWarnings}></WarningsView>

            {borrowValueSet && (
                <>
                    <ExchangeRateCheckBox
                        color="pink"
                        pair={pair}
                        updateOracle={updateOracle}
                        setUpdateOracle={setUpdateOracle}
                        desiredDirection="up"
                    />

                    <SwapCheckbox
                        color="pink"
                        swap={swap}
                        setSwap={setSwap}
                        title={`Swap borrowed ${pair.asset.symbol} for ${pair.collateral.symbol} collateral`}
                        help="Swapping your borrowed tokens for collateral allows for opening long/short positions with leverage in a single transaction."
                    />

                    {swap && <TradeReview trade={trade} allowedSlippage={allowedSlippage}></TradeReview>}
                </>
            )}

            <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

            <KashiApproveButton
                color="pink"
                content={(onCook: any) => (
                    <TokenApproveButton value={collateralValue} token={collateralToken} needed={!useBentoCollateral}>
                        <Button onClick={() => onCook(pair, onExecute)} disabled={actionDisabled}>
                            {actionName}
                        </Button>
                    </TokenApproveButton>
                )}
            />
        </>
    )
}
