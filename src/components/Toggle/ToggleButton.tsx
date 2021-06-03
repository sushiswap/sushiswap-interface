import React, { FC, MouseEvent } from 'react'

export interface ToggleButtonProps {
    className?: string
    onClick: (e: MouseEvent<HTMLSpanElement>, index: number) => void
    active?: boolean
    value: any
}

const ToggleButton: FC<ToggleButtonProps> = ({
    className,
    active,
    onClick,
    children,
    value,
}) => {
    return (
        <span
            className={`text-sm font-bold flex items-center justify-center px-3 h-full cursor-pointer hover:text-primary ${
                active ? 'text-primary' : 'text-secondary'
            } ${className} `}
            onClick={(e) => onClick(e, value)}
        >
            {children}
        </span>
    )
}

export default ToggleButton
