import React, { FC } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

const StyledToggleButton = styled.button<{ selected?: boolean }>`
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.text3)}
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.bg2)};
  border-radius: 9px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 8px 12px;

  :focus,
  :hover {
    background-color: ${({ theme }) => lighten(0.05, theme.bg1)};
  }
`

export interface ToggleButtonProps {
  value: string
  selected?: boolean
}

const ToggleButton: FC<ToggleButtonProps> = props => {
  return <StyledToggleButton {...props} />
}

export default ToggleButton
