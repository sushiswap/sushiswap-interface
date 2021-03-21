import React, { useState, useCallback } from 'react'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import { Input as NumericalInput } from 'components/NumericalInput'
import { Dots } from '../../../Pool/styleds'
import { useActiveWeb3React } from 'hooks'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { ApprovalState, useApproveCallback } from 'sushi-hooks/useApproveCallback'
import { useKashiPair } from 'context/kashi'
//import useKashiBalances from 'sushi-hooks/queries/useKashiBalances'
import useKashi from 'sushi-hooks/useKashi'
import { formatFromBalance, formatToBalance } from 'utils'

import {
  InputRow,
  ButtonSelect,
  LabelRow,
  Aligner,
  InputPanel,
  Container,
  StyledButtonName,
  StyledSwitch,
  StyledBalanceMax
} from '../styled'

interface RemoveInputPanelProps {
  tokenAddress: string
  tokenSymbol?: string
  pairAddress: string
}

export default function RemoveInputPanel({ tokenAddress, tokenSymbol, pairAddress }: RemoveInputPanelProps) {
  const [balanceFrom, setBalanceFrom] = useState<any>('bento')
  const { account } = useActiveWeb3React()
  const theme = useTheme()

  const { repay, repayFromBento } = useKashi()

  const kashiBalances = useKashiPair(pairAddress)
  const assetBalance = kashiBalances?.user.borrow.balance
  const tokenBalance = formatFromBalance(assetBalance?.value, assetBalance?.decimals)
  const decimals = assetBalance?.decimals

  // check whether the user has approved BentoBox on the token
  const bentoBoxContract = useBentoBoxContract()
  const [approvalA, approveACallback] = useApproveCallback(tokenAddress, bentoBoxContract?.address)

  // track and parse user input for Deposit Input
  const [repayValue, setRepayValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)

  const onUserWithdrawInput = useCallback((value: string, max = false) => {
    setMaxSelected(max)
    setRepayValue(value)
  }, [])

  const [pendingTx, setPendingTx] = useState(false)

  const maxWithdrawAmountInput = assetBalance

  const handleMaxDeposit = useCallback(() => {
    maxWithdrawAmountInput && onUserWithdrawInput(tokenBalance, true)
  }, [maxWithdrawAmountInput, onUserWithdrawInput, tokenBalance])

  return (
    <>
      <InputPanel>
        <Container cornerRadiusBottomNone={true}>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                Repay <span className="font-semibold">{tokenSymbol}</span> from{' '}
                <span>
                  {balanceFrom === 'bento' ? (
                    <StyledSwitch onClick={() => setBalanceFrom('wallet')}>Bento</StyledSwitch>
                  ) : (
                    balanceFrom === 'wallet' && (
                      <StyledSwitch onClick={() => setBalanceFrom('bento')}>Wallet</StyledSwitch>
                    )
                  )}
                </span>
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={handleMaxDeposit}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  Borrowed: {tokenBalance} {tokenSymbol}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
          <InputRow>
            <>
              <NumericalInput
                className="token-amount-input"
                value={repayValue}
                onUserInput={val => {
                  onUserWithdrawInput(val)
                }}
              />
              {account && <StyledBalanceMax onClick={handleMaxDeposit}>MAX</StyledBalanceMax>}
            </>
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
                  Number(repayValue) === 0 ||
                  // todo this should be a bigInt comparison
                  Number(repayValue) > Number(tokenBalance)
                }
                onClick={async () => {
                  setPendingTx(true)
                  if (balanceFrom === 'wallet') {
                    if (maxSelected) {
                      await repay(pairAddress, tokenAddress, maxWithdrawAmountInput, true)
                    } else {
                      await repay(pairAddress, tokenAddress, formatToBalance(repayValue, decimals), false)
                    }
                  } else if (balanceFrom === 'bento') {
                    if (maxSelected) {
                      await repayFromBento(pairAddress, tokenAddress, maxWithdrawAmountInput, true)
                    } else {
                      await repayFromBento(pairAddress, tokenAddress, formatToBalance(repayValue, decimals), false)
                    }
                  }
                  setPendingTx(false)
                }}
              >
                <Aligner>
                  <StyledButtonName>Repay</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
