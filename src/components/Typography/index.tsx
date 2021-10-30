import React from 'react'

import { classNames } from 'functions'

export type TypographyWeight = 400 | 500 | 700

const WEIGHTS = {
  400: 'font-medium',
  700: 'font-bold',
}

export type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'lg' | 'base' | 'sm' | 'xs' | 'xxs'

const VARIANTS = {
  hero: 'text-hero',
  h1: 'text-4xl leading-[28px]',
  h2: 'text-3xl tracking-[-0.02em]',
  h3: 'text-2xl leading-7 tracking-[-0.01em]',
  lg: 'text-lg leading-6',
  base: 'text-base leading-5',
  sm: 'text-sm leading-5',
  xs: 'text-xs leading-4',
  xxs: 'text-[0.625rem] leading-[1.2]',
}

export interface TypographyProps {
  variant?: TypographyVariant
  weight?: TypographyWeight
  component?: keyof React.ReactHTML
  className?: string
  clickable?: boolean
}

function Typography({
  variant = 'base',
  weight = 400,
  component = 'div',
  className = 'currentColor',
  clickable = false,
  children = [],
  onClick = undefined,
  ...rest
}: React.HTMLAttributes<React.ReactHTML> & TypographyProps): JSX.Element {
  return React.createElement(
    component,
    {
      className: classNames(VARIANTS[variant], WEIGHTS[weight], onClick ? 'cursor-pointer select-none' : '', className),
      onClick,
      ...rest,
    },
    children
  )
}

export default Typography
