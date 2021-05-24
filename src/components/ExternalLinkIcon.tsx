import React, { HTMLProps, useCallback } from 'react'

import { ExternalLink } from 'react-feather'
import ReactGA from 'react-ga'
import styled from 'styled-components'

export const LinkIcon = styled(ExternalLink)`
    height: 16px;
    width: 18px;
    margin-left: 10px;
    // stroke: ${({ theme }) => theme.blue1};
`

const LinkIconWrapper = styled.a`
    text-decoration: none;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;

    :hover {
        text-decoration: none;
        opacity: 0.7;
    }

    :focus {
        outline: none;
        text-decoration: none;
    }

    :active {
        text-decoration: none;
    }
`

export function ExternalLinkIcon({
    target = '_blank',
    href,
    rel = 'noopener noreferrer',
    ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
    href: string
}) {
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
        <LinkIconWrapper target={target} rel={rel} href={href} onClick={handleClick} {...rest}>
            <LinkIcon />
        </LinkIconWrapper>
    )
}
