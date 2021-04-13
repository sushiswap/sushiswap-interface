import React from 'react'

export default function AppBody(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    return <div className="relative w-full max-w-sm rounded bg-dark-800" {...props} />
}
