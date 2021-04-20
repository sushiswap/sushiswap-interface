import React from 'react'

export default function AppBody(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    return <div className="relative w-full max-w-lg rounded bg-dark-900" {...props} />
}
