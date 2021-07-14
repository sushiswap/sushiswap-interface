import React from 'react'

export type BadgeColor = 'default' | 'blue' | 'pink'

export interface BadgeProps {
    children?: React.ReactChild | React.ReactChild[]
    color?: BadgeColor
}

export const COLOR = {
    default: '',
    blue: 'bg-blue bg-opacity-20 outline-blue rounded text-xs text-blue px-2 py-1',
    pink: 'bg-pink bg-opacity-20 outline-pink rounded text-xs text-pink px-2 py-1'
}

function Badge({
    color = 'default',
    children,
    className = ''
}: BadgeProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    return <div className={`${COLOR[color]} ${className}`}>{children}</div>
}

export default Badge
