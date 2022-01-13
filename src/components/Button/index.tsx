import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'

import Dots from '../Dots'

export type ButtonColor = 'red' | 'blue' | 'pink' | 'yellow' | 'purple' | 'gray' | 'green' | 'gradient' | 'white'
export type ButtonSize = 'xs' | 'sm' | 'lg' | 'default' | 'none'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'

const DIMENSIONS = {
  xs: 'px-2 h-[28px]',
  sm: 'px-3 h-[36px]',
  md: 'px-4 h-[52px]',
  lg: 'px-6 h-[60px]',
}

const SIZE = {
  xs: 'text-xs rounded',
  sm: 'text-sm rounded',
  md: 'rounded-xl',
  lg: 'text-lg rounded-2xl',
}

const FILLED = {
  red: 'bg-red hover:bg-red-600 text-white',
  blue: 'bg-blue hover:bg-blue-600 text-white',
  pink: 'bg-pink hover:bg-pink-600 text-white',
  yellow: 'bg-yellow hover:bg-yellow-600 text-black',
  purple: 'bg-purple hover:bg-purple-600 text-white',
  gray: 'bg-dark-700 hover:bg-dark-800 text-white',
  green: 'bg-green hover:bg-green-600 text-black',
  gradient: 'bg-gradient-to-r from-blue to-pink text-white',
  white: 'bg-gray-50 hover:bg-gray-200 text-black',
}

const OUTLINED = {
  red: 'border border-red/50 bg-red/5 text-red hover:border-red/40',
  blue: 'border border-blue/50 bg-blue/5 text-blue hover:border-blue/40',
  pink: 'border border-pink/50 bg-pink/5 text-pink hover:border-pink/40',
  yellow: 'border border-yellow/50 bg-yellow/5 text-yellow hover:border-yellow/40',
  purple: 'border border-purple/50 bg-purple/5 text-purple hover:border-purple/40',
  green: 'border border-green/50 bg-green/5 text-green hover:border-green/40',
  gray: 'border border-dark-700 bg-dark-700/5 text-white hover:border-dark-800',
  white: 'border border-white/50 bg-white/5 text-white hover:border-gray-400/50',
  gradient:
    'border border-transparent hover:border-gradient-r-blue-pink-hover-dark-900 border-gradient-r-blue-pink-dark-900 text-white',
}

const EMPTY = {
  red: 'text-red hover:text-red-600',
  blue: 'text-blue hover:text-blue-600',
  pink: 'text-pink hover:text-pink-600',
  yellow: 'text-yellow hover:text-yellow-700',
  purple: 'text-purple hover:text-purple-600',
  green: 'text-green hover:text-green-700',
  gray: 'text-gray-300 hover:text-gray-400',
  white: 'text-white hover:border-gray-400/50 hover:text-gray-300',
  gradient: 'bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent hover:from-blue-600 hover:to-pink-600',
}

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
  empty: EMPTY,
}

type Button = React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> & {
  Dotted: FC<DottedButtonProps>
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode
  endIcon?: ReactNode
  color?: ButtonColor
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      color = 'blue',
      size = 'md',
      variant = 'filled',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          rest.disabled ? VARIANT[variant]['gray'] : VARIANT[variant][color],
          SIZE[size],
          variant !== 'empty' ? DIMENSIONS[size] : '',
          fullWidth ? 'w-full' : '',
          'font-bold disabled:opacity-40 disabled:pointer-events-none focus:outline-none flex items-center justify-center gap-1',
          className
        )}
        {...rest}
      >
        {startIcon && startIcon}
        {children}
        {endIcon && endIcon}
      </button>
    )
  }
)

export function ButtonConfirmed({
  confirmed,
  disabled,
  ...rest
}: { confirmed?: boolean; disabled?: boolean } & ButtonProps) {
  if (confirmed) {
    return (
      <Button
        variant="outlined"
        color="green"
        size="lg"
        className={classNames(disabled && 'cursor-not-allowed', 'border opacity-50')}
        disabled={disabled}
        {...rest}
      />
    )
  } else {
    return <Button color="gradient" size="lg" disabled={disabled} {...rest} />
  }
}

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean
  disabled?: boolean
} & ButtonProps) {
  if (error) {
    return <Button color="red" size="lg" {...rest} />
  } else {
    return <Button color="gradient" disabled={disabled} size="lg" {...rest} />
  }
}

interface DottedButtonProps extends ButtonProps {
  pending: boolean
}

export const ButtonDotted: FC<DottedButtonProps> = ({ pending, children, ...rest }) => {
  const buttonText = pending ? <Dots>{children}</Dots> : children
  return (
    <Button {...rest} {...(pending && { disabled: true })}>
      {buttonText}
    </Button>
  )
}

export default Button
