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
    <Button className={`${className} bg-gradient-to-r from-blue to-pink`} {...rest}>
      {children}
    </Button>
  )
}
