import Button, { ButtonProps } from 'app/components/Button'
import React, { FC } from 'react'

export interface ModalActionProps extends ButtonProps {
  main?: boolean
}

const ModalAction: FC<ModalActionProps> = ({ children, disabled, main = false, ...props }) => {
  return (
    <Button {...props} size="sm" color={main ? 'blue' : 'gray'} disabled={disabled} variant="outlined">
      {children}
    </Button>
  )
}

export default ModalAction
