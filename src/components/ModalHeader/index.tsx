import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

import Typography from '../Typography'

interface ModalHeaderProps {
  title?: string
  className?: string
  onClose?: () => void
  onBack?: () => void
}

const ModalHeader: FC<ModalHeaderProps> = ({
  title = undefined,
  className = '',
  onClose = undefined,
  onBack = undefined,
}) => {
  return (
    <div className={classNames(className, 'flex items-center justify-between')}>
      {onBack ? (
        <ArrowLeftIcon onClick={onBack} width={24} height={24} className="cursor-pointer text-high-emphesis" />
      ) : (
        <Typography weight={700} className="text-high-emphesis">
          {title}
        </Typography>
      )}
      <div className="flex items-center justify-center w-6 h-6 cursor-pointer" onClick={onClose}>
        <XIcon width={24} height={24} className="text-high-emphesis" />
      </div>
    </div>
  )
}

export default ModalHeader
