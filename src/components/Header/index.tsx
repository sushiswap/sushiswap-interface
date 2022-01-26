import Mobile from 'app/components/Header/Mobile'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'

import Desktop from './Desktop'

interface Header {
  fixed?: boolean
  containerized?: boolean
  className?: string
}

const Header: FC<Header> = ({ fixed = true, containerized = true, className }) => {
  const isDesktop = useDesktopMediaQuery()
  return <>{isDesktop ? <Desktop fixed={fixed} containerized={containerized} className={className} /> : <Mobile />}</>
}

export default Header
