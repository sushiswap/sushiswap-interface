import React, { FC, useState } from 'react'

import { HelpCircle } from 'react-feather'
// import Image from 'next/image'
import Image from '../Image'
import { ImageProps } from 'rebass'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps
    extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
    srcs: string[]
    width: string | number
    height: string | number
}

const normalize = (src) => {
    return src[0] === '/' ? src.slice(1) : src
}

const loader = ({ src }) => {
    return `http://res.cloudinary.com/dnz2bkszg/image/fetch/f_auto/${normalize(
        src
    )}`
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: FC<LogoProps> = ({ srcs, ...rest }) => {
    const [, refresh] = useState<number>(0)
    const src = srcs.find((src) => !BAD_SRCS[src])

    if (src) {
        return (
            <Image
                src={src}
                loader={loader}
                onError={() => {
                    if (src) BAD_SRCS[src] = true
                    refresh((i) => i + 1)
                }}
                {...rest}
            />
        )
    }

    return <HelpCircle {...rest} />
}

export default Logo
