import React, { useState, useCallback } from 'react'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import { Warning, Dots } from '.'
import { ButtonBlue, ButtonPink } from 'components/Button'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'sushi-hooks/useApproveCallback'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'
import useBentoBalance from 'sushi-hooks/queries/useBentoBalance'
import useKashi from 'sushi-hooks/useKashi'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { formatToBalance, formatFromBalance } from 'utils'
import isEmpty from 'lodash/isEmpty'
import { BigNumber } from '@ethersproject/bignumber'

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
      return pair.user.borrow.max.string
    } else if (action === 'Repay') {
      return assetBalance?.value.gt(pair.user.borrow.value)
        ? pair.user.borrow.string
        : formatFromBalance(assetBalance?.value, assetBalance?.decimals)
    } else if (action === 'Add Collateral') {
      return formatFromBalance(collateralBalance?.value, collateralBalance?.decimals)
    } else if (action === 'Remove Collateral') {
      return pair.user.collateral.max.string
    }
  }, [action, pair, assetBalance, collateralBalance])

  const onMax = useCallback(() => {
    setMax(true)
    setValue(getMax())
  }, [getMax])

  const actionLimit = getMax()

  const getTransactionReview = useCallback(() => {
    return 'Transaction Review...'
  }, [value])

  const getWarningMessage = useCallback<() => string>(() => {
    if (action === 'Repay') {
      return 'Please make sure you have sufficient balance to pay back and then try again.'
    } else if (action === 'Borrow') {
      return 'You have surpassed your borrow limit and assets are at a high risk of liquidation.'
      // return 'You have insufficient collateral. Please enter a smaller amount,  add more collateral, or repay now.'
    } else if (action === 'Remove Collateral') {
      return 'This asset is needed to support borrowed assets. Please add more collateral or repay now.'
    }
    return ''
  }, [action])

  const getWarningPredicate = useCallback<() => boolean>(() => {
    if (action === 'Repay') {
      return assetBalance?.value.lt(formatToBalance(value, pair.asset.decimals).value)
    } else if (action === 'Borrow') {
      return pair.user.borrow.max.value.lt(BigNumber.from(0))
    } else if (action === 'Remove Collateral') {
      return pair.user.collateral.max.value.lt(formatToBalance(value, pair.collateral.decimals).value)
    }
    return false
  }, [action, assetBalance, value, pair])

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
                {label}: {actionLimit}
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

        {value !== '' && <div>{getTransactionReview()}</div>}

        {/* <div>Transaction Review...</div> */}

        {approvalState === ApprovalState.APPROVED &&
          (action === 'Deposit' || action === 'Withdraw' ? (
            <ButtonBlue
              borderRadius="10px"
              padding="10px"
              onClick={onClick}
              disabled={pendingTx || isEmpty(actionLimit) || isEmpty(value)}
            >
              {action}
            </ButtonBlue>
          ) : (
            <ButtonPink
              borderRadius="10px"
              padding="10px"
              onClick={onClick}
              disabled={pendingTx || isEmpty(actionLimit) || isEmpty(value)}
            >
              {action}
            </ButtonPink>
          ))}
      </AutoColumn>
    </Wrapper>
  )
}
