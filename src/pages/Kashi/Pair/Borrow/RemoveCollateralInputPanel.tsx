import React, { useState, useCallback } from 'react'
import useTheme from '../../../../hooks/useTheme'
import { TYPE } from '../../../../theme'
import { RowBetween } from '../../../../components/Row'
import { Input as NumericalInput } from '../../../../components/NumericalInput'
import { Dots } from '../../../Pool/styleds'
import { useActiveWeb3React } from '../../../../hooks'
import { useBentoBoxContract } from '../../../../sushi-hooks/useContract'
import { ApprovalState, useApproveCallback } from '../../../../sushi-hooks/useApproveCallback'
import { useKashiPair } from 'context/kashi'
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
  StyledSwitch,
  StyledBalanceMax
} from '../styled'

interface RemoveCollateralInputPanelProps {
  tokenAddress: string
  pairAddress: string
  tokenSymbol?: string
  max: string
}

export default function RemoveCollateralInputPanel({
  tokenAddress,
  pairAddress,
  tokenSymbol,
  max
}: RemoveCollateralInputPanelProps) {
  const [balanceFrom, setBalanceFrom] = useState<any>('bento')

  const { account } = useActiveWeb3React()
  const theme = useTheme()

  const { removeWithdrawCollateral, removeCollateral } = useKashi()

  //const tokenBalanceBigInt = useTokenBalance(tokenAddress)
  const kashiBalances = useKashiPair(pairAddress)
  const assetBalance = kashiBalances?.user.collateral.balance
  const tokenBalance = formatFromBalance(assetBalance.value, assetBalance.decimals)
  const decimals = assetBalance.decimals

  // check whether the user has approved BentoBox on the token
  const bentoBoxContract = useBentoBoxContract()
  const [approvalA, approveACallback] = useApproveCallback(tokenAddress, bentoBoxContract?.address)

  // track and parse user input for Deposit Input
  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserRemoveInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])

  // disable buttons if pendingTx, todo: styles could be improved
  const [pendingTx, setPendingTx] = useState(false)
  // used for max input button
  const maxRemoveAmountInput = max
  //const atMaxDepositAmount = true
  const handleMaxRemove = useCallback(() => {
    maxRemoveAmountInput && onUserRemoveInput(max, true)
  }, [onUserRemoveInput, max, maxRemoveAmountInput])

  console.log('state:', depositValue, maxSelected)

  return (
    <>
      <InputPanel id="remove-collateral-input-panel">
        <Container cornerRadiusTopNone={true}>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                Remove <span className="font-semibold">{tokenSymbol}</span> to{' '}
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
                  onClick={handleMaxRemove}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  Deposited: {tokenBalance} {tokenSymbol}
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
                  onUserRemoveInput(val)
                }}
              />
              {account && <StyledBalanceMax onClick={handleMaxRemove}>MAX</StyledBalanceMax>}
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
                      await removeWithdrawCollateral(pairAddress, tokenAddress, formatToBalance(max, decimals), true)
                    } else {
                      await removeWithdrawCollateral(
                        pairAddress,
                        tokenAddress,
                        formatToBalance(depositValue, decimals),
                        false
                      )
                    }
                  } else if (balanceFrom === 'bento') {
                    if (maxSelected) {
                      await removeCollateral(pairAddress, tokenAddress, formatToBalance(max, decimals), true)
                    } else {
                      await removeCollateral(pairAddress, tokenAddress, formatToBalance(depositValue, decimals), false)
                    }
                  }
                  setPendingTx(false)
                }}
              >
                <Aligner>
                  <StyledButtonName>Remove</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
