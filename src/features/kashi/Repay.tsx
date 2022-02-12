import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { hexConcat, hexlify } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Percent, SUSHISWAP_MULTI_EXACT_SWAPPER_ADDRESS, WNATIVE } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { KashiCooker } from 'app/entities'
import { TransactionReview } from 'app/entities/TransactionReview'
import { Warning, Warnings } from 'app/entities/Warnings'
import { toAmount, toShare } from 'app/functions/bentobox'
import { e10, maximum, minimum, ZERO } from 'app/functions/math'
import { tryParseAmount } from 'app/functions/parse'
import { computeRealizedLPFeePercent, warningSeverity } from 'app/functions/prices'
import { useCurrency } from 'app/hooks/Tokens'
import { useV2TradeExactOut } from 'app/hooks/useV2Trades'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippageWithDefault } from 'app/state/slippage/slippageSlice'
import { useExpertModeManager } from 'app/state/user/hooks'
import { useETHBalances } from 'app/state/wallet/hooks'
import React, { useMemo, useState } from 'react'

import { KashiApproveButton, TokenApproveButton } from './Button'
import { SwapCheckbox } from './Checkbox'
import SmartNumberInput from './SmartNumberInput'
import TradeReview from './TradeReview'
import TransactionReviewView from './TransactionReview'
import WarningsView from './WarningsList'

interface RepayProps {
  pair: any
}

const DEFAULT_KASHI_REPAY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const DEFAULT_UPDATE_ORACLE = true

export default function Repay({ pair }: RepayProps) {
  const { account, chainId } = useActiveWeb3React()

  // State
  const [useBentoRepay, setUseBentoRepay] = useState<boolean>(pair.asset.bentoBalance.gt(0))
  const [useBentoRemove, setUseBentoRemoveCollateral] = useState<boolean>(true)

  const [repayValue, setRepayAssetValue] = useState('')
  const [removeValue, setRemoveCollateralValue] = useState('')
  const [pinRemoveMax, setPinRemoveMax] = useState(false)
  const [pinRepayMax, setPinRepayMax] = useState(false)
  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [swap, setSwap] = useState(false)

  const assetToken = useCurrency(pair.asset.address) || undefined
  const collateralToken = useCurrency(pair.collateral.address) || undefined

  // Calculated
  const assetNative = WNATIVE[chainId || 1].address === pair.asset.address
  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useETHBalances(assetNative ? [account] : [])

  console.log({ pair })

  const balance = useBentoRepay
    ? toAmount(pair.asset, pair.asset.bentoBalance)
    : assetNative
    ? // @ts-ignore TYPE NEEDS FIXING
      BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.asset.balance

  const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

  const displayRepayValue = pinRepayMax
    ? minimum(pair.currentUserBorrowAmount.value, balance).toFixed(pair.asset.tokenInfo.decimals)
    : repayValue

  const nextUserBorrowAmount = pair.currentUserBorrowAmount.value.sub(
    displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals)
  )

  const nextMinCollateralOracle = nextUserBorrowAmount.mulDiv(pair.oracleExchangeRate, e10(16).mul('75'))
  const nextMinCollateralSpot = nextUserBorrowAmount.mulDiv(pair.spotExchangeRate, e10(16).mul('75'))
  const nextMinCollateralStored = nextUserBorrowAmount.mulDiv(
    displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate,
    e10(16).mul('75')
  )
  const nextMinCollateralMinimum = maximum(nextMinCollateralOracle, nextMinCollateralSpot, nextMinCollateralStored)
  const nextMaxRemoveCollateral = maximum(
    pair.userCollateralAmount.value.sub(nextMinCollateralMinimum.mul(100).div(95)),
    ZERO
  )
  const maxRemoveCollateral = nextMaxRemoveCollateral.toFixed(pair.collateral.tokenInfo.decimals)

  const displayRemoveValue = pinRemoveMax ? maxRemoveCollateral : removeValue

  const allowedSlippage = useAppSelector(selectSlippageWithDefault(DEFAULT_KASHI_REPAY_SLIPPAGE_TOLERANCE))

  const parsedAmount = tryParseAmount(pair.currentUserBorrowAmount.string, assetToken)

  const trade = useV2TradeExactOut(collateralToken, parsedAmount) || undefined

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    // @ts-ignore TYPE NEEDS FIXING
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)
    // @ts-ignore TYPE NEEDS FIXING
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [trade])

  // const maxAmountIn = swap
  //   ? computeSlippageAdjustedAmounts(foundTrade, allowedSlippage)
  //       [Field.INPUT]?.toFixed(pair.collateral.tokenInfo.decimals)
  //       .toBigNumber(pair.collateral.tokenInfo.decimals) || ZERO
  //   : ZERO;

  const maxAmountIn =
    swap && trade
      ? trade
          .maximumAmountIn(allowedSlippage)
          .toFixed(pair.collateral.tokenInfo.decimals)
          .toBigNumber(pair.collateral.tokenInfo.decimals)
      : ZERO

  // const nextUserCollateralValue = pair.userCollateralAmount.value.add(collateralValue.toBigNumber(pair.collateral.tokenInfo.decimals)).add(extraCollateral)

  const nextUserCollateralAmount = pair.userCollateralAmount.value.sub(
    displayRemoveValue.toBigNumber(pair.collateral.tokenInfo.decimals)
  )

  const nextMaxBorrowableOracle = nextUserCollateralAmount.mulDiv(e10(16).mul('75'), pair.oracleExchangeRate)
  const nextMaxBorrowableSpot = nextUserCollateralAmount.mulDiv(e10(16).mul('75'), pair.spotExchangeRate)
  const nextMaxBorrowableStored = nextUserCollateralAmount.mulDiv(
    e10(16).mul('75'),
    displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate
  )
  const nextMaxBorrowMinimum = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
  const nextMaxBorrowSafe = nextMaxBorrowMinimum.mulDiv('95', '100').sub(pair.currentUserBorrowAmount.value)
  const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

  const nextHealth = pair.currentUserBorrowAmount.value
    .sub(displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals))
    .mulDiv(BigNumber.from('1000000000000000000'), nextMaxBorrowMinimum)

  const transactionReview = new TransactionReview()

  if (displayRepayValue || displayRemoveValue) {
    transactionReview.addTokenAmount(
      'Borrow Limit',
      pair.maxBorrowable.safe.value,
      nextMaxBorrowSafe.add(displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals)),
      pair.asset
    )
    transactionReview.addPercentage('Health', pair.health.value, nextHealth)
  }

  const warnings = new Warnings()
    .addError(
      assetNative && !useBentoRepay && pinRepayMax,
      `You cannot MAX repay ${pair.asset.tokenInfo.symbol} directly from your wallet. Please deposit your ${pair.asset.tokenInfo.symbol} into the BentoBox first, then repay. Because your debt is slowly accrueing interest we can't predict how much it will be once your transaction gets mined.`
    )
    .addError(
      displayRemoveValue.toBigNumber(pair.collateral.tokenInfo.decimals).gt(pair.userCollateralAmount.value),
      'You have insufficient collateral. Please enter a smaller amount or repay more.'
    )
    .addError(
      displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals).gt(pair.currentUserBorrowAmount.value),
      "You can't repay more than you owe. To fully repay, please click the 'max' button.",
      new Warning(
        balance?.lt(displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals)),
        `Please make sure your ${
          useBentoRepay ? 'BentoBox' : 'wallet'
        } balance is sufficient to repay and then try again.`,
        true
      )
    )
    .addError(
      displayRemoveValue
        .toBigNumber(pair.collateral.tokenInfo.decimals)
        .gt(maximum(pair.userCollateralAmount.value.sub(nextMinCollateralMinimum), ZERO)),
      'Removing this much collateral would put you into insolvency.',
      new Warning(
        displayRemoveValue.toBigNumber(pair.collateral.tokenInfo.decimals).gt(nextMaxRemoveCollateral),
        'Removing this much collateral would put you very close to insolvency.'
      )
    )

  const removeValueSet =
    !displayRemoveValue.toBigNumber(pair.collateral.tokenInfo.decimals).isZero() ||
    (pinRemoveMax && pair.userCollateralShare.gt(ZERO))

  const repayValueSet = !displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals).isZero()

  // const trade = swap ? foundTrade : undefined;
  // const trade = swap && removeValueSet ? foundTrade : undefined

  const [isExpertMode] = useExpertModeManager()

  // const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const priceImpactSeverity = warningSeverity(priceImpact)

  let actionName = 'Nothing to do'

  if (removeValueSet) {
    if (repayValueSet) {
      actionName = 'Repay and remove collateral'
    } else {
      actionName = 'Remove collateral'
    }
  } else if (repayValueSet) {
    actionName = 'Repay'
  } else if (swap) {
    actionName = 'Automatic repay'
  }

  // const actionDisabled = false

  const actionDisabled =
    (!swap &&
      !trade &&
      displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals).lte(0) &&
      displayRemoveValue.toBigNumber(pair.collateral.tokenInfo.decimals).lte(0) &&
      (!pinRemoveMax || pair.userCollateralShare.isZero())) ||
    warnings.some((warning) => warning.breaking)

  function resetRepayState() {
    setPinRepayMax(false)
    setPinRemoveMax(false)
    setRemoveCollateralValue('')
    setRepayAssetValue('')
  }

  // Handlers
  async function onExecute(cooker: KashiCooker) {
    let summary = ''

    if (swap && trade) {
      const share = toShare(pair.collateral, pair.userCollateralAmount.value)

      cooker.removeCollateral(pair.userCollateralShare, true)
      cooker.bentoTransferCollateral(pair.userCollateralShare, SUSHISWAP_MULTI_EXACT_SWAPPER_ADDRESS[chainId || 1])
      cooker.repayShare(pair.userBorrowPart)

      const path = trade.route.path.map((token) => token.address) || []

      console.log('debug', [
        pair.collateral.address,
        pair.asset.address,
        maxAmountIn,
        path.length > 2 ? path[1] : AddressZero,
        path.length > 3 ? path[2] : AddressZero,
        account,
        pair.userCollateralShare,
      ])

      const data = defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'address', 'address', 'address', 'uint256'],
        [
          pair.collateral.address,
          pair.asset.address,
          maxAmountIn,
          path.length > 2 ? path[1] : AddressZero,
          path.length > 3 ? path[2] : AddressZero,
          account,
          pair.userCollateralShare,
        ]
      )

      cooker.action(
        SUSHISWAP_MULTI_EXACT_SWAPPER_ADDRESS[chainId || 1],
        ZERO,
        hexConcat([hexlify('0x3087d742'), data]),
        true,
        false,
        1
      )

      cooker.repayPart(pair.userBorrowPart, true)

      if (!useBentoRemove) {
        cooker.bentoWithdrawCollateral(ZERO, BigNumber.from(-1))
      }

      summary = 'Repay All'
    } else {
      if (pinRepayMax && pair.userBorrowPart.gt(0) && balance.gte(pair.currentUserBorrowAmount.value)) {
        cooker.repayPart(pair.userBorrowPart, useBentoRepay)
        summary = 'Repay Max'
      } else if (displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals).gt(0)) {
        cooker.repay(displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals), useBentoRepay)
        summary = 'Repay'
      }
      if (
        displayRemoveValue.toBigNumber(pair.collateral.tokenInfo.decimals).gt(0) ||
        (pinRemoveMax && pair.userCollateralShare.gt(0))
      ) {
        const share =
          pinRemoveMax &&
          (nextUserBorrowAmount.isZero() ||
            (pinRepayMax && pair.userBorrowPart.gt(0) && balance.gte(pair.currentUserBorrowAmount.value)))
            ? pair.userCollateralShare
            : toShare(pair.collateral, displayRemoveValue.toBigNumber(pair.collateral.tokenInfo.decimals))

        cooker.removeCollateral(share, useBentoRemove)
        summary += (summary ? ' and ' : '') + 'Remove Collateral'
      }
    }

    resetRepayState()

    return summary
  }

  return (
    <>
      <div className="mt-6 mb-4 text-3xl text-high-emphesis">Repay {pair.asset.tokenInfo.symbol}</div>

      <SmartNumberInput
        color="pink"
        token={pair.asset}
        value={displayRepayValue}
        setValue={setRepayAssetValue}
        useBentoTitleDirection="down"
        useBentoTitle={`Repay ${pair.asset.tokenInfo.symbol} from`}
        useBento={useBentoRepay}
        setUseBento={setUseBentoRepay}
        maxTitle="Balance"
        max={balance}
        pinMax={pinRepayMax}
        setPinMax={setPinRepayMax}
        showMax={!swap && !pair.currentUserBorrowAmount.value.isZero()}
        disabled={swap || pair.currentUserBorrowAmount.value.isZero()}
        switchDisabled={swap || pair.currentUserBorrowAmount.value.isZero()}
      />

      <SmartNumberInput
        color="pink"
        token={pair.collateral}
        value={displayRemoveValue}
        setValue={setRemoveCollateralValue}
        useBentoTitleDirection="up"
        useBentoTitle={`Remove ${pair.collateral.tokenInfo.symbol} to`}
        useBento={useBentoRemove}
        setUseBento={setUseBentoRemoveCollateral}
        max={nextMaxRemoveCollateral}
        pinMax={pinRemoveMax}
        setPinMax={setPinRemoveMax}
        showMax={
          pair.currentUserBorrowAmount.value.eq(displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals)) ||
          pair.currentUserBorrowAmount.value.isZero()
        }
        disabled={swap || pair.userCollateralAmount.value.isZero()}
        switchDisabled={pair.userCollateralAmount.value.isZero()}
      />

      {!pair.currentUserBorrowAmount.value.isZero() && (
        <SwapCheckbox
          trade={trade}
          color="pink"
          swap={swap}
          setSwap={(value: boolean) => {
            resetRepayState()
            setSwap(value)
          }}
          title={`Swap ${pair.collateral.tokenInfo.symbol} collateral for ${pair.asset.tokenInfo.symbol} and repay`}
          help="Swapping your removed collateral tokens and repay allows for reducing your borrow by using your collateral and/or to unwind leveraged positions."
        />
      )}

      {/* {removeValueSet && (
        <ExchangeRateCheckBox
          pair={pair}
          updateOracle={updateOracle}
          setUpdateOracle={setUpdateOracle}
          desiredDirection="up"
        />
      )} */}

      <WarningsView warnings={warnings} />

      {swap && trade && <TradeReview trade={trade} allowedSlippage={allowedSlippage} />}

      {swap && (priceImpactSeverity < 3 || isExpertMode) && (
        <TransactionReviewView transactionReview={transactionReview} />
      )}

      <KashiApproveButton
        color="pink"
        content={(onCook: any) => (
          <TokenApproveButton value={displayRepayValue} token={assetToken} needed={!useBentoRepay}>
            <Button onClick={() => onCook(pair, onExecute)} disabled={actionDisabled} fullWidth={true}>
              {actionName}
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}
