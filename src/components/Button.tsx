import React from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'

const SIZE = {
    default: 'p-3',
    small: 'px-2 py-1',
    large: 'px-4 py-2'
}

const FILLED = {
    default: 'bg-transparent',
    primary:
        'bg-dark-600 bg-opacity-80 w-full rounded text-base text-high-emphesis hover:bg-opacity-100 disabled:opacity-80',
    blue: 'bg-blue bg-opacity-80 w-full rounded text-base text-high-emphesis hover:bg-opacity-100 disabled:opacity-80',
    pink: 'bg-pink bg-opacity-80 w-full rounded text-base text-high-emphesis hover:bg-opacity-100 disabled:opacity-80',
    gradient: 'w-full text-high-emphesis bg-gradient-to-r from-blue to-pink'
}

const OUTLINED = {
    default: 'bg-transparent',
    primary: '',
    blue:
        'bg-blue bg-opacity-20 outline-blue rounded text-xs text-blue hover:bg-opacity-40 disabled:opacity-20 disabled:cursor-not-allowed',
    pink: 'bg-pink bg-opacity-20 outline-pink rounded text-xs text-pink hover:bg-opacity-40 disabled:opacity-20',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const VARIANT = {
    outlined: OUTLINED,
    filled: FILLED
}

export type ButtonColor = 'blue' | 'pink' | 'gradient' | 'default' | 'primary'

export type ButtonSize = 'small' | 'large' | 'default'

export type ButtonVariant = 'outlined' | 'filled'

export interface ButtonProps {
    color?: ButtonColor
    size?: ButtonSize
    variant?: ButtonVariant
}

function Button({
    children,
    className = '',
    color = 'default',
    size = 'default',
    variant = 'filled',
    ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
    return (
        <button
            className={`${VARIANT[variant][color]} ${SIZE[size]} rounded focus:outline-none focus:ring ${className}`}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button

// export function IconButton() {}

export function BackButton({ defaultRoute, className }: { defaultRoute: string; className?: string }): JSX.Element {
    const history = useHistory()
    return (
        <button
            onClick={() => {
                if (history.length < 3) {
                    history.push(defaultRoute)
                } else {
                    history.goBack()
                }
            }}
            className={`flex justify-center items-center p-2 mr-4 rounded-full bg-dark-900 w-12 h-12 ${className ||
                ''}`}
        >
            <ChevronLeft className={'w-6 h-6'} />
        </button>
    )
}
