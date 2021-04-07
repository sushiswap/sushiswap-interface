import React, { useState } from 'react'
import { Alert, Button } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowUpRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { e10, minimum } from 'kashi/functions/math'
import { easyAmount } from 'kashi/functions/kashi'
import { TransactionReview } from 'kashi/entities/TransactionReview'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KashiCooker } from 'kashi/entities/KashiCooker'

export default function LendWithdrawAction({ pair }: any): JSX.Element {
  const { account, library, chainId } = useActiveWeb3React()

  // State
  const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
  const [value, setValue] = useState('')
  const [pinMax, setPinMax] = useState(false)

  // Calculated
  const displayValue = pinMax
    ? easyAmount(minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value), pair.asset).string
    : value

  const warningMessage = pair.oracleExchangeRate.isZero()
    ? 'Oracle exchange rate has NOT been set'
    : pair.currentUserAssetAmount.value.lt(value.toBigNumber(pair.asset.decimals))
    ? 'Please make sure your supply balance is sufficient to withdraw and then try again.'
    : ''

  const transactionReview = new TransactionReview()
  if (displayValue) {
    const amount = displayValue.toBigNumber(pair.asset.decimals)
    const newUserAssetAmount = pair.currentUserAssetAmount.value.sub(amount)
    transactionReview.addTokenAmount('Balance', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
    const newUtilization = e10(18).muldiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.sub(amount))
    transactionReview.addPercentage('Borrowed', pair.utilization.value, newUtilization)
  }

  // Handlers
  const onClick = async function() {
    const fraction = pinMax
      ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
      : value.toBigNumber(pair.asset.decimals).muldiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

    const cooker = new KashiCooker(pair, account, library, chainId)
    await cooker.approveIfNeeded()

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
          <span> To </span>
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

      <Alert predicate={warningMessage.length > 0} message={warningMessage} className="mb-4" />

      <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

      <Button
        color="blue"
        onClick={() => onClick()}
        disabled={warningMessage.length > 0 || displayValue.toBigNumber(0).lte(0)}
      >
        Withdraw
      </Button>
    </>
  )
}
