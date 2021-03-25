import React, { useState, useCallback } from 'react'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import { Warning, Dots } from '.'
import { ButtonBlue, ButtonPink } from 'components/Button'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight, Type } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'sushi-hooks/useApproveCallback'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'
import useBentoBalance from 'sushi-hooks/queries/useBentoBalance'
import useKashi from 'sushi-hooks/useKashi'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { formatToBalance, formatFromBalance, formattedPercent, formattedNum } from 'utils'
import isEmpty from 'lodash/isEmpty'
import { BigNumber } from '@ethersproject/bignumber'
import Fraction from 'constants/Fraction'

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
  border-radius: 20px;
  background-color: #2e3348;
  padding: 0.75rem 0.5rem 0.75rem 1rem;
`

export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
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

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
  max-width: 850px;
`

interface KashiActionProps {
  pair: any
  action: string
  direction: string
  label: string
}

export default function KashiActions({ pair, action, direction, label }: KashiActionProps) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract()

  const [approvalState, approve] = useApproveCallback(pair.asset.address, bentoBoxContract?.address)

  const {
    depositAddAsset,
    addAsset,
    removeAsset,
    removeWithdrawAsset,
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
    if (action === 'Deposit') {
      return formatFromBalance(assetBalance?.value, assetBalance?.decimals)
    } else if (action === 'Withdraw') {
      return formatFromBalance(pair.user.supply.value, pair.asset.decimals)
    } else if (action === 'Borrow') {
      return pair.user.borrow.max.value.gt(BigNumber.from(0)) ? pair.user.borrow.max.string : '0'
    } else if (action === 'Repay') {
      return assetBalance?.value.gt(pair.user.borrow.value)
        ? pair.user.borrow.string
        : formatFromBalance(assetBalance?.value, assetBalance?.decimals)
    } else if (action === 'Add Collateral') {
      return formatFromBalance(collateralBalance?.value, collateralBalance?.decimals)
    } else if (action === 'Remove Collateral') {
      return pair.user.collateral.max.value.gt(BigNumber.from(0)) ? pair.user.collateral.max.string : '0'
    }
  }, [action, pair, assetBalance, collateralBalance])

  const onMax = useCallback(() => {
    setMax(true)
    setValue(getMax())
  }, [getMax])

  const actionLimit = getMax()

  const getTransactionReview = useCallback(() => {
    if (action === 'Deposit') {
      return (
        <div>
          Balance {formattedNum(pair.user.supply.string)} {pair.asset.symbol}
          {' -> '}
          {formattedNum(Number(pair.user.supply.string) + Number(value))} {pair.asset.symbol}
        </div>
      )
    } else if (action === 'Withdraw') {
      return (
        <div>
          Balance {formattedNum(pair.user.supply.string)} {pair.asset.symbol}
          {' -> '}
          {formattedNum(Number(pair.user.supply.string) - Number(value))} {pair.asset.symbol}
        </div>
      )
    } else if (action === 'Borrow') {
      return (
        <div>
          <div>
            Est. Borrow Limit {formattedNum(Math.max(0, Number(pair.user.borrow.max.string)))} {pair.asset.symbol}
            {' -> '}
            {Math.max(0, Number(pair.user.borrow.max.string) - Number(value))} {pair.asset.symbol}
          </div>
          <div>
            Est. Borrow Limimt Rate {formattedPercent(pair.user.health.percentage)} {' -> '}
            {formattedPercent(
              Math.min(
                100,
                Number(
                  Math.min(
                    Number(
                      pair.currentUserBorrowAmount.gt(BigNumber.from(0))
                        ? Fraction.from(
                            pair.currentUserBorrowAmount
                              .add(formatToBalance(value, pair.asset.decimals).value)
                              .mul(BigNumber.from('1000000000000000000'))
                              .div(pair.maxBorrowable),
                            BigNumber.from(10).pow(16)
                          ).toString()
                        : 0
                    ),
                    100
                  )
                )
              )
            )}
          </div>
        </div>
      )
    } else if (action === 'Repay') {
      return (
        <div>
          <div>
            Est. Borrow Limit {formattedNum(Math.max(0, Number(pair.user.borrow.max.string)))} {pair.asset.symbol}
            {' -> '}
            {Math.min(
              Number(pair.user.borrow.max.string) + Number(value),
              Number(Fraction.from(pair.safeMaxBorrowable, BigNumber.from(10).pow(BigNumber.from(pair.asset.decimals))))
            )}{' '}
            {pair.asset.symbol}
          </div>
          <div>
            Est. Borrow Limimt Rate {formattedPercent(pair.user.health.percentage)} {' -> '}
            {formattedPercent(
              Math.max(
                0,
                Number(
                  Fraction.from(
                    pair.currentUserBorrowAmount
                      .sub(formatToBalance(value, pair.asset.decimals).value)
                      .mul(BigNumber.from('1000000000000000000'))
                      .div(pair.maxBorrowable),
                    BigNumber.from(10).pow(16)
                  ).toString()
                )
              )
            )}
          </div>
        </div>
      )
    } else if (action === 'Add Collateral') {
      const maxBorrowableOracle = pair.details.rate.oracle.gt(BigNumber.from(0))
        ? pair.user.collateral.value
            .add(formatToBalance(value, pair.collateral.decimals).value)
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pair.details.rate.oracle)
        : BigNumber.from(0)

      const maxBorrowableStored = pair.details.rate.current.gt(BigNumber.from(0))
        ? pair.user.collateral.value
            .add(formatToBalance(value, pair.collateral.decimals).value)
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pair.details.rate.current)
        : BigNumber.from(0)

      const maxBorrowable = maxBorrowableOracle.lt(maxBorrowableStored) ? maxBorrowableOracle : maxBorrowableStored

      const safeMaxBorrowable = maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))

      return (
        <div>
          <div>
            Collateral Balance {pair.user.collateral.string} {' -> '}
            {Number(pair.user.collateral.string) + Number(value)}
          </div>
          <div>
            Est. Borrow Limit {formattedNum(Math.max(0, Number(pair.user.borrow.max.string)))} {pair.asset.symbol}
            {' -> '}
            {Fraction.from(safeMaxBorrowable, BigNumber.from(10).pow(pair.asset.decimals)).toString()}{' '}
            {pair.asset.symbol}
          </div>
          <div>
            Est. Borrow Limimt Rate {formattedPercent(pair.user.health.percentage)} {' -> '}
            {formattedPercent(
              Math.min(
                Number(
                  pair.currentUserBorrowAmount.gt(BigNumber.from(0))
                    ? Fraction.from(
                        pair.currentUserBorrowAmount.mul(BigNumber.from('1000000000000000000')).div(safeMaxBorrowable),
                        BigNumber.from(10).pow(16)
                      ).toString()
                    : 0
                ),
                100
              )
            )}
          </div>
        </div>
      )
    } else if (action === 'Remove Collateral') {
      const maxBorrowableOracle = pair.details.rate.oracle.gt(BigNumber.from(0))
        ? pair.user.collateral.value
            .sub(formatToBalance(value, pair.collateral.decimals).value)
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pair.details.rate.oracle)
        : BigNumber.from(0)

      const maxBorrowableStored = pair.details.rate.current.gt(BigNumber.from(0))
        ? pair.user.collateral.value
            .sub(formatToBalance(value, pair.collateral.decimals).value)
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pair.details.rate.current)
        : BigNumber.from(0)

      const maxBorrowable = maxBorrowableOracle.lt(maxBorrowableStored) ? maxBorrowableOracle : maxBorrowableStored

      const safeMaxBorrowable = maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))

      const safeMaxBorrowableLeft = safeMaxBorrowable.sub(pair.user.borrow.value)

      return (
        <div>
          <div>
            Collateral Balance {pair.user.collateral.string} {' -> '}
            {Math.max(Number(pair.user.collateral.string) - Number(value), 0)}
          </div>
          <div>
            Est. Borrow Limit{' '}
            {formattedNum(
              Math.max(
                0,
                Number(Fraction.from(safeMaxBorrowableLeft, BigNumber.from(10).pow(pair.asset.decimals)).toString())
              )
            )}{' '}
            {pair.asset.symbol}
            {' -> '}
            {formattedNum(
              Math.max(
                0,
                Number(Fraction.from(safeMaxBorrowableLeft, BigNumber.from(10).pow(pair.asset.decimals)).toString())
              )
            )}{' '}
            {pair.asset.symbol}
          </div>
          <div>
            Est. Borrow Limimt Rate {formattedPercent(pair.user.health.percentage)} {' -> '}
            {formattedPercent(
              Math.min(
                Number(
                  pair.currentUserBorrowAmount.gt(BigNumber.from(0))
                    ? Fraction.from(
                        pair.currentUserBorrowAmount.mul(BigNumber.from('1000000000000000000')).div(safeMaxBorrowable),
                        BigNumber.from(10).pow(16)
                      ).toString()
                    : 0
                ),
                100
              )
            )}
          </div>
        </div>
      )
    }

    return null
  }, [action, value, pair])

  const getWarningMessage = useCallback(() => {
    if (action === 'Deposit' || action === 'Repay' || action === 'Add Collateral') {
      return `Please make sure your ${sourceOrDestination} balance is sufficient to ${action.toLowerCase()} and then try again.`
    } else if (action === 'Withdraw') {
      return `Please make sure your supply balance is sufficient to withdraw and then try again.`
    } else if (action === 'Borrow') {
      if (pair.user.collateral.value.eq(BigNumber.from(0))) {
        return 'You have insufficient collateral. Please enter a smaller amount,  add more collateral, or repay now.'
      }
      if (pair.user.borrow.max.value.lt(BigNumber.from(0))) {
        return 'You have surpassed your borrow limit and assets are at a high risk of liquidation.'
      }
    } else if (action === 'Remove Collateral') {
      return 'This asset is needed to support borrowed assets. Please add more collateral or repay now.'
    }
    return null
  }, [action, sourceOrDestination, pair])

  const getWarningPredicate = useCallback<() => boolean>(() => {
    if (action === 'Deposit' || action === 'Repay') {
      return assetBalance?.value.lt(formatToBalance(value, pair.asset.decimals).value)
    } else if (action === 'Withdraw') {
      return pair.user.supply.value.lt(formatToBalance(value, pair.asset.decimals).value)
    } else if (action === 'Borrow') {
      return pair.user.collateral.value.eq(BigNumber.from(0)) || pair.user.borrow.max.value.lte(BigNumber.from(0))
    } else if (action === 'Add Collateral') {
      return collateralBalance?.value.lt(formatToBalance(value, pair.collateral.decimals).value)
    } else if (action === 'Remove Collateral') {
      return pair.user.collateral.max.value.lt(formatToBalance(value, pair.collateral.decimals).value)
    }
    return false
  }, [action, assetBalance, collateralBalance, value, pair])

  const onClick = async function() {
    setPendingTx(true)
    if (sourceOrDestination === 'Wallet') {
      if (action === 'Deposit') {
        await depositAddAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Withdraw') {
        await removeWithdrawAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Borrow') {
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
          formatToBalance(value, pair.collateral.decimals)
        )
      }
    } else if (sourceOrDestination === 'BentoBox') {
      if (action === 'Deposit') {
        await addAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Withdraw') {
        await removeAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Borrow') {
        await borrow(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Repay') {
        await repayFromBento(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Add Collateral') {
        await addCollateral(pair.address, pair.collateral.address, formatToBalance(value, pair.collateral.decimals))
      } else if (action === 'Remove Collateral') {
        console.log('Remove collateral', formatToBalance(value, pair.collateral.decimals))
        await removeCollateral(pair.address, pair.collateral.address, formatToBalance(value, pair.collateral.decimals))
      }
    }
    setPendingTx(false)
  }

  return (
    <Wrapper>
      <TYPE.largeHeader color={theme.highEmphesisText}>
        {action}{' '}
        {action === 'Deposit' || action === 'Withdraw' || action === 'Borrow' || action === 'Repay'
          ? pair.asset.symbol
          : pair.collateral.symbol}
      </TYPE.largeHeader>
      <AutoColumn gap="md">
        <>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.mediumEmphesisText}>
                <span>
                  <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
                </span>
                <span> {direction} </span>
                <span>
                  <StyledSwitch
                    onClick={() => {
                      setValue('')
                      setSourceOrDestination(sourceOrDestination === 'BentoBox' ? 'Wallet' : 'BentoBox')
                    }}
                  >
                    {sourceOrDestination}
                  </StyledSwitch>
                </span>
              </TYPE.body>
              <TYPE.body color={theme.mediumEmphesisText} style={{ display: 'inline', cursor: 'pointer' }}>
                {label}: {Math.max(0, actionLimit)}
              </TYPE.body>
            </RowBetween>
          </LabelRow>

          <InputRow>
            <>
              <NumericalInput value={value} onUserInput={setValue} />
              {account && <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>}
            </>
          </InputRow>

          <Warning predicate={getWarningPredicate()}>{getWarningMessage()}</Warning>
        </>
        {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) && (
          <ButtonBlue borderRadius="10px" padding="10px" onClick={approve}>
            {approvalState === ApprovalState.PENDING ? (
              <Dots>Approving {pair.asset.symbol}</Dots>
            ) : (
              `Approve ${pair.asset.symbol}`
            )}
          </ButtonBlue>
        )}

        {!getWarningPredicate() && value !== '' && value !== '0' && (
          <div>
            <TYPE.mediumLargeHeader color={theme.highEmphesisText}>Transaction Review</TYPE.mediumLargeHeader>
            {getTransactionReview()}
          </div>
        )}

        {approvalState === ApprovalState.APPROVED &&
          (action === 'Deposit' || action === 'Withdraw' ? (
            <ButtonBlue
              borderRadius="10px"
              padding="10px"
              onClick={onClick}
              disabled={pendingTx || isEmpty(actionLimit) || isEmpty(value) || getWarningPredicate()}
            >
              {action}
            </ButtonBlue>
          ) : (
            <ButtonPink
              borderRadius="10px"
              padding="10px"
              onClick={onClick}
              disabled={pendingTx || isEmpty(actionLimit) || isEmpty(value) || getWarningPredicate()}
            >
              {action}
            </ButtonPink>
          ))}
      </AutoColumn>
    </Wrapper>
  )
}
