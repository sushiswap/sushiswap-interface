import React from 'react'
import { keyframes } from 'styled-components'

function Button({ children, className, ...rest }: any): JSX.Element {
  return (
    <button className={`focus:outline-none focus:ring ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button

export function GradientButton({ children, className, ...rest }: any): JSX.Element {
  return (
    <Button className={`bg-gradient-to-r from-blue to-pink ${className} `} {...rest}>
      {children}
    </Button>
  )
}

export function BlueButton({ children, className, ...rest }: any): JSX.Element {
  return (
    <Button className={`bg-blue w-full rounded text-base text-high-emphesis px-4 py-3 ${className} `} {...rest}>
      {children}
    </Button>
  )
}

export function PinkButton({ children, className, ...rest }: any): JSX.Element {
  return (
    <Button className={`bg-pink w-full rounded text-base text-high-emphesis px-4 py-3 ${className}`} {...rest}>
      {children}
    </Button>
  )
}

export function BlueButtonOutlined({ children, className, ...rest }: any): JSX.Element {
  return (
    <Button className={`bg-blue bg-opacity-20 rounded text-xs text-blue px-2 py-1 ${className} `} {...rest}>
      {children}
    </Button>
  )
}
