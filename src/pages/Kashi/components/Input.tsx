import React, { useState } from 'react'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import { ArrowDownRight } from 'react-feather'

import { StyledSwitch } from '../Pair/styled'

import styled from 'styled-components'

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.mediumEmphesisText};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0;
`

export const InputContainer = styled.div`
  height: 64px;
  border-radius: 20px;
  background-color: #2e3348;
  z-index: 1;
`

interface InputProps {
  id: string
  tokenAddress: string
  pairAddress: string
  tokenSymbol: string
}

interface InputContext {
  action: string
  tokenAddress: string
  tokenSymbol: string
  direction: string
  label: string
  value: string
}

function InputContext({ action, tokenAddress, tokenSymbol, direction, label, value }: InputContext) {
  const theme = useTheme()
  const [sourceOrDestination, setSourceOrDestination] = useState<'BentoBox' | 'Wallet'>('BentoBox')
  return (
    <>
      <TYPE.extraLargeHeader color={theme.highEmphesisText} fontWeight={700}>
        {action} {tokenSymbol}
      </TYPE.extraLargeHeader>
      <LabelRow>
        <RowBetween>
          <TYPE.body color={theme.mediumEmphesisText} fontWeight={700} fontSize={16}>
            <span>
              <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
            </span>
            <span>{direction} </span>
            <span>
              <StyledSwitch
                onClick={() => setSourceOrDestination(sourceOrDestination === 'BentoBox' ? 'Wallet' : 'BentoBox')}
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
            {label}: {value} {tokenSymbol}
          </TYPE.body>
        </RowBetween>
      </LabelRow>
    </>
  )
}

export default function InputPanel({ id, tokenAddress, pairAddress, tokenSymbol }: InputProps) {
  return (
    <>
      <InputContext
        action="Supply"
        tokenAddress={tokenAddress}
        tokenSymbol={tokenSymbol}
        direction="from"
        label="Balance"
        value="0"
      />
      <InputContainer></InputContainer>
    </>
  )
}
