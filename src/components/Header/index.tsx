import { Popover } from '@headlessui/react'
import Container from 'app/components/Container'
import React, { FC } from 'react'

import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

interface HeaderProps {
  height?: number
}

const Header: FC<HeaderProps> = ({ height = 64 }) => {
  return (
    <>
      <header className="flex-shrink-0 w-full fixed z-20 filter" style={{ height }}>
        <Popover
          as="nav"
          className="z-10 w-full backdrop-blur-[20px] bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.12)]"
        >
          {({ open }) => (
            <Container maxWidth="7xl" className="mx-auto">
              <DesktopNav mobileMenuOpen={open} />
              <MobileNav />
            </Container>
          )}
        </Popover>
      </header>
      <div style={{ height }} />
    </>
  )
}

export default Header
