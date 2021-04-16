import React from 'react'

// interface LinkProps {}

function Link({
    href = '#',
    children,
    className = 'text-baseline text-primary hover:text-high-emphesis',
    ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>): JSX.Element {
    return (
        <a href={href} className={className} {...rest}>
            {children}
        </a>
    )
}

export default Link
