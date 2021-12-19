import Button, { ButtonProps } from 'app/components/Button'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

export interface ModalActionProps extends ButtonProps {
  main?: boolean
}

const ModalAction: FC<ModalActionProps> = ({ children, main = false, ...props }) => {
  return (
    <Button
      {...props}
      variant="empty"
      className={classNames(
        main
          ? '!text-blue border border-blue/20 hover:border-blue/80'
          : 'border border-dark-700/80 hover:border-gray-700',
        'p-3 text-sm h-[38px]'
      )}
    >
      {children}
    </Button>
  )
}

export default ModalAction
