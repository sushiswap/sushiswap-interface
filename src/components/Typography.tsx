import { classNames } from 'functions'
import React, { FunctionComponent } from 'react'

export type TypographyWeight = 400 | 700

export type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'caption' | 'caption2'

const VARIANTS = {
    hero: 'text-hero',
    h1: 'text-h1',
    h2: 'text-h2',
    h3: 'text-h3',
    h4: 'text-h4',
    h5: 'text-h5',
    body: 'text-body',
    caption: 'text-caption',
    caption2: 'text-caption-2'
}

export interface TypographyProps {
    variant?: TypographyVariant
    weight?: TypographyWeight
    component?: keyof React.ReactHTML
    className?: string
    children?: React.ReactNode
}

function Typography({
    variant = 'body',
    weight = 400,
    component = 'div',
    className = 'text-primary',
    children = []
}: TypographyProps): JSX.Element {
    return React.createElement(component, { className: classNames(VARIANTS[variant], className) }, children)
}

export default Typography
