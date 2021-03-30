import React, { useState, useCallback } from 'react'
import { Pair } from '@sushiswap/sdk'
import styled from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from 'components/Row'
import { Input as NumericalInput } from 'components/NumericalInput'
import { TYPE } from 'theme'
import { useActiveWeb3React } from 'hooks'
import { useTranslation } from 'react-i18next'
import useTheme from 'hooks/useTheme'
import useTokenBalance from 'sushi-hooks/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../utils'
import useSushiBar from 'sushi-hooks/useSushiBar'

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
  color: ${({ theme }) => theme.white};
  border-radius: ${({ theme }) => theme.borderRadius};
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

const StyledBalanceMax = styled.button`
  height: 28px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
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
  lpTokenAddress?: string
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  id: string
  customBalanceText?: string
  buttonText?: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
}

export default function CurrencyInputPanel({
  label = 'Input',
  lpTokenAddress,
  disableCurrencySelect = false,
  hideBalance = false,
  hideInput = false,
  id,
  customBalanceText,
  buttonText,
  cornerRadiusBottomNone,
  cornerRadiusTopNone
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const theme = useTheme()

  const { allowance, approve, enter } = useSushiBar()

  const sushiBalanceBigInt = useTokenBalance('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')
  const sushiBalance = formatFromBalance(sushiBalanceBigInt?.value, sushiBalanceBigInt?.decimals)
  const decimals = sushiBalanceBigInt?.decimals

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

  return (
    <>
      {/* Deposit Input */}
      <InputPanel id={id}>
        <Container
          hideInput={hideInput}
          cornerRadiusBottomNone={cornerRadiusBottomNone}
          cornerRadiusTopNone={cornerRadiusTopNone}
        >
          {!hideInput && (
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {label}
                </TYPE.body>
                {account && (
                  <TYPE.body
                    onClick={handleMaxDeposit}
                    color={theme.text2}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    SUSHI Balance: {sushiBalance}
                  </TYPE.body>
                )}
              </RowBetween>
            </LabelRow>
          )}
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
            {!allowance || Number(allowance) === 0 ? (
              <ButtonSelect onClick={handleApprove} disabled={requestedApproval}>
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
                  Number(depositValue) > Number(sushiBalance)
                }
                onClick={async () => {
                  setPendingTx(true)
                  if (maxSelected) {
                    await enter(maxDepositAmountInput)
                  } else {
                    await enter(formatToBalance(depositValue, decimals))
                  }
                  setPendingTx(false)
                }}
              >
                <Aligner>
                  <StyledButtonName>Deposit</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
