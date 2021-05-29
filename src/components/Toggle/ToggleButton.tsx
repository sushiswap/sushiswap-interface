import React, { FC, MouseEvent } from 'react'

export interface ToggleButtonProps {
    className?: string
    onClick: (e: MouseEvent<HTMLSpanElement>, index: number) => void
    index?: number
    active?: boolean
}

const ToggleButton: FC<ToggleButtonProps> = ({ className, active, onClick, index, children }) => {
    return (
        <span
            className={`text-xs flex items-center justify-center rounded-sm px-3 py-1.5 cursor-pointer hover:text-primary ${
                active ? 'text-primary' : 'text-secondary'
            } ${active ? 'bg-dark-900' : 'bg-dark-1000'} ${className} `}
            onClick={(e) => onClick(e, index)}
        >
            {children}
        </span>
    )
}

export default ToggleButton
