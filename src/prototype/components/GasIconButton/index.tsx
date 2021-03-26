import React from 'react'
import { StyledMenuButton } from '../StyledMenu'
import styled from 'styled-components'
import { TYPE } from 'theme'
import useTheme from '../../../hooks/useTheme'

const StyledGasIcon = styled.span`
  color: ${({ theme }) => theme.green1};
  > * {
    stroke: ${({ theme }) => theme.green1};
  }

  :hover {
    opacity: 0.7;
  }
`

const GasIconButton = () => {
  const theme = useTheme()

  return (
    <StyledMenuButton style={{ display: 'flex', alignItems: 'center' }}>
      <StyledGasIcon>
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" style={{ height: 22, width: 22 }}>
          <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 13.5V19H6v-7h6v1.5zm0-3.5H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path>{' '}
        </svg>
      </StyledGasIcon>
      <TYPE.body fontWeight={600} color={theme.green1} display="inline" style={{ marginLeft: '2px' }}>
        26
      </TYPE.body>
    </StyledMenuButton>
  )
}

export default GasIconButton
