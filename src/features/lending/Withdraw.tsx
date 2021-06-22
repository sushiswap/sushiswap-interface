import React, { useState } from 'react'
import { e10, minimum } from '../../functions/math'

import Button from '../../components/Button'
import { KashiApproveButton } from './Button'
import KashiCooker from '../../entities/KashiCooker'
import SmartNumberInput from '../../components/SmartNumberInput'
import { TransactionReview } from '../../entities/TransactionReview'
import TransactionReviewView from './TransactionReview'
import { Warnings } from '../../entities/Warnings'
import WarningsView from './WarningsList'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useKashiApprovalPending } from '../../state/application/hooks'
import useKashiApproveCallback from '../../hooks/useKashiApproveCallback'

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
  const displayValue = pinMax ? max.toFixed(pair.asset.tokenInfo.decimals) : value

  const fraction = pinMax
    ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
    : value.toBigNumber(pair.asset.tokenInfo.decimals).mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

  const warnings = new Warnings()
    .add(
      pair.currentUserAssetAmount.value.lt(value.toBigNumber(pair.asset.tokenInfo.decimals)),
      `Please make sure your ${useBento ? 'BentoBox' : 'wallet'} balance is sufficient to withdraw and then try again.`,
      true
    )
    .add(
      pair.maxAssetAvailableFraction.lt(fraction),
      "The isn't enough liquidity available at the moment to withdraw this amount. Please try withdrawing less or later.",
      true
    )

  const transactionReview = new TransactionReview()
  if (displayValue && !warnings.broken) {
    const amount = displayValue.toBigNumber(pair.asset.tokenInfo.decimals)
    const newUserAssetAmount = pair.currentUserAssetAmount.value.sub(amount)
    transactionReview.addTokenAmount('Balance', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
    transactionReview.addUSD('Balance USD', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)

    const newUtilization = e10(18).mulDiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.sub(amount))
    transactionReview.addPercentage('Borrowed', pair.utilization.value, newUtilization)
  }

  // Handlers
  async function onExecute(cooker: KashiCooker) {
    const fraction = pinMax
      ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
      : value
          .toBigNumber(pair.asset.tokenInfo.decimals)
          .mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

    cooker.removeAsset(fraction, useBento)
    return `Withdraw ${pair.asset.tokenInfo.symbol}`
  }

  return (
    <>
      <div className="mt-6 text-3xl text-high-emphesis">Withdraw {pair.asset.tokenInfo.symbol}</div>

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
            disabled={displayValue.toBigNumber(pair.asset.tokenInfo.decimals).lte(0) || warnings.broken}
          >
            Withdraw
          </Button>
        )}
      />
    </>
  )
}
