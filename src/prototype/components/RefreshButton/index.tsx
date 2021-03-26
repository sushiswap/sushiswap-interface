import React from 'react'
import { StyledMenuButton } from '../StyledMenu'
import styled from 'styled-components'
import { RefreshCw } from 'react-feather'

const StyledRefreshIcon = styled(RefreshCw)`
  height: 16px;
  width: 16px;

  > * {
    stroke: ${({ theme }) => theme.text3};
  }

  :hover {
    opacity: 0.7;
  }
`

const RefreshButton = () => {
  return (
    <div style={{ marginLeft: '0.5rem' }}>
      <StyledMenuButton>
        <StyledRefreshIcon strokeWidth={3} />
      </StyledMenuButton>
    </div>
  )
}

export default RefreshButton
