import React from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'

const SIZE = {
    default: 'px-3 py-2',
    small: 'px-3 py-1',
    large: 'px-4 py-3'
}

const FILLED = {
    default: 'bg-transparent',
    blue: 'bg-blue bg-opacity-80 w-full rounded text-caption2 text-high-emphesis hover:bg-opacity-100',
    pink: 'bg-pink bg-opacity-80 w-full rounded text-caption2 text-high-emphesis hover:bg-opacity-100',
    gray: 'bg-dark-700 w-full rounded text-caption2 text-secondary hover:bg-opacity-40',
    gradient: 'w-full text-caption2 text-high-emphesis bg-gradient-to-r from-blue to-pink'
}

const OUTLINED = {
    default: 'bg-transparent',
    blue: 'bg-blue bg-opacity-20 outline-blue rounded text-caption2 text-blue hover:bg-opacity-40',
    pink: 'bg-pink bg-opacity-20 outline-pink rounded text-caption2 text-pink hover:bg-opacity-40',
    gray: 'bg-dark-700 bg-opacity-20 outline-dark-700 rounded text-caption2 text-dark-700 hover:bg-opacity-40',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const VARIANT = {
    outlined: OUTLINED,
    filled: FILLED
}

export type ButtonColor = 'blue' | 'pink' | 'gradient' | 'gray' | 'default'

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
            className={`${VARIANT[variant][color]} ${SIZE[size]} rounded focus:outline-none focus:ring disabled:opacity-50 font-medium ${className}`}
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
