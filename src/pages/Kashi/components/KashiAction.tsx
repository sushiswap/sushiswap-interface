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
import { darken } from 'polished'
import { ApprovalState, useApproveCallback } from 'sushi-hooks/useApproveCallback'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'
import useBentoBalance from 'sushi-hooks/queries/useBentoBalance'
import useKashi from 'sushi-hooks/useKashi'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { formatToBalance, formatFromBalance } from 'utils'

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

interface KashiActions {
  pair: any
  action: string
  direction: string
  label: string
}

export default function KashiActions({ pair, action, direction, label }: KashiActions) {
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

  const balance = action === 'Deposit' || action === 'Withdraw' ? assetBalance : collateralBalance

  const [value, setValue] = useState('')

  const [pendingTx, setPendingTx] = useState(false)

  const onMax = useCallback(() => {
    if (action === 'Deposit') {
      setValue(formatFromBalance(assetBalance.value, assetBalance.decimals))
    } else if (action === 'Withdraw') {
      setValue(formatFromBalance(pair.user.supply.value, pair.asset.decimals))
    } else if (action === 'Borrow') {
      setValue(pair.user.borrow.max.string)
    } else if (action === 'Repay') {
      // Max repayment?
    } else if (action === 'Add Collateral') {
      setValue(formatFromBalance(collateralBalance.value, collateralBalance.decimals))
    } else if (action === 'Remove Collateral') {
      setValue(pair.user.collateral.max.string)
    }
  }, [action, assetBalance, collateralBalance, pair])

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
        await depositAddCollateral(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Remove Collateral') {
        await removeWithdrawCollateral(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
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
        await addCollateral(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Remove Collateral') {
        await removeCollateral(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      }
    }
    setPendingTx(false)
  }

  return (
    <Wrapper>
      <TYPE.largeHeader color={theme.highEmphesisText} fontWeight={700} fontSize={36}>
        {action} {pair.asset.symbol}
      </TYPE.largeHeader>
      <AutoColumn gap="md">
        <>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.mediumEmphesisText} fontWeight={700} fontSize={16}>
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
              <TYPE.body
                color={theme.mediumEmphesisText}
                fontWeight={700}
                fontSize={16}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {label}: {formatFromBalance(balance?.value, balance?.decimals)}
              </TYPE.body>
            </RowBetween>
          </LabelRow>

          <InputRow>
            <>
              <NumericalInput value={value} onUserInput={setValue} />
              {account && <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>}
            </>
          </InputRow>

          {/* <Warning predicate={true}>Some warning...</Warning> */}
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

        {/* <div>Transaction Review...</div> */}

        {action === 'Deposit' || action === 'Withdraw' ? (
          <ButtonBlue borderRadius="10px" padding="10px" onClick={onClick} disabled={pendingTx}>
            {action}
          </ButtonBlue>
        ) : (
          <ButtonPink borderRadius="10px" padding="10px" onClick={onClick} disabled={pendingTx}>
            {action}
          </ButtonPink>
        )}
      </AutoColumn>
    </Wrapper>
  )
}
