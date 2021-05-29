import React, { FunctionComponent } from 'react'

import { classNames } from '../../functions'

export type TypographyWeight = 400 | 700

export type TypographyVariant =
    | 'hero'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'body'
    | 'caption'
    | 'caption2'

const VARIANTS = {
    hero: 'text-hero',
    h1: 'text-h1',
    h2: 'text-h2',
    h3: 'text-h3',
    h4: 'text-h4',
    h5: 'text-h5',
    body: 'text-body',
    caption: 'text-caption',
    caption2: 'text-caption2',
}

export interface TypographyProps {
    variant?: TypographyVariant
    weight?: TypographyWeight
    component?: keyof React.ReactHTML
    className?: string
    children?: React.ReactNode
    clickable?: boolean
}

function Typography({
    variant = 'body',
    weight = 400,
    component = 'div',
    className = 'text-primary',
    clickable = false,
    children = [],
    onClick = undefined,
    ...rest
}: React.HTMLAttributes<React.ReactHTML> & TypographyProps): JSX.Element {
    return React.createElement(
        component,
        {
            className: classNames(
                VARIANTS[variant],
                onClick ? 'cursor-pointer' : '',
                className
            ),
            onClick,
            ...rest,
        },
        children
    )
}

export default Typography
