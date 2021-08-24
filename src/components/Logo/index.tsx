import { IconProps } from 'react-feather'
import React, { FC, useState } from 'react'

import Image from '../Image'
import { classNames } from '../../functions'
import { cloudinaryLoader } from '../../functions/cloudinary'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export type LogoProps = {
  srcs: string[]
  width: string | number
  height: string | number
  alt?: string
} & IconProps

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: FC<LogoProps> = ({ srcs, width, height, style, alt = '', className, ...rest }) => {
  const [, refresh] = useState<number>(0)
  const src = srcs.find((src) => !BAD_SRCS[src])
  return (
    <div className="rounded" style={{ width, height, ...style }}>
      <Image
        src={src || 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png'}
        loader={cloudinaryLoader}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
        width={width}
        height={height}
        alt={alt}
        layout="fixed"
        className={classNames('rounded', className)}
        {...rest}
      />
    </div>
  )
}

export default Logo
