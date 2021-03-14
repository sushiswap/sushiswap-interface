import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'

import { Input as NumericalInput } from '../../../components/NumericalInput'
import { Dots } from '../../Pool/styleds'

import { useActiveWeb3React } from '../../../hooks'
//import { useTranslation } from 'react-i18next'
//import useTheme from '../../../hooks/useTheme'

import { useBentoBoxContract } from '../../../sushi-hooks/useContract'
import { ApprovalState, useApproveCallback } from '../../../sushi-hooks/useApproveCallback'
import useKashiBalances from '../../../sushi-hooks/queries/useKashiBalances'
//import useBentoBox from '../../../sushi-hooks/useBentoBox'
import useKashi from '../../../sushi-hooks/useKashi'
import useTokenBalance, { BalanceProps } from '../../../sushi-hooks/queries/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../../utils'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const ButtonSelect = styled.button`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.primary1};
  background-color: #293a50;
  color: ${({ theme }) => theme.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  margin: 0 0.25rem;
  width: 6rem;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean; cornerRadiusTopNone?: boolean; cornerRadiusBottomNone?: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '12px')};
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledButtonName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 auto;' : '  margin: 0 auto;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`

const StyledSwitch = styled.button`
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

const StyledBalanceMax = styled.button`
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
interface CurrencyInputPanelProps {
  label?: string
  tokenAddress: string
  pairAddress: string
  tokenSymbol?: string
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
}

export default function CurrencyInputPanel({
  label = '',
  tokenAddress,
  pairAddress,
  tokenSymbol,
  disableCurrencySelect = false,
  hideInput = false,
  id,
  cornerRadiusBottomNone,
  cornerRadiusTopNone
}: CurrencyInputPanelProps) {
  const [balanceFrom, setBalanceFrom] = useState<any>('bento')

  const kashiBalances = useKashiBalances(pairAddress)
  console.log('kashiBalance:', kashiBalances)

  return (
    <>
      {balanceFrom && balanceFrom === 'bento' ? (
        <SelectedInputPanel
          tokenAddress={tokenAddress}
          tokenSymbol={tokenSymbol}
          pairAddress={pairAddress}
          disableCurrencySelect={true}
          id="supply-collateral-token"
          balanceFrom={balanceFrom}
          setBalanceFrom={setBalanceFrom}
          tokenBalanceBigInt={kashiBalances?.borrow}
        />
      ) : (
        <SelectedInputPanel
          tokenAddress={tokenAddress}
          tokenSymbol={tokenSymbol}
          pairAddress={pairAddress}
          disableCurrencySelect={true}
          id="supply-collateral-token"
          balanceFrom={balanceFrom}
          setBalanceFrom={setBalanceFrom}
          tokenBalanceBigInt={kashiBalances?.borrow}
        />
      )}
    </>
  )
}

interface SelectedInputPanelProps {
  label?: string
  tokenAddress: string
  pairAddress: string
  tokenSymbol?: string
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
  balanceFrom: string
  setBalanceFrom: any
  tokenBalanceBigInt: BalanceProps
}

const SelectedInputPanel = ({
  label = '',
  tokenAddress,
  tokenSymbol,
  pairAddress,
  disableCurrencySelect = false,
  hideInput = false,
  id,
  cornerRadiusBottomNone,
  cornerRadiusTopNone,
  balanceFrom,
  setBalanceFrom,
  tokenBalanceBigInt
}: SelectedInputPanelProps) => {
  //const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  //const theme = useTheme()

  const { removeWithdrawCollateral, removeCollateral } = useKashi()

  //const tokenBalanceBigInt = useTokenBalance(tokenAddress)
  const tokenBalance = formatFromBalance(tokenBalanceBigInt?.value, tokenBalanceBigInt?.decimals)
  const decimals = tokenBalanceBigInt?.decimals

  // check whether the user has approved BentoBox on the token
  const bentoBoxContract = useBentoBoxContract()
  const [approvalA, approveACallback] = useApproveCallback(tokenAddress, bentoBoxContract?.address)

  // track and parse user input for Deposit Input
  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])

  // disable buttons if pendingTx, todo: styles could be improved
  const [pendingTx, setPendingTx] = useState(false)
  // used for max input button
  const maxDepositAmountInput = tokenBalanceBigInt
  //const atMaxDepositAmount = true
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(tokenBalance, true)
  }, [maxDepositAmountInput, onUserDepositInput, tokenBalance])

  console.log('state:', depositValue, maxSelected)

  return (
    <>
      {/* Deposit Input */}
      <div className="flex justify-between items-center px-1 pt-2">
        <div className="text-sm text-gray-300">
          Pay back <span className="font-semibold">{tokenSymbol}</span>
        </div>
        <div className="text-sm text-gray-300">
          Max owed: {tokenBalance} {tokenSymbol}
        </div>
      </div>
      <InputPanel id={id}>
        <Container
          hideInput={hideInput}
          cornerRadiusBottomNone={cornerRadiusBottomNone}
          cornerRadiusTopNone={cornerRadiusTopNone}
        >
          {!hideInput && <></>}
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <>
                <NumericalInput
                  className="token-amount-input"
                  value={depositValue}
                  onUserInput={val => {
                    onUserDepositInput(val)
                  }}
                />
                {account && label !== 'To' && <StyledBalanceMax onClick={handleMaxDeposit}>MAX</StyledBalanceMax>}
              </>
            )}
            {(approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING) && (
              <ButtonSelect disabled={approvalA === ApprovalState.PENDING} onClick={approveACallback}>
                <Aligner>
                  <StyledButtonName>
                    {approvalA === ApprovalState.PENDING ? <Dots>Approving </Dots> : 'Approve'}
                  </StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
            {approvalA === ApprovalState.APPROVED && (
              <ButtonSelect
                disabled={
                  pendingTx ||
                  !tokenBalance ||
                  Number(depositValue) === 0 ||
                  // todo this should be a bigInt comparison
                  Number(depositValue) > Number(tokenBalance)
                }
                onClick={async () => {
                  setPendingTx(true)
                  if (balanceFrom === 'wallet') {
                    if (maxSelected) {
                      await removeWithdrawCollateral(pairAddress, tokenAddress, maxDepositAmountInput)
                    } else {
                      await removeWithdrawCollateral(pairAddress, tokenAddress, formatToBalance(depositValue, decimals))
                    }
                  } else if (balanceFrom === 'bento') {
                    if (maxSelected) {
                      await removeCollateral(pairAddress, tokenAddress, maxDepositAmountInput)
                    } else {
                      await removeCollateral(pairAddress, tokenAddress, formatToBalance(depositValue, decimals))
                    }
                  }
                  setPendingTx(false)
                }}
              >
                <Aligner>
                  <StyledButtonName>Pay</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
