import { Popover } from '@headlessui/react'
import Container from 'app/components/Container'
import React, { FC } from 'react'

import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

interface HeaderProps {
  height: number
}

const Header: FC<HeaderProps> = ({ height }) => {
  return (
    <header
      className="flex-shrink-0 w-full fixed z-20 filter backdrop-blur-[20px] bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.12)]"
      style={{ height }}
    >
      <Container maxWidth="7xl" className="mx-auto">
        <Popover as="nav" className="z-10 w-full bg-transparent">
          {({ open }) => (
            <>
              <DesktopNav mobileMenuOpen={open} />
              <MobileNav />
            </>
          )}
        </Popover>
      </Container>
    </header>
  )
}

export default Header
