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

import useTokenBalance from '../../../sushi-hooks/queries/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../../utils'

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

interface CurrencyInputPanelProps {
  id: string
  tokenAddress: string
  pairAddress: string
  tokenSymbol: string
}

export default function CurrencyInputPanel({ tokenAddress, pairAddress, tokenSymbol }: CurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const theme = useTheme()

  const [balanceFrom, setBalanceFrom] = useState<any>('bento')

  const walletBalance = useTokenBalance(tokenAddress)
  const bentoBalance = useBentoBalance(tokenAddress)

  const balance = balanceFrom && balanceFrom === 'bento' ? bentoBalance : walletBalance

  const { depositAddAsset, addAsset } = useKashi()

  //const tokenBalanceBigInt = useTokenBalance(tokenAddress)
  const tokenBalance = formatFromBalance(balance?.value, balance?.decimals)
  const decimals = balance?.decimals

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
  const maxDepositAmountInput = balance
  //const atMaxDepositAmount = true
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(tokenBalance, true)
  }, [maxDepositAmountInput, onUserDepositInput, tokenBalance])

  console.log('state:', depositValue, maxSelected)

  return (
    <>
      <InputPanel id="supply-input">
        <Container cornerRadiusBottomNone={true} cornerRadiusTopNone={false}>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                Supply <span className="font-semibold">{tokenSymbol}</span> from{' '}
                <span>
                  {balanceFrom === 'bento' ? (
                    <StyledSwitch onClick={() => setBalanceFrom('wallet')}>Bento</StyledSwitch>
                  ) : (
                    <StyledSwitch onClick={() => setBalanceFrom('bento')}>Wallet</StyledSwitch>
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
                  Balance: {tokenBalance} {tokenSymbol}
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
                  onUserDepositInput(val)
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
                      await depositAddAsset(pairAddress, tokenAddress, maxDepositAmountInput)
                    } else {
                      await depositAddAsset(pairAddress, tokenAddress, formatToBalance(depositValue, decimals))
                    }
                  } else if (balanceFrom === 'bento') {
                    if (maxSelected) {
                      await addAsset(pairAddress, tokenAddress, maxDepositAmountInput)
                    } else {
                      await addAsset(pairAddress, tokenAddress, formatToBalance(depositValue, decimals))
                    }
                  }
                  setPendingTx(false)
                }}
              >
                <Aligner>
                  <StyledButtonName>Supply</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
