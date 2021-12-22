import { classNames } from 'app/functions'
import React, { FC } from 'react'

export interface ModalContentProps {
  className?: string
}

const ModalContent: FC<ModalContentProps> = ({ children, className = '' }) => {
  return <div className={classNames('', className)}>{children}</div>
}

export default ModalContent
