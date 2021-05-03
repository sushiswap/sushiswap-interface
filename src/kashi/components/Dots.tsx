import React from 'react'
import { Dots as MovingDots } from 'components'

type Props = {
    children: any
    pending: boolean
    pendingTitle: string
}

export default function Dots({ children, pending, pendingTitle }: Props): any {
    return pending ? <MovingDots>{pendingTitle}</MovingDots> : children
}
