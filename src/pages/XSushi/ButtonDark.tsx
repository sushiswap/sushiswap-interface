import React from 'react'

interface ButtonDarkProps {
    className?: string
    children?: React.ReactChild | React.ReactChild[]
}

export default function ButtonDark({ className, children }: ButtonDarkProps) {
    return (
        <button
            className={`
            flex flex-grow justify-center items-center
            rounded
            bg-dark-700 text-high-emphesis
            focus:outline-none focus:ring hover:bg-opacity-80
            ${className}
        `}
        >
            {children}
        </button>
    )
}
