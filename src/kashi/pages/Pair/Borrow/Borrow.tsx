import React, { useContext, useState } from 'react'
import { WETH } from '@sushiswap/sdk'
import { Button, Checkbox } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight, ArrowUpRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { minimum, e10, ZERO, maximum } from 'kashi/functions/math'
import { TransactionReview } from 'kashi/entities/TransactionReview'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import QuestionHelper from 'components/QuestionHelper'
import { Warning, Warnings } from 'kashi/entities/Warnings'
import { SUSHISWAP_MULTISWAPPER_ADDRESS } from 'kashi/constants'
import { formattedNum } from 'utils'
import { KashiContext } from 'kashi/context'
import WarningsView from 'kashi/components/Warnings'
import { useUserSlippageTolerance } from 'state/user/hooks'
import Settings from '../../../../components/Settings'
import { useTradeExactIn } from 'hooks/Trades'
import { useCurrency } from 'hooks/Tokens'
import { tryParseAmount } from 'state/swap/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices'
import { Field } from 'state/swap/actions'
import TradeReview from 'kashi/components/TradeReview'
import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, ethers } from 'ethers'
import { useSushiSwapMultiSwapper } from 'sushi-hooks/useContract'
import { toShare } from 'kashi/functions'
import { KashiApproveButton, TokenApproveButton } from 'kashi/components/Dots'
import SmartNumberInput from 'kashi/components/SmartNumberInput'

interface BorrowProps {
    pair: any
}

export default function Borrow({ pair }: BorrowProps) {
    const { account, chainId } = useActiveWeb3React()
    const swapper = useSushiSwapMultiSwapper()
    const info = useContext(KashiContext).state.info

    // State
    const [useBentoCollateral, setUseBentoCollateral] = useState<boolean>(pair.collateral.bentoBalance.gt(0))
    const [useBentoBorrow, setUseBentoBorrow] = useState<boolean>(true)
    const [collateralValue, setCollateralValue] = useState('')
    const [borrowValue, setBorrowValue] = useState('')
    const [updateOracle, setUpdateOracle] = useState(false)
    const [pinBorrowMax, setPinBorrowMax] = useState(false)
    const [swap, setSwap] = useState(false)

    const assetToken = useCurrency(pair.asset.address) || undefined
    const collateralToken = useCurrency(pair.collateral.address) || undefined

    // Calculated
    const assetNative = WETH[chainId || 1].address == pair.collateral.address
    const collateralBalance = useBentoCollateral
        ? pair.collateral.bentoBalance
        : assetNative ? info?.ethBalance : pair.collateral.balance

    const maxCollateral = collateralBalance.toFixed(pair.collateral.decimals)
    const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

    // Swap
    const [allowedSlippage] = useUserSlippageTolerance() // 10 = 0.1%
    const parsedAmount = tryParseAmount(borrowValue, assetToken)
    const trade = useTradeExactIn(parsedAmount, collateralToken) || undefined
    const extraCollateral = swap ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.OUTPUT]?.toFixed(pair.collateral.decimals).toBigNumber(pair.collateral.decimals) || ZERO : ZERO
    const nextUserCollateralValue = pair.userCollateralAmount.value.add(collateralValue.toBigNumber(pair.collateral.decimals)).add(extraCollateral)

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

    const displayBorrowValue = pinBorrowMax && !swap ? maxBorrow : borrowValue
    
    const nextBorrowValue = pair.currentUserBorrowAmount.value.add(displayBorrowValue.toBigNumber(pair.asset.decimals))
    const nextHealth = nextBorrowValue.muldiv('1000000000000000000', nextMaxBorrowMinimum)

    const collateralValueSet = !collateralValue.toBigNumber(pair.collateral.decimals).isZero()
    const borrowValueSet = !displayBorrowValue.toBigNumber(pair.asset.decimals).isZero()

    let actionName = 'Nothing to do'
    if (collateralValueSet) {
        if (borrowValueSet) {
            actionName = swap ? 'Borrow, swap and add collateral' : 'Add collateral and borrow'
        } else {
            actionName = 'Add collateral'
        }
    } else if (borrowValueSet) {
        actionName = swap ? 'Borrow, swap and add as collateral' : 'Borrow'
    }

    const borrowAmount = displayBorrowValue.toBigNumber(pair.asset.decimals)

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

    const actionDisabled = (collateralValue.toBigNumber(pair.collateral.decimals).lte(0) && borrowValue.toBigNumber(pair.asset.decimals).lte(0)) ||
        collateralWarnings.broken || (borrowValue.length > 0 && borrowWarnings.broken)


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
    function onSettings() {
        console.log("Settings")
    }

    async function onExecute(cooker: KashiCooker): Promise<string> {
        let summary = ''
        if (borrowValueSet) {
            if (displayUpdateOracle) {
                cooker.updateExchangeRate(true, ZERO, ZERO)
            }
            cooker.borrow(displayBorrowValue.toBigNumber(pair.asset.decimals), swap || useBentoBorrow, swap ? SUSHISWAP_MULTISWAPPER_ADDRESS : "")
            summary += (summary ? ' and ' : '') + 'Borrow'
        }
        if (borrowValueSet && swap) {
            const path = trade?.route.path.map(token => token.address) || []
            if (path.length > 4) { 
                throw("Path too long")
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
            cooker.action(SUSHISWAP_MULTISWAPPER_ADDRESS, ZERO, ethers.utils.hexConcat([ethers.utils.hexlify("0x3087d742"), data]), false, true, 1)
        }
        if (collateralValueSet) {
            cooker.addCollateral(swap ? BigNumber.from(-1) : collateralValue.toBigNumber(pair.collateral.decimals), useBentoCollateral)
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
            />

            <SmartNumberInput
                color="pink"
                token={pair.asset}
                value={displayBorrowValue}
                setValue={setBorrowValue}

                useBentoTitleDirection="up"
                useBentoTitle={`Borrow ${pair.asset.symbol} to`}
                useBento={useBentoBorrow}
                setUseBento={setUseBentoBorrow}

                maxTitle="Max"
                max={nextMaxBorrowPossible}
                setPinMax={setPinBorrowMax}
            />

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
                />
                <span className="text-primary ml-2 mr-1">
                    Swap borrowed {pair.asset.symbol} for {pair.collateral.symbol} collateral
                </span>
                <QuestionHelper text="Swapping your borrowed tokens for collateral allows for opening long/short positions with leverage in a single transaction." />
                {swap && (<Settings />)}
            </div>
            {swap && (<TradeReview trade={trade} allowedSlippage={allowedSlippage}></TradeReview>)}

            <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

            <KashiApproveButton color="pink" content={(onCook: any) => (
                <TokenApproveButton value={collateralValue} token={collateralToken} needed={!useBentoCollateral}>
                    <Button onClick={() => onCook(pair, onExecute)} disabled={actionDisabled}>
                        {actionName}
                    </Button>
                </TokenApproveButton>)
            } />
        </>
    )
}
