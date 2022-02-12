import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { hexConcat, hexlify } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { SUSHISWAP_MULTISWAPPER_ADDRESS, WNATIVE } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import KashiCooker from 'app/entities/KashiCooker'
import { TransactionReview } from 'app/entities/TransactionReview'
import { Warning, Warnings } from 'app/entities/Warnings'
import { toShare } from 'app/functions/bentobox'
import { e10, maximum, minimum, ZERO } from 'app/functions/math'
import { tryParseAmount } from 'app/functions/parse'
import { computeRealizedLPFeePercent, warningSeverity } from 'app/functions/prices'
import { useCurrency } from 'app/hooks/Tokens'
import { useV2TradeExactIn } from 'app/hooks/useV2Trades'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import { useExpertModeManager } from 'app/state/user/hooks'
import { useETHBalances } from 'app/state/wallet/hooks'
import React, { useMemo, useState } from 'react'

import { KashiApproveButton, TokenApproveButton } from './Button'
import { SwapCheckbox } from './Checkbox'
import SmartNumberInput from './SmartNumberInput'
import TradeReview from './TradeReview'
import TransactionReviewView from './TransactionReview'
import WarningsView from './WarningsList'

interface BorrowProps {
  pair: any
}

const DEFAULT_UPDATE_ORACLE = true

export default function Borrow({ pair }: BorrowProps) {
  const { account, chainId } = useActiveWeb3React()

  // State
  const [useBentoCollateral, setUseBentoCollateral] = useState<boolean>(pair.collateral.bentoBalance.gt(0))
  const [useBentoBorrow, setUseBentoBorrow] = useState<boolean>(true)
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [swapBorrowValue, setSwapBorrowValue] = useState('')
  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [swap, setSwap] = useState(false)

  const assetToken = useCurrency(pair.asset.address) || undefined
  const collateralToken = useCurrency(pair.collateral.address) || undefined

  // Calculated
  // @ts-ignore TYPE NEEDS FIXING
  const assetNative = WNATIVE[chainId].address === pair.collateral.address

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useETHBalances(assetNative ? [account] : [])

  const collateralBalance = useBentoCollateral
    ? pair.collateral.bentoBalance
    : assetNative
    ? // @ts-ignore TYPE NEEDS FIXING
      BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.collateral.balance

  const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

  const allowedSlippage = useAppSelector(selectSlippage)

  const parsedAmount = tryParseAmount(borrowValue, assetToken)

  const foundTrade = useV2TradeExactIn(parsedAmount, collateralToken)

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!foundTrade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(foundTrade)
    // @ts-ignore TYPE NEEDS FIXING
    const realizedLPFee = foundTrade.inputAmount.multiply(realizedLpFeePercent)
    // @ts-ignore TYPE NEEDS FIXING
    const priceImpact = foundTrade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [foundTrade])

  const extraCollateral =
    swap && foundTrade ? BigNumber.from(foundTrade.minimumAmountOut(allowedSlippage).quotient.toString()) : ZERO

  // const extraCollateral = swap
  //   ? computeSlippageAdjustedAmounts(foundTrade, allowedSlippage)
  //       [Field.OUTPUT]?.toFixed(pair.collateral.tokenInfo.decimals)
  //       .toBigNumber(pair.collateral.tokenInfo.decimals) || ZERO
  //   : ZERO;

  const swapCollateral = collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals)

  const nextUserCollateralValue = pair.userCollateralAmount.value
    .add(collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals))
    .add(extraCollateral)

  // Calculate max borrow
  const nextMaxBorrowableOracle = nextUserCollateralValue.mulDiv(e10(16).mul('75'), pair.oracleExchangeRate)

  const nextMaxBorrowableSpot = nextUserCollateralValue.mulDiv(e10(16).mul('75'), pair.spotExchangeRate)

  const nextMaxBorrowableStored = nextUserCollateralValue.mulDiv(
    e10(16).mul('75'),
    displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate
  )

  const nextMaxBorrowMinimum = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)

  const nextMaxBorrowSafe = nextMaxBorrowMinimum.mulDiv('95', '100').sub(pair.currentUserBorrowAmount.value)

  const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

  const maxBorrow = nextMaxBorrowPossible.toFixed(pair.asset.tokenInfo.decimals)

  const nextBorrowValue = pair.currentUserBorrowAmount.value.add(borrowValue.toBigNumber(pair.asset.tokenInfo.decimals))
  const nextHealth = nextBorrowValue.mulDiv('1000000000000000000', nextMaxBorrowMinimum)

  const collateralValueSet = !collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals).isZero()

  const borrowValueSet = !borrowValue.toBigNumber(pair.asset.tokenInfo.decimals).isZero()

  const trade = swap && borrowValueSet ? foundTrade : undefined

  const [isExpertMode] = useExpertModeManager()

  // const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const priceImpactSeverity = warningSeverity(priceImpact)

  const borrowAmount = borrowValue.toBigNumber(pair.asset.tokenInfo.decimals)

  const collateralWarnings = new Warnings()

  collateralWarnings.add(
    collateralBalance?.lt(collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals)),
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
          borrowValue.length > 0 && borrowAmount.gt(nextMaxBorrowMinimum.sub(pair.currentUserBorrowAmount.value)),
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
      borrowValue.length > 0 && pair.maxAssetAvailable.lt(borrowValue.toBigNumber(pair.asset.tokenInfo.decimals)),
      'Not enough liquidity in this pair.',
      true
    )

  // console.log('Oracle Discrepancy', {
  //     name: pair.asset.tokenInfo.symbol + '-' + pair.collateral.tokenInfo.symbol,
  //     borrowValueSet: borrowValueSet,
  //     displayUpdateOracle: displayUpdateOracle,
  //     currentExchangeRate: pair.currentExchangeRate.toFixed(
  //         pair.asset.tokenInfo.decimals
  //     ),
  //     oracleExchangeRate: pair.oracleExchangeRate.toFixed(
  //         pair.asset.tokenInfo.decimals
  //     ),
  //     diff:
  //         pair.currentExchangeRate.toFixed(pair.asset.tokenInfo.decimals) /
  //         pair.oracleExchangeRate.toFixed(pair.asset.tokenInfo.decimals),
  // })

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
      transactionReview.addTokenAmount('Borrowed', pair.currentUserBorrowAmount.value, nextBorrowValue, pair.asset)
      transactionReview.addUSD('Borrowed USD', pair.currentUserBorrowAmount.value, nextBorrowValue, pair.asset)
    }
    if (displayUpdateOracle) {
      transactionReview.addRate('Exchange Rate', pair.currentExchangeRate, pair.oracleExchangeRate, pair)
    }
    transactionReview.addTokenAmount(
      'Borrow Limit',
      pair.maxBorrowable.safe.value,
      nextMaxBorrowSafe.sub(borrowValue.toBigNumber(pair.asset.tokenInfo.decimals)),
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

  if (swap && priceImpactSeverity > 3 && !isExpertMode) {
    actionName = 'Price Impact High'
  } else if (swap && priceImpactSeverity > 2) {
    actionName = actionName + ' anyway'
  }

  const actionDisabled =
    (collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals).lte(0) &&
      borrowValue.toBigNumber(pair.asset.tokenInfo.decimals).lte(0)) ||
    collateralWarnings.broken ||
    (borrowValue.length > 0 && borrowWarnings.broken) ||
    (swap && priceImpactSeverity > 3 && !isExpertMode) ||
    (pair.userCollateralAmount.value.isZero() && !collateralValueSet)

  // Handlers
  async function onExecute(cooker: KashiCooker): Promise<string> {
    let summary = ''

    if (borrowValueSet) {
      if (displayUpdateOracle) {
        cooker.updateExchangeRate(true, ZERO, ZERO)
      }

      if (swap && !useBentoCollateral) {
        cooker.bentoDepositCollateral(collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals))
      }

      cooker.borrow(
        borrowValue.toBigNumber(pair.asset.tokenInfo.decimals),
        swap || useBentoBorrow,
        swap ? SUSHISWAP_MULTISWAPPER_ADDRESS[chainId || 1] : ''
      )
    }
    if (borrowValueSet && trade) {
      const path = trade.route.path.map((token) => token.address) || []

      if (path.length > 4) {
        throw 'Path too long'
      }

      console.log('debug', [
        pair.asset.address,
        pair.collateral.address,
        extraCollateral,
        path.length > 2 ? path[1] : AddressZero,
        path.length > 3 ? path[2] : AddressZero,
        account,
        toShare(pair.collateral, collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals)),
        borrowValue.toBigNumber(pair.asset.tokenInfo.decimals),
      ])

      const data = defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'address', 'address', 'address', 'uint256'],
        [
          pair.asset.address,
          pair.collateral.address,
          extraCollateral,
          path.length > 2 ? path[1] : AddressZero,
          path.length > 3 ? path[2] : AddressZero,
          account,
          toShare(pair.collateral, collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals)),
        ]
      )

      cooker.action(
        SUSHISWAP_MULTISWAPPER_ADDRESS[chainId || 1],
        ZERO,
        hexConcat([hexlify('0x3087d742'), data]),
        false,
        true,
        1
      )
    }
    if (collateralValueSet) {
      cooker.addCollateral(
        swap ? BigNumber.from(-1) : collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals),
        useBentoCollateral || swap
      )
    }

    if (collateralValueSet) {
      if (borrowValueSet) {
        summary = trade ? 'Borrow, swap and add collateral' : 'Add collateral and borrow'
      } else {
        summary = 'Add collateral'
      }
    } else if (borrowValueSet) {
      summary = trade ? 'Borrow, swap and add as collateral' : 'Borrow'
    }

    return summary
  }

  function onMultiply(multiplier: string) {
    const multipliedCollateral = swapCollateral.add(
      swapCollateral.mulDiv(
        multiplier.toBigNumber(pair.collateral.tokenInfo.decimals),
        '1'.toBigNumber(pair.collateral.tokenInfo.decimals)
      )
    )

    const multipliedBorrow = multipliedCollateral.mulDiv(e10(16).mul('75'), pair.currentExchangeRate)

    // console.log({
    //     original: swapCollateral.toFixed(pair.collateral.tokenInfo.decimals),
    //     multiplied: swapCollateral
    //         .add(
    //             swapCollateral.mulDiv(
    //                 multiplier.toBigNumber(pair.collateral.tokenInfo.decimals),
    //                 '1'.toBigNumber(pair.collateral.tokenInfo.decimals)
    //             )
    //         )
    //         .toFixed(pair.collateral.tokenInfo.decimals),
    //     borrow: multipliedBorrow.toFixed(pair.asset.tokenInfo.decimals),
    // })

    // console.log('multipliedBorrow:', multipliedBorrow)

    setBorrowValue(multipliedBorrow.toFixed(pair.asset.tokenInfo.decimals))
  }

  return (
    <>
      <div className="mt-6 mb-4 text-3xl text-high-emphesis">Borrow {pair.asset.tokenInfo.symbol}</div>

      <SmartNumberInput
        color="pink"
        token={pair.collateral}
        value={collateralValue}
        setValue={setCollateralValue}
        useBentoTitleDirection="down"
        useBentoTitle={`Add ${pair.collateral.tokenInfo.symbol} collateral from`}
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
        useBentoTitle={`Borrow ${pair.asset.tokenInfo.symbol} to`}
        useBento={useBentoBorrow}
        setUseBento={setUseBentoBorrow}
        maxTitle="Max"
        max={nextMaxBorrowPossible}
      />

      {collateralValueSet && (
        <SwapCheckbox
          trade={trade}
          color="pink"
          swap={swap}
          setSwap={setSwap}
          title={`Swap borrowed ${pair.asset.tokenInfo.symbol} for ${pair.collateral.tokenInfo.symbol} collateral`}
          help="Swapping your borrowed tokens for collateral allows for opening long/short positions with leverage in a single transaction."
        />
      )}

      {/* {borrowValueSet && (
        <ExchangeRateCheckBox
          pair={pair}
          updateOracle={updateOracle}
          setUpdateOracle={setUpdateOracle}
          desiredDirection="up"
        />
      )} */}

      {collateralValueSet && (
        <>
          <div className="flex mb-4">
            {['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2.0'].map((multipler, i) => (
              <Button
                variant="outlined"
                size="xs"
                color="pink"
                key={i}
                onClick={() => {
                  onMultiply(multipler)
                  setSwap(true)
                }}
                className="mr-4 text-md focus:ring-pink"
              >
                {multipler}x
              </Button>
            ))}

            {/* <div className="mb-4">
                                <input
                                    type="range"
                                    onChange={e => {
                                        onMultiply(e.target.value)
                                    }}
                                    min="0"
                                    max="2"
                                    step="0.01"
                                    className="w-full slider"
                                />
                                <div className="flex justify-between w-full px-2 text-center">
                                    <div className="font-semibold">1x</div>
                                    <div className="font-semibold">2x</div>
                                    <div className="font-semibold">3x</div>
                                </div>
                            </div> */}
          </div>
        </>
      )}

      <WarningsView warnings={collateralWarnings}></WarningsView>

      <WarningsView warnings={borrowWarnings}></WarningsView>

      {swap && trade && <TradeReview trade={trade} allowedSlippage={allowedSlippage} />}

      {(collateralValueSet ||
        (borrowValueSet && !pair.userCollateralAmount.value.isZero()) ||
        (swap && (priceImpactSeverity < 3 || isExpertMode))) && (
        <TransactionReviewView transactionReview={transactionReview} />
      )}

      <KashiApproveButton
        color="pink"
        content={(onCook: any) => (
          <TokenApproveButton value={collateralValue} token={collateralToken} needed={!useBentoCollateral}>
            <Button onClick={() => onCook(pair, onExecute)} disabled={actionDisabled} fullWidth={true}>
              {actionName}
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}
