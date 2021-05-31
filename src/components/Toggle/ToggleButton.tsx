import React, { FC, MouseEvent } from 'react'

export interface ToggleButtonProps {
    className?: string
    onClick: (e: MouseEvent<HTMLSpanElement>, index: number) => void
    active?: boolean
    value: any
}

const ToggleButton: FC<ToggleButtonProps> = ({ className, active, onClick, children, value }) => {
    return (
        <span
            className={`text-xs flex items-center justify-center rounded-sm px-3 py-1.5 cursor-pointer hover:text-primary ${
                active ? 'text-primary' : 'text-secondary'
            } ${active ? 'bg-dark-700' : 'bg-dark-900'} ${className} `}
            onClick={(e) => onClick(e, value)}
        >
            {children}
        </span>
    )
}

export default ToggleButton
