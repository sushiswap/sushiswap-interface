import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { WrapperNoPadding } from '../../../components/swap/styleds'

import { AutoColumn } from '../../../components/Column'
import SupplyInputPanel from './SupplyInputPanel'
import WithdrawInputPanel from './WithdrawInputPanel'

export const PluginBody = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
`

interface SupplyProps {
  tokenAddress: string
  tokenSymbol: string
  pairAddress: string
}
export default function Supply({ tokenAddress, tokenSymbol, pairAddress }: SupplyProps) {
  return (
    <>
      <WrapperNoPadding id="stake-page">
        <AutoColumn gap="sm">
          <SupplyInputPanel
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            pairAddress={pairAddress}
            disableCurrencySelect={true}
            id="supply-collateral-token"
          />
          <WithdrawInputPanel
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            pairAddress={pairAddress}
            disableCurrencySelect={true}
            id="withdraw-collateral-token"
          />
        </AutoColumn>
      </WrapperNoPadding>
    </>
  )
}
