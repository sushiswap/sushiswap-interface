import React from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'

const SIZE = {
    default: '',
    small: '',
    large: ''
}

const FILLED = {
    default: 'bg-transparent',
    blue: 'bg-blue bg-opacity-80 w-full rounded text-base text-high-emphesis px-4 py-3 hover:bg-opacity-100',
    pink: 'bg-pink bg-opacity-80 w-full rounded text-base text-high-emphesis px-4 py-3 hover:bg-opacity-100',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const OUTLINED = {
    default: 'bg-transparent',
    blue: 'bg-blue bg-opacity-20 outline-blue rounded text-xs text-blue px-2 py-1 hover:bg-opacity-40',
    pink: 'bg-pink bg-opacity-20 outline-pink rounded text-xs text-pink px-2 py-1 hover:bg-opacity-40',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const VARIANT = {
    outlined: OUTLINED,
    filled: FILLED
}

export type ButtonColor = 'blue' | 'pink' | 'gradient' | 'default'

export type ButtonSize = 'small' | 'large' | 'default'

export type ButtonVariant = 'outlined' | 'filled'

export interface ButtonProps {
    children?: React.ReactChild | React.ReactChild[]
    color?: ButtonColor
    size?: ButtonSize
    variant?: ButtonVariant
}

function Button({
    children,
    className,
    color = 'default',
    size = 'default',
    variant = 'filled',
    ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
    return (
        <button
            className={`${VARIANT[variant][color]} ${SIZE[size]} focus:outline-none focus:ring disabled:opacity-50 ${className}`}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button

export function BackButton({ defaultRoute, className }: { defaultRoute: string; className?: string }): JSX.Element {
    const history = useHistory()
    return (
        <Button
            onClick={() => {
                if (history.length < 3) {
                    history.push(defaultRoute)
                } else {
                    history.goBack()
                }
            }}
            className={`p-2 mr-4 rounded-full bg-dark-900 w-10 h-10 ${className || ''}`}
        >
            <ChevronLeft className={'w-6 h-6'} />
        </Button>
    )
}
