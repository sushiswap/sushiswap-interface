import React, { useState, useCallback } from 'react'
import useTheme from 'hooks/useTheme'
import { WETH } from '@sushiswap/sdk'
import { Alert, Dots, PinkButton, PinkButtonOutlined } from '.'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight, Type } from 'react-feather'
import styled from 'styled-components'
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

import { GradientDot } from '.'

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.mediumEmphesisText};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0;
`

export const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 10px;
  // background-color: #2e3348;
  // padding: 0.75rem 0.5rem 0.75rem 1rem;
`

export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

export const Container = styled.div<{
  cornerRadiusTopNone?: boolean
  cornerRadiusBottomNone?: boolean
}>`
  border-radius: 12px;
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

export const StyledButtonName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 auto;' : '  margin: 0 auto;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`

export const StyledSwitch = styled.button`
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

export const StyledBalanceMax = styled.button`
  height: 28px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface BorrowActionProps {
  pair: any
  action: 'Borrow' | 'Repay'
  direction: string
  label: string
}

export default function BorrowAction({ pair, action, direction, label }: BorrowActionProps) {
  const theme = useTheme()
  const { account, chainId } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract()

  const token = action === 'Borrow' || action === 'Repay' ? pair.asset : pair.collateral

  const [approvalState, approve] = useApproveCallback(token.address, bentoBoxContract?.address)

  const {
    borrowWithdraw,
    borrow,
    repay,
    repayFromBento,
    depositAddCollateral,
    addCollateral,
    removeWithdrawCollateral,
    removeCollateral
  } = useKashi()

  const [sourceOrDestination, setSourceOrDestination] = useState<'BentoBox' | 'Wallet'>('BentoBox')

  const bentoAssetBalance = useBentoBalance(pair.asset.address)

  const walletAssetBalance = useTokenBalance(pair.asset.address)

  const bentoCollateralBalance = useBentoBalance(pair.collateral.address)

  const walletCollateralBalance = useTokenBalance(pair.collateral.address)

  const assetBalance = sourceOrDestination === 'BentoBox' ? bentoAssetBalance : walletAssetBalance

  const collateralBalance = sourceOrDestination === 'BentoBox' ? bentoCollateralBalance : walletCollateralBalance

  const [value, setValue] = useState('')

  const [max, setMax] = useState(false)

  const [pendingTx, setPendingTx] = useState(false)

  const getMax = useCallback(() => {
    if (action === 'Borrow') {
      return pair.maxBorrowable.possible.string
    } else if (action === 'Repay') {
      return assetBalance?.value.gt(pair.currentUserBorrowAmount.value)
        ? pair.currentUserBorrowAmount.string
        : formatFromBalance(assetBalance?.value, assetBalance?.decimals)
    } else if (action === 'Add Collateral') {
      return formatFromBalance(collateralBalance?.value, collateralBalance?.decimals)
    } else if (action === 'Remove Collateral') {
      return pair.safeMaxRemovable.value.gt(BigNumber.from(0)) ? pair.safeMaxRemovable.string : '0'
    }
  }, [action, pair, assetBalance, collateralBalance])

  const onMax = useCallback(() => {
    setMax(true)
    setValue(getMax())
  }, [getMax])

  const getTransactionReview = useCallback(() => {
    if (action === 'Borrow') {
      const health = Math.min(
        100,
        Math.min(
          Number(
            pair.currentUserBorrowAmount.value.gt(BigNumber.from(0))
              ? Fraction.from(
                  pair.currentUserBorrowAmount.value
                    .add(formatToBalance(value, pair.asset.decimals).value)
                    .mul(BigNumber.from('1000000000000000000'))
                    .div(pair.maxBorrowable.minimum.value),
                  BigNumber.from(10).pow(16)
                ).toString()
              : 0
          ),
          95
        )
      )
      return [
        {
          label: 'Est. Borrow Limit',
          from: `${formattedNum(Math.max(0, Number(pair.maxBorrowable.safe.string)))} ${pair.asset.symbol}`,
          to: `${formattedNum(Math.max(0, Number(pair.maxBorrowable.safe.string) - Number(value)))} ${
            pair.asset.symbol
          }`
        },
        {
          label: 'Est. Borrow Limit Used',
          from: formattedPercent(pair.health.string),
          to: (
            <>
              {health} <GradientDot percent={health} />
            </>
          )
        }
      ]
    } else if (action === 'Repay') {
      const health = Math.max(
        0,
        Number(
          pair.currentUserBorrowAmount.value.gt(BigNumber.from(0))
            ? Fraction.from(
                pair.currentUserBorrowAmount.value
                  .sub(formatToBalance(value, pair.asset.decimals).value)
                  .mul(BigNumber.from('1000000000000000000'))
                  .div(pair.maxBorrowable.minimum.value),
                BigNumber.from(10).pow(16)
              ).toString()
            : 0
        )
      )

      return [
        {
          label: 'Est. Borrow Limit',
          from: `${formattedNum(Math.max(0, Number(pair.maxBorrowable.safe.string)))} ${pair.asset.symbol}`,
          to: `${Math.min(
            Number(pair.maxBorrowable.safe.string) + Number(value),
            Number(
              Fraction.from(pair.maxBorrowable.safe.value, BigNumber.from(10).pow(BigNumber.from(pair.asset.decimals)))
            )
          )} ${pair.asset.symbol}`
        },
        {
          label: 'Est. Borrow Limit Used',
          from: formattedPercent(pair.health.string),
          to: (
            <>
              {health} <GradientDot percent={health} />
            </>
          )
        }
      ]
    }
    return null
  }, [action, pair, value])

  const getWarningMessage = useCallback(() => {
    if (pair.currentExchangeRate.isZero()) {
      return 'Oracle exchange rate has NOT been set'
    } else if (action === 'Borrow') {
      if (pair.userCollateralAmount.value.eq(BigNumber.from(0))) {
        return 'You have insufficient collateral. Please enter a smaller amount, add more collateral, or repay now.'
      }
      if (pair.maxBorrowable.safe.value.lt(BigNumber.from(0))) {
        return 'You have surpassed your borrow limit and assets are at a high risk of liquidation.'
      }
    } else if (action === 'Repay') {
      return `Please make sure your ${sourceOrDestination} balance is sufficient to ${action.toLowerCase()} and then try again.`
    } else if (action === 'Remove Collateral') {
      return 'This asset is needed to support borrowed assets. Please add more collateral or repay now.'
    }
    return null
  }, [action, sourceOrDestination, pair])

  const getWarningPredicate = useCallback<() => boolean>(() => {
    if (pair.oracleExchangeRate.isZero()) {
      return true
    } else if (action === 'Borrow') {
      return (
        pair.userCollateralAmount.value.eq(BigNumber.from(0)) ||
        pair.maxBorrowable.safe.value.lte(BigNumber.from(0)) ||
        collateralBalance?.value.lt(formatToBalance(value, pair.collateral.decimals).value)
      )
    } else if (action === 'Repay') {
      return pair.safeMaxRemovable.value.lt(formatToBalance(value, pair.collateral.decimals).value)
    }
    return false
  }, [action, collateralBalance, value, pair])

  const onClick = async function() {
    setPendingTx(true)
    if (sourceOrDestination === 'Wallet') {
      if (action === 'Borrow') {
        await borrowWithdraw(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Repay') {
        await repay(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Add Collateral') {
        await depositAddCollateral(
          pair.address,
          pair.collateral.address,
          formatToBalance(value, pair.collateral.decimals)
        )
      } else if (action === 'Remove Collateral') {
        await removeWithdrawCollateral(
          pair.address,
          pair.collateral.address,
          formatToBalance(value, pair.collateral.decimals),
          max
        )
      }
    } else if (sourceOrDestination === 'BentoBox') {
      if (action === 'Borrow') {
        await borrow(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Repay') {
        await repayFromBento(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Add Collateral') {
        await addCollateral(pair.address, pair.collateral.address, formatToBalance(value, pair.collateral.decimals))
      } else if (action === 'Remove Collateral') {
        console.log('Remove collateral', formatToBalance(value, pair.collateral.decimals))
        await removeCollateral(
          pair.address,
          pair.collateral.address,
          formatToBalance(value, pair.collateral.decimals),
          max
        )
      }
    }
    setPendingTx(false)
  }

  const showApprove =
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) &&
    action === 'Repay' &&
    ((direction === 'From' && sourceOrDestination !== 'BentoBox') || direction === 'To') &&
    direction === 'From' &&
    sourceOrDestination === 'Wallet' &&
    token.address !== WETH[chainId || 1].address

  const limit = getMax()

  const warning = getWarningPredicate()

  return (
    <>
      <div className="text-3xl text-high-emphesis mt-6">
        {action} {pair.asset.symbol}
      </div>
      <div className="flex justify-between my-4">
        <div className="text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span> {direction} </span>
          <span>
            <PinkButtonOutlined
              className="focus:ring focus:ring-pink"
              onClick={() => {
                setValue('')
                setSourceOrDestination(sourceOrDestination === 'BentoBox' ? 'Wallet' : 'BentoBox')
              }}
            >
              {sourceOrDestination}
            </PinkButtonOutlined>
          </span>
        </div>
        <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
          {label}: {Math.max(0, limit)}
        </div>
      </div>

      <div className="flex items-center relative w-full mb-4">
        <NumericalInput
          className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
          value={value}
          onUserInput={setValue}
        />
        {account && (
          <PinkButtonOutlined onClick={onMax} className="absolute right-4 focus:ring focus:ring-pink">
            MAX
          </PinkButtonOutlined>
        )}
      </div>

      <div className="flex justify-between my-4">
        <div className="text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span> {direction} </span>
          <span>
            <PinkButtonOutlined
              className="focus:ring focus:ring-pink"
              onClick={() => {
                setValue('')
                setSourceOrDestination(sourceOrDestination === 'BentoBox' ? 'Wallet' : 'BentoBox')
              }}
            >
              {sourceOrDestination}
            </PinkButtonOutlined>
          </span>
        </div>
        <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
          {label}: {Math.max(0, limit)}
        </div>
      </div>

      <div className="flex items-center relative w-full mb-4">
        <NumericalInput
          className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
          value={value}
          onUserInput={setValue}
        />
        {account && (
          <PinkButtonOutlined onClick={onMax} className="absolute right-4 focus:ring focus:ring-pink">
            MAX
          </PinkButtonOutlined>
        )}
      </div>

      <Alert predicate={warning} message={getWarningMessage()} className="mb-4" />

      {showApprove && (
        <PinkButton onClick={approve} className="mb-4">
          {approvalState === ApprovalState.PENDING ? (
            <Dots>Approving {pair.asset.symbol}</Dots>
          ) : (
            `Approve ${pair.asset.symbol}`
          )}
        </PinkButton>
      )}

      {!warning && Math.sign(Number(value)) > 0 && (
        <div className="py-4 mb-4">
          <div className="text-xl text-high-emphesis">Transaction Review</div>
          <div className="flex items-center justify-between">
            {getTransactionReview()?.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-lg">
                <div className="text-lg text-secondary">{item.label}:</div>
                <div className="text-secondary">{item.from}</div>
                <div className="text-primary">{item.to}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {approvalState === ApprovalState.APPROVED && (
        <PinkButton onClick={onClick} disabled={pendingTx || isEmpty(limit) || Math.sign(Number(value)) < 0 || warning}>
          {action}
        </PinkButton>
      )}
    </>
  )
}
