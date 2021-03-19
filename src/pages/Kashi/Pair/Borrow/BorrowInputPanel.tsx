import React, { useState, useCallback } from 'react'
import useTheme from '../../../../hooks/useTheme'
import { useTranslation } from 'react-i18next'
import { TYPE } from '../../../../theme'
import { RowBetween } from '../../../../components/Row'
import { Input as NumericalInput } from '../../../../components/NumericalInput'
import { Dots } from '../../../Pool/styleds'
import { useActiveWeb3React } from '../../../../hooks'
import { useBentoBoxContract } from '../../../../sushi-hooks/useContract'
import { ApprovalState, useApproveCallback } from '../../../../sushi-hooks/useApproveCallback'
import useBentoBalance from '../../../../sushi-hooks/queries/useBentoBalance'
import useKashi from '../../../../sushi-hooks/useKashi'
import { formatFromBalance, formatToBalance } from '../../../../utils'

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

  const decimals = bentoBalance?.decimals

  // check whether the user has approved BentoBox on the token
  const bentoBoxContract = useBentoBoxContract()
  const [approvalA, approveACallback] = useApproveCallback(tokenAddress, bentoBoxContract?.address)

  // track and parse user input for Deposit Input
  const [borrowValue, setBorrowValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserBorrowInput = useCallback((value: string, max = false) => {
    setMaxSelected(max)
    setBorrowValue(value)
  }, [])

  const [pendingTx, setPendingTx] = useState(false)

  const maxBorrowAmountInput = bentoBalance

  const handleMaxBorrow = useCallback(() => {
    maxBorrowAmountInput && onUserBorrowInput(max, true)
  }, [maxBorrowAmountInput, onUserBorrowInput, max])

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
                  onClick={handleMaxBorrow}
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
                value={borrowValue}
                onUserInput={val => {
                  onUserBorrowInput(val)
                }}
              />
              {account && <StyledBalanceMax onClick={handleMaxBorrow}>MAX</StyledBalanceMax>}
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
                // disabled={
                //   pendingTx ||
                //   !tokenBalance ||
                //   Number(depositValue) === 0 ||
                //   // todo this should be a bigInt comparison
                //   Number(depositValue) > Number(tokenBalance)
                // }
                onClick={async () => {
                  setPendingTx(true)
                  if (balanceFrom === 'wallet') {
                    if (maxSelected) {
                      await borrowWithdraw(pairAddress, tokenAddress, formatToBalance(max, decimals), true)
                    } else {
                      await borrowWithdraw(pairAddress, tokenAddress, formatToBalance(borrowValue, decimals), false)
                    }
                  } else if (balanceFrom === 'bento') {
                    if (maxSelected) {
                      await borrow(pairAddress, tokenAddress, formatToBalance(max, decimals), true)
                    } else {
                      await borrow(pairAddress, tokenAddress, formatToBalance(borrowValue, decimals), false)
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
