import QuestionHelper from './QuestionHelper'
import React from 'react'
import Settings from './Settings'

export type Color = 'pink' | 'blue'

const COLOR = {
    pink: 'checked:bg-pink checked:border-transparent focus:ring-pink',
    blue: 'checked:bg-blue checked:border-transparent focus:ring-blue'
}

export interface CheckboxProps {
    color: Color
    set: (value: boolean) => void
}

function Checkbox({
    color,
    set,
    className = '',
    ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    return (
        <input
            type="checkbox"
            onChange={event => set(event.target.checked)}
            className={`appearance-none h-5 w-5 rounded-sm bg-input border-transparent disabled:bg-dark-1000 disabled:border-dark-800 ${COLOR[color]} ${className}`}
            {...rest}
        />
    )
}

export default Checkbox
