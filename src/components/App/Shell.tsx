import React from 'react'

type Background = 'blue' | 'pink'

interface AppShellProps {
    background: Background
}

const BACKGROUND = {
    blue: 'bg-dark-1000',
    pink: '#0D0415'
}

function Shell({ background = 'blue', ...rest }: React.HTMLAttributes<HTMLDivElement> & AppShellProps): JSX.Element {
    return <div className={`flex flex-col items-start overflow-x-hidden h-full ${BACKGROUND[background]}`} {...rest} />
}

export default Shell
