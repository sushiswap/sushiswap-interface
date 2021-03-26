import React, { FC } from 'react'
import styled from 'styled-components'
import { ToggleButtonProps } from '../ToggleButton'

const StyledToggleButtonGroup = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2px;

  > *:first-child {
    margin-left: 0;
  }

  > * {
    margin-left: 2px;
  }
`

interface ToggleButtonGroupProps {
  value: any
  onChange: (event: React.MouseEvent<HTMLElement>, newType: any) => void
  children?: React.ReactElement<ToggleButtonProps> | React.ReactElement<ToggleButtonProps>[]
}

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = ({ value, onChange, children }) => {
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => onChange(e, child.props.value),
        selected: value === child.props.value
      })
    }
    return child
  })

  return <StyledToggleButtonGroup>{childrenWithProps}</StyledToggleButtonGroup>
}

export default ToggleButtonGroup
