import React, { useState, useCallback } from 'react'
import useTheme from '../../../hooks/useTheme'
import { useTranslation } from 'react-i18next'
import { TYPE } from '../../../theme'
import { RowBetween } from '../../../components/Row'
import { Input as NumericalInput } from '../../../components/NumericalInput'
import { Dots } from '../../Pool/styleds'
import { useActiveWeb3React } from '../../../hooks'
import { useBentoBoxContract } from '../../../sushi-hooks/useContract'
import { ApprovalState, useApproveCallback } from '../../../sushi-hooks/useApproveCallback'
import useBentoBalance from '../../../sushi-hooks/queries/useBentoBalance'
import useKashi from '../../../sushi-hooks/useKashi'
import { formatFromBalance, formatToBalance } from '../../../utils'
import useMaxBorrowable from 'sushi-hooks/useMaxBorrowable'

import {
  InputRow,
  ButtonSelect,
  LabelRow,
  Aligner,
  InputPanel,
  Container,
  StyledButtonName,
  StyledBalanceMax
} from '../styled'

interface BorrowInputPanelProps {
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: number
  pairAddress: string
  max: string
}

export default function BorrowInputPanel({
  tokenSymbol,
  tokenAddress,
  tokenDecimals,
  pairAddress,
  max
}: BorrowInputPanelProps) {
  const [balanceFrom, setBalanceFrom] = useState<any>('bento')

  const bentoBalance = useBentoBalance(tokenAddress)

  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const theme = useTheme()

  const { borrow, borrowWithdraw } = useKashi()
  const { safeMaxBorrowableLeft, safeMaxBorrowableLeftPossible } = useMaxBorrowable(pairAddress)

  //const tokenBalanceBigInt = useTokenBalance(tokenAddress)
  const tokenBalance = formatFromBalance(bentoBalance?.value, bentoBalance?.decimals)
  const decimals = bentoBalance?.decimals

  // check whether the user has approved BentoBox on the token
  const bentoBoxContract = useBentoBoxContract()
  const [approvalA, approveACallback] = useApproveCallback(tokenAddress, bentoBoxContract?.address)

  // track and parse user input for Deposit Input
  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserBorrowInput = useCallback((borrowValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(borrowValue)
  }, [])

  // disable buttons if pendingTx, todo: styles could be improved
  const [pendingTx, setPendingTx] = useState(false)
  // used for max input button
  const maxDepositAmountInput = bentoBalance
  //const atMaxDepositAmount = true
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput &&
      onUserBorrowInput((safeMaxBorrowableLeftPossible / Math.pow(10, tokenDecimals)).toString(), true)
  }, [maxDepositAmountInput, onUserBorrowInput, safeMaxBorrowableLeftPossible, tokenDecimals])

  console.log('state:', depositValue, maxSelected)

  return (
    <>
      <InputPanel id="borrow-input-panel">
        <Container cornerRadiusBottomNone={true}>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                Borrow {tokenSymbol}
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={handleMaxDeposit}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  Max: {max} {tokenSymbol}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
          <InputRow>
            <>
              <NumericalInput
                className="token-amount-input"
                value={depositValue}
                onUserInput={val => {
                  onUserBorrowInput(val)
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
                  Number(depositValue) === 0 ||
                  // todo this should be a bigInt comparison
                  Number(depositValue) > Number(tokenBalance)
                }
                onClick={async () => {
                  setPendingTx(true)
                  if (balanceFrom === 'wallet') {
                    if (maxSelected) {
                      await borrowWithdraw(pairAddress, tokenAddress, maxDepositAmountInput, true)
                    } else {
                      await borrowWithdraw(pairAddress, tokenAddress, formatToBalance(depositValue, decimals), false)
                    }
                  } else if (balanceFrom === 'bento') {
                    if (maxSelected) {
                      await borrow(pairAddress, tokenAddress, maxDepositAmountInput, true)
                    } else {
                      await borrow(pairAddress, tokenAddress, formatToBalance(depositValue, decimals), false)
                    }
                  }
                  setPendingTx(false)
                }}
              >
                <Aligner>
                  <StyledButtonName>Borrow</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
