import React from 'react'

export type Color = 'pink' | 'blue'

const COLOR = {
    pink: 'checked:bg-pink checked:border-transparent focus:ring-pink',
    blue: 'checked:bg-blue checked:border-transparent focus:ring-blue'
}

export interface CheckboxProps {
    color: Color
}

function Checkbox({
    color,
    className = '',
    ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    return (
        <input
            type="checkbox"
            className={`appearance-none h-5 w-5 bg-dark-1000 border-dark-800 ${COLOR[color]} ${className}`}
            {...rest}
        />
    )
}

export default Checkbox
