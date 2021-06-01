import React, { FC, ReactElement } from 'react'
import { ToggleButtonProps } from './ToggleButton'

interface ToggleButtonGroupProps {
    active: any
    children: ReactElement<ToggleButtonProps>[]
    className?: string
}

export const ToggleButtonGroup: FC<ToggleButtonGroupProps> = ({ className = '', children, active }) => {
    return (
        <div
            className={`inline-flex items-center rounded-md bg-dark-900 p-px font-black whitespace-nowrap grid grid-flow-col ${className}`}
        >
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { active: child.props.value === active })
            )}
        </div>
    )
}

export default ToggleButtonGroup
