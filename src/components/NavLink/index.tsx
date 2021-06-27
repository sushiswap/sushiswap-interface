import Link, { LinkProps } from 'next/link'
import React, { Children } from 'react'

import { useRouter } from 'next/router'

const NavLink = ({ children, activeClassName = 'text-high-emphesis', ...props }) => {
  const { asPath, pathname } = useRouter()
  const child = Children.only(children)
  const childClassName = child.props.className || ''

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as

  // console.log({ props, asPath, pathname })

  // const className =
  //   asPath === props.href ||
  //   asPath === props.as ||
  //   asPath.startsWith(props.href) ||
  //   asPath.startsWith(props.href.pathname)
  //     ? `${childClassName} ${activeClassName}`.trim()
  //     : childClassName

  const className =
    asPath === props.href || asPath === props.as ? `${childClassName} ${activeClassName}`.trim() : childClassName

  return (
    <Link href={props.href} {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}

export default NavLink
