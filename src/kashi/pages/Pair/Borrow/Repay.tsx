import React, { useState } from 'react'
import { Alert, Button } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { formattedPercent, formattedNum } from 'utils'
import { BigNumber } from '@ethersproject/bignumber'
import { GradientDot } from '../../../components'
import { minimum, e10 } from 'kashi/functions/math'
import { Warnings } from 'kashi/entities'

interface RepayProps {
  pair: any
}

export default function Repay({ pair }: RepayProps) {
  const { account, chainId } = useActiveWeb3React()

  // State
  const [useBentoRepayAsset, setUseBentoRepayAsset] = useState<boolean>(pair.collateral.bentoBalance.gt(0))
  const [useBentoRemoveCollateral, setUseBentoRemoveCollateral] = useState<boolean>(true)

  const [repayAssetValue, setRepayAssetValue] = useState('')
  const [removeCollateralValue, setRemoveCollateralValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

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
    .toFixed(16)

  const transactionReview = [
    {
      label: 'Est. Borrow Limit',
      from: `${formattedNum(Math.max(0, Number(pair.maxBorrowable.safe.string)))} ${pair.asset.symbol}`,
      to: `${formattedNum(
        Math.max(0, Number(nextMaxBorrowSafe.toFixed(pair.asset.decimals))) + Number(repayAssetValue)
      )} ${pair.asset.symbol}`
    },
    {
      label: 'Est. Borrow Limit Used',
      from: formattedPercent(pair.health.string),
      to: (
        <div className="flex items-center">
          {formattedPercent(nextHealth)} <GradientDot percent={nextHealth} />
        </div>
      )
    }
  ]

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
            .mul(nextMaxBorrowSafe.sub(nextMaxBorrowPossible.sub(pair.currentUserBorrowAmount.value)))
            .div(nextMaxBorrowSafe)
        )
        .toFixed(pair.collateral.decimals)
    : '0'

  // Handlers
  async function onRepay() {
    setPendingTx(true)

    // TODO: Cook
    /*
    if (repayAssetValue.toBigNumber(pair.asset.decimals).gt(0)) {
      if (useBentoRepayAsset) {
        await repayFromBento(
          pair.address,
          pair.asset.address,
          repayAssetValue.toBigNumber(pair.asset.decimals)
          // repayAssetValue === maxRepayAsset
        )
      } else {
        await repay(
          pair.address,
          pair.asset.address,
          repayAssetValue.toBigNumber(pair.asset.decimals)
          // repayAssetValue === maxRepayAsset
        )
      }
    }

    if (removeCollateralValue.toBigNumber(pair.collateral.decimals).gt(0)) {
      if (useBentoRemoveCollateral) {
        await removeCollateral(
          pair.address,
          pair.collateral.address,
          removeCollateralValue.toBigNumber(pair.collateral.decimals)
        )
      } else {
        await removeWithdrawCollateral(
          pair.address,
          pair.collateral.address,
          removeCollateralValue.toBigNumber(pair.collateral.decimals)
        )
      }
    }*/

    setPendingTx(false)
  }

  return (
    <>
      <div className="text-3xl text-high-emphesis mt-6 mb-4">Repay {pair.asset.symbol}</div>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span className="mx-2"> Repay Asset From </span>
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

      {/* {showApprove && (
        <Button color="pink" onClick={approve} className="mb-4">
          {approvalState === ApprovalState.PENDING ? (
            <Dots>Approving {pair.collateral.symbol}</Dots>
          ) : (
            `Approve ${pair.collateral.symbol}`
          )}
        </Button>
      )} */}

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

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span className="mx-2">Remove Collateral To</span>
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
        <Alert key={i} type={warning.breaking ? 'error' : 'warning'} message={warning.message} className="mb-4" />
      ))}

      {!warnings.length && (Math.sign(Number(repayAssetValue)) > 0 || Math.sign(Number(removeCollateralValue)) > 0) && (
        <>
          <div className="py-4 mb-4">
            <div className="text-xl text-high-emphesis">Transaction Review</div>
            {transactionReview.map((item, i) => (
              <div key={i} className="flex flex-row items-center justify-between text-lg">
                <div className="text-lg text-secondary">{item.label}:</div>
                <div className="flex">
                  <div className="text-secondary">{item.from}</div>
                  {' → '}
                  <div className="text-primary">{item.to}</div>
                </div>
              </div>
            ))}
          </div>
          <Button
            color="pink"
            onClick={onRepay}
            disabled={
              // pendingTx ||
              // (balance.eq(0) && pair.userCollateralAmount.eq(0)) ||
              // Math.sign(Number(collateralValue)) > 0 ||
              // Math.sign(Number(borrowValue)) > 0 ||
              warnings.some(warning => warning.breaking)
            }
          >
            Repay
          </Button>
        </>
      )}
    </>
  )
}
