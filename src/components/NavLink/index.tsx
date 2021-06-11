import Link, { LinkProps } from 'next/link'
import React, { Children } from 'react'

import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

const NavLink = ({
    children,
    activeClassName = 'text-high-emphesis',
    ...props
}) => {
    const { asPath } = useRouter()
    const child = Children.only(children)
    const childClassName = child.props.className || ''

    // pages/index.js will be matched via props.href
    // pages/about.js will be matched via props.href
    // pages/[slug].js will be matched via props.as

    const className =
        asPath === props.href || asPath === props.as
            ? `${childClassName} ${activeClassName}`.trim()
            : childClassName

    return (
        <Link href={props.href} {...props}>
            {React.cloneElement(child, {
                className: className || null,
            })}
        </Link>
    )
}

NavLink.propTypes = {
    activeClassName: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
}

export default NavLink
