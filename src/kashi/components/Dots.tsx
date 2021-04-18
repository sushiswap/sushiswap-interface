import React from 'react'
import styled from 'styled-components'

export const MovingDots = styled.span`
    &::after {
        display: inline-block;
        animation: ellipsis 1.25s infinite;
        content: '.';
        width: 1em;
        text-align: left;
    }
    @keyframes ellipsis {
        0% {
            content: '.';
        }
        33% {
            content: '..';
        }
        66% {
            content: '...';
        }
    }
`

type Props = {
    children: any
    pending: boolean,
    pendingTitle: string
}

export default function Dots({children, pending, pendingTitle}: Props): any {
    return pending ? (<MovingDots>{pendingTitle}</MovingDots>) : children
}