import { ChevronLeftIcon, XIcon } from '@heroicons/react/outline'

import React from 'react'
import Typography from '../Typography'

function ModalHeader({
    title = undefined,
    onClose = undefined,
    className = '',
    onBack = undefined
}: {
    title?: string
    className?: string
    onClose?: () => void
    onBack?: () => void
}): JSX.Element {
    return (
        <div className={`flex items-center justify-between py-2 mb-4 ${className}`}>
            {onBack && <ChevronLeftIcon onClick={onBack} width={24} height={24} className="cursor-pointer" />}
            {title && (
                <Typography component="h2" variant="h5" className="font-bold">
                    {title}
                </Typography>
            )}
            <div
                className="flex items-center justify-center w-6 h-6 cursor-pointer text-primary hover:text-high-emphesis"
                onClick={onClose}
            >
                <XIcon width={24} height={24} />
            </div>
        </div>
    )
}

export default ModalHeader
