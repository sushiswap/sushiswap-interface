import * as H from 'history'
import React, { HTMLProps, useCallback } from 'react'
import ReactGA from 'react-ga'
import {
    Link as ReactRouterLink,
    LinkProps as ReactRouterLinkProps,
    NavLink as ReactRouterNavLink,
    NavLinkProps as ReactRouterNavLinkProps
} from 'react-router-dom'

function Link<S = H.LocationState>({
    href = '#',
    children,
    className = 'text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis p-2 md:p-3',
    ...rest
}: React.PropsWithoutRef<ReactRouterLinkProps<S>> & React.RefAttributes<HTMLAnchorElement>): JSX.Element {
    return (
        <ReactRouterLink href={href} className={className} {...rest}>
            {children}
        </ReactRouterLink>
    )
}

export default Link

export function NavLink<S = H.LocationState>({
    href = '#',
    children,
    className = 'text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis p-2 md:p-3 whitespace-nowrap',
    ...rest
}: React.PropsWithoutRef<ReactRouterNavLinkProps<S>> & React.RefAttributes<HTMLAnchorElement>): JSX.Element {
    return (
        <ReactRouterNavLink href={href} className={className} activeClassName="text-high-emphesis" {...rest}>
            {children}
        </ReactRouterNavLink>
    )
}

export function ExternalLink({
    target = '_blank',
    href,
    children,
    rel = 'noopener noreferrer',
    className = '',
    ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }): JSX.Element {
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            // don't prevent default, don't redirect if it's a new tab
            if (target === '_blank' || event.ctrlKey || event.metaKey) {
                ReactGA.outboundLink({ label: href }, () => {
                    console.debug('Fired outbound link event', href)
                })
            } else {
                event.preventDefault()
                // send a ReactGA event and then trigger a location change
                ReactGA.outboundLink({ label: href }, () => {
                    window.location.href = href
                })
            }
        },
        [href, target]
    )

    return (
        <a
            target={target}
            rel={rel}
            href={href}
            onClick={handleClick}
            className={`text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis p-2 md:p-3 ${className}`}
            {...rest}
        >
            {children}
        </a>
    )
}
