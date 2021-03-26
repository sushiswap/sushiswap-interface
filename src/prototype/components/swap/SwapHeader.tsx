import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { RowBetween, RowFixed } from 'components/Row'
import RefreshButton from '../RefreshButton'
import GasIconButton from '../GasIconButton'
import SwapTypeToggle from './SwapTypeToggle'

const StyledSwapHeader = styled.div`
  padding: 1rem 1rem 0px 1rem;
  margin-bottom: -4px;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <SwapTypeToggle />
        <RowFixed>
          <GasIconButton />
          <RefreshButton />
          <Settings />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}
