import React, { FC, ReactElement } from 'react'
import { ToggleButtonProps } from './ToggleButton'

interface ToggleButtonGroupProps {
    active: number
    children: ReactElement<ToggleButtonProps>[]
}

export const ToggleButtonGroup: FC<ToggleButtonGroupProps> = ({ children, active }) => {
    return (
        <div className="inline-flex items-center rounded-xl bg-dark-1000 p-1">
            <div className="text-md font-black whitespace-nowrap grid grid-flow-col">
                {React.Children.map(children, (child, index) =>
                    React.cloneElement(child, { index, active: index === active })
                )}
            </div>
        </div>
    )
}

export default ToggleButtonGroup
