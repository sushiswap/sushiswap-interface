import React from 'react'
import { keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'

function Button({ children, className, ...rest }: any): JSX.Element {
  return (
    <button className={`${className} focus:outline-none focus:ring disabled:opacity-50`} {...rest}>
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
    <Button
      className={`bg-blue bg-opacity-20 outline-blue rounded text-xs text-blue px-2 py-1 ${className} `}
      {...rest}
    >
      {children}
    </Button>
  )
}

export function PinkButtonOutlined({ children, className, ...rest }: any): JSX.Element {
  return (
    <Button
      className={`bg-pink bg-opacity-20 outline-pink rounded text-xs text-pink px-2 py-1 ${className} `}
      {...rest}
    >
      {children}
    </Button>
  )
}

export function BackButton({ defaultRoute }: { defaultRoute: string }): JSX.Element {
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
      className={`p-2 mr-4 rounded-full bg-dark-900 w-10 h-10`}
    >
      <ChevronLeft className={'w-6 h-6'} />
    </Button>
  )
}
