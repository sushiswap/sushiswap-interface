import React, { useState, useCallback } from 'react'
import useTheme from 'hooks/useTheme'
import { WETH } from '@sushiswap/sdk'
import { Alert, Dots, PinkButton, PinkButtonOutlined } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight, Type } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'sushi-hooks/useApproveCallback'
import useTokenBalance from 'sushi-hooks/useTokenBalance'
import useBentoBalance from 'sushi-hooks/useBentoBalance'
import useKashi from 'kashi/hooks/useKashi'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { formatToBalance, formatFromBalance, formattedPercent, formattedNum } from 'utils'
import isEmpty from 'lodash/isEmpty'
import { BigNumber } from '@ethersproject/bignumber'
import Fraction from 'constants/Fraction'
import { GradientDot } from '../../../components'
import { BENTOBOX_ADDRESS } from 'kashi/constants'
import { min, e10 } from 'kashi/functions/math'

interface BorrowProps {
  pair: any
}

export default function Borrow({ pair }: BorrowProps) {
  const { account, chainId } = useActiveWeb3React()

  const { borrowWithdraw, borrow, depositAddCollateral, addCollateral } = useKashi()

  // State
  const [useBentoCollateral, setUseBentoCollateral] = useState<boolean>(
    pair.collateral.bentoBalance.gt(BigNumber.from(0))
  )
  const [useBentoBorrow, setUseBentoBorrow] = useState<boolean>(true)
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const [approvalState, approve] = useApproveCallback(pair.collateral.address, BENTOBOX_ADDRESS)

  // Calculated
  const balance = useBentoCollateral ? pair.collateral.bentoBalance : pair.collateral.balance

  const nextUserCollateralValue = pair.userCollateralAmount.value.add(
    collateralValue.toBigNumber(pair.collateral.decimals)
  )

  const nextBorrowValue = pair.currentUserBorrowAmount.value.add(borrowValue.toBigNumber(pair.asset.decimals))

  const nextMaxBorrowableOracle = nextUserCollateralValue.muldiv(e10(16).mul('75'), pair.oracleExchangeRate)
  const nextMaxBorrowableSpot = nextUserCollateralValue.muldiv(e10(16).mul('75'), pair.spotExchangeRate)
  const nextMaxBorrowableStored = nextUserCollateralValue.muldiv(e10(16).mul('75'), pair.currentExchangeRate)

  const nextMaxBorrowMinimum = min(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
  const nextMaxBorrowSafe = nextMaxBorrowMinimum
    .muldiv('95', '100')
    .sub(pair.currentUserBorrowAmount.value.add(borrowValue.toBigNumber(pair.asset.decimals)))

  const nextMaxBorrowPossible = min(nextMaxBorrowSafe, pair.totalAssetAmount.value)

  const nextHealth = nextBorrowValue.muldiv('1000000000000000000', nextMaxBorrowMinimum).toFixed(16)

  const maxCollateral = balance.toFixed(pair.collateral.decimals)

  const maxBorrow = collateralValue
    ? nextMaxBorrowPossible.toFixed(pair.asset.decimals)
    : pair.maxBorrowable.possible.string

  const transactionReview = [
    {
      label: 'Est. Borrow Limit',
      from: `${formattedNum(Math.max(0, Number(pair.maxBorrowable.safe.string)))} ${pair.asset.symbol}`,
      to: `${formattedNum(Math.max(0, Number(nextMaxBorrowSafe.toFixed(pair.asset.decimals))))} ${pair.asset.symbol}`
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

  const warning =
    pair.currentExchangeRate.isZero() ||
    (borrowValue && nextUserCollateralValue.eq(BigNumber.from(0))) ||
    pair.maxBorrowable.safe.value.lt(BigNumber.from(0)) ||
    (borrowValue && nextMaxBorrowPossible.lt(0)) ||
    (borrowValue && nextMaxBorrowSafe.lt(BigNumber.from(0)))

  function getWarningMessage() {
    console.log('getWarningMessage', nextMaxBorrowSafe.toString(), nextMaxBorrowSafe.toFixed(pair.asset.decimals))
    if (pair.currentExchangeRate.isZero()) {
      return 'Oracle exchange rate has NOT been set'
    } else if (borrowValue && nextUserCollateralValue.eq(BigNumber.from(0))) {
      return 'You have insufficient collateral. Please enter a smaller amount, add more collateral, or repay now.'
    } else if (pair.maxBorrowable.safe.value.lt(BigNumber.from(0))) {
      return 'You have surpassed your borrow limit and assets are at a high risk of liquidation.'
    } else if (borrowValue && nextMaxBorrowPossible.lt(0)) {
      return 'Not enough liquidity in this pair.'
    } else if (borrowValue && nextMaxBorrowSafe.lt(BigNumber.from(0))) {
      return 'You will surpass your safe borrow limit and assets will be at a high risk of liquidation.'
    }
    return null
  }

  // Handlers
  async function onBorrow() {
    setPendingTx(true)

    // TODO: Cook

    if (collateralValue.toBigNumber(pair.collateral.decimals).gt(0)) {
      if (useBentoCollateral) {
        await addCollateral(
          pair.address,
          pair.collateral.address,
          collateralValue.toBigNumber(pair.collateral.decimals)
        )
      } else {
        await depositAddCollateral(
          pair.address,
          pair.collateral.address,
          collateralValue.toBigNumber(pair.collateral.decimals)
        )
      }
    }

    if (borrowValue.toBigNumber(pair.asset.decimals).gt(0)) {
      if (useBentoBorrow) {
        await borrow(pair.address, pair.asset.address, borrowValue.toBigNumber(pair.asset.decimals))
      } else {
        await borrowWithdraw(pair.address, pair.asset.address, borrowValue.toBigNumber(pair.asset.decimals))
      }
    }

    setPendingTx(false)
  }

  const showApprove =
    chainId &&
    pair.collateral.address !== WETH[chainId].address &&
    !useBentoCollateral &&
    collateralValue &&
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

  return (
    <>
      <div className="text-3xl text-high-emphesis mt-6 mb-4">Borrow {pair.asset.symbol}</div>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span className="mx-2">Add Collateral From</span>
          <span>
            <PinkButtonOutlined
              className="focus:ring focus:ring-pink"
              onClick={() => {
                setUseBentoCollateral(!useBentoCollateral)
              }}
            >
              {useBentoCollateral ? 'BentoBox' : 'Wallet'}
            </PinkButtonOutlined>
          </span>
        </div>
        <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
          Balance: {Math.max(0, maxCollateral)}
        </div>
      </div>

      <div className="flex items-center relative w-full mb-4">
        <NumericalInput
          className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
          value={collateralValue}
          onUserInput={setCollateralValue}
        />
        {account && (
          <PinkButtonOutlined
            onClick={() => setCollateralValue(maxCollateral)}
            className="absolute right-4 focus:ring focus:ring-pink"
          >
            MAX
          </PinkButtonOutlined>
        )}
      </div>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span className="mx-2"> Borrow Asset To </span>
          <span>
            <PinkButtonOutlined
              className="focus:ring focus:ring-pink"
              onClick={() => {
                setUseBentoBorrow(!useBentoBorrow)
              }}
            >
              {useBentoBorrow ? 'BentoBox' : 'Wallet'}
            </PinkButtonOutlined>
          </span>
        </div>
        <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
          Max: {Math.max(0, Number(maxBorrow))}
        </div>
      </div>

      {showApprove && (
        <PinkButton onClick={approve} className="mb-4">
          {approvalState === ApprovalState.PENDING ? (
            <Dots>Approving {pair.collateral.symbol}</Dots>
          ) : (
            `Approve ${pair.collateral.symbol}`
          )}
        </PinkButton>
      )}

      <div className="flex items-center relative w-full mb-4">
        <NumericalInput
          className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
          value={borrowValue}
          onUserInput={setBorrowValue}
        />
        {account && (
          <PinkButtonOutlined
            onClick={() => {
              setBorrowValue(maxBorrow)
            }}
            className="absolute right-4 focus:ring focus:ring-pink"
          >
            MAX
          </PinkButtonOutlined>
        )}
      </div>

      <Alert predicate={warning} message={getWarningMessage()} className="mb-4" />

      {!warning && (Math.sign(Number(collateralValue)) > 0 || Math.sign(Number(borrowValue)) > 0) && (
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
          <PinkButton
            onClick={onBorrow}
            disabled={
              pendingTx ||
              (balance.eq(0) && pair.userCollateralAmount.eq(0)) ||
              // Math.sign(Number(collateralValue)) > 0 ||
              // Math.sign(Number(borrowValue)) > 0 ||
              warning
            }
          >
            Borrow
          </PinkButton>
        </>
      )}
    </>
  )
}
