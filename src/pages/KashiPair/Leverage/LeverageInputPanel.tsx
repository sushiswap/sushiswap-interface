import React, { useState, useCallback } from 'react'
import { RowBetween } from '../../../components/Row'
import { Input as NumericalInput } from '../../../components/NumericalInput'
import { TYPE } from '../../../theme'
import { useActiveWeb3React } from '../../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../../hooks/useTheme'
import useTokenBalance from '../../../sushi-hooks/queries/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../../utils'

import useSaave from '../../../sushi-hooks/useSaave'
import useKashi from '../../../sushi-hooks/useKashi'

import LeverageDetails from './LeverageDetails'

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

export default function LeverageInputPanel({ id }: { id: string }) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const theme = useTheme()

  const { allowance, approve, saave } = useSaave()

  const { short } = useKashi()

  const sushiBalanceBigInt = useTokenBalance('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')
  const sushiBalance = formatFromBalance(sushiBalanceBigInt?.value, sushiBalanceBigInt?.decimals)
  const decimals = sushiBalanceBigInt?.decimals

  console.log('sushiBalance:', sushiBalance, sushiBalanceBigInt, decimals)

  // handle approval
  const [requestedApproval, setRequestedApproval] = useState(false)
  const handleApprove = useCallback(async () => {
    //console.log("SEEKING APPROVAL");
    try {
      setRequestedApproval(true)
      const txHash = await approve()
      console.log(txHash)
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approve, setRequestedApproval])

  // disable buttons if pendingTx, todo: styles could be improved
  const [pendingTx, setPendingTx] = useState(false)

  // track and parse user input for Deposit Input
  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])
  // used for max input button
  const maxDepositAmountInput = sushiBalanceBigInt
  //const atMaxDepositAmount = true
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(sushiBalance, true)
  }, [maxDepositAmountInput, onUserDepositInput, sushiBalance])

  console.log('state:', depositValue, maxSelected)

  return (
    <>
      <InputPanel id={id}>
        <Container>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                Input
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={handleMaxDeposit}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  Max Borrow: {sushiBalance} DAI
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
            {!allowance || Number(allowance) === 0 ? (
              <ButtonSelect onClick={handleApprove}>
                <Aligner>
                  <StyledButtonName>Approve</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            ) : (
              <ButtonSelect
                disabled={
                  pendingTx ||
                  !sushiBalance ||
                  Number(depositValue) === 0 ||
                  // todo this should be a bigInt comparison
                  Number(depositValue) > Number(sushiBalance)
                }
                onClick={async () => {
                  setPendingTx(true)
                  console.log('onClick, maxSelected:', maxSelected)
                  if (maxSelected) {
                    await saave(maxDepositAmountInput)
                  } else {
                    await saave(formatToBalance(depositValue, decimals))
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
      <div style={{ paddingTop: '10px' }}>
        <LeverageDetails />
      </div>
    </>
  )
}
