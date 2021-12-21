import Button, { ButtonProps } from 'app/components/Button'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

export interface ModalActionProps extends ButtonProps {
  main?: boolean
}

const ModalAction: FC<ModalActionProps> = ({ children, disabled, main = false, ...props }) => {
  return (
    <Button
      {...props}
      disabled={disabled}
      variant="empty"
      className={classNames(
        disabled
          ? 'border-dark-700 opacity-40'
          : main
          ? '!text-blue border-blue/20 hover:border-blue/80'
          : 'border-dark-700/80 hover:border-gray-700',
        'border p-3 text-sm h-[38px]'
      )}
    >
      {children}
    </Button>
  )
}

export default ModalAction
