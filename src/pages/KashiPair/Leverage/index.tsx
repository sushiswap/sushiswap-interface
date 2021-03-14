import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { WrapperNoPadding } from '../../../components/swap/styleds'

import { AutoColumn } from '../../../components/Column'
import LeverageInputPanel from './LeverageInputPanel'

export const PluginBody = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
`

export default function Stake() {
  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue)
  }, [])
  // used for max input button
  const maxAmountInput = '10000'
  const atMaxAmount = false
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput)
  }, [maxAmountInput, onUserInput])

  // find pair in masterchef

  return (
    <>
      <WrapperNoPadding id="stake-page">
        <AutoColumn>
          <LeverageInputPanel
            label={'Short DAI Against USDC'}
            disableCurrencySelect={true}
            customBalanceText={'Available to deposit: '}
            id="stake-liquidity-token"
            buttonText="Short"
          />
        </AutoColumn>
      </WrapperNoPadding>
    </>
  )
}
