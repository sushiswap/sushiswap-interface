import { Popover } from '@headlessui/react'
import Container from 'app/components/Container'
import { classNames } from 'app/functions'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

interface HeaderProps {
  height?: number
}

const Header: FC<HeaderProps> = ({ height = 64 }) => {
  const { pathname } = useRouter()

  return (
    <>
      <header className="fixed z-20 flex-shrink-0 w-full filter" style={{ height }}>
        <Popover
          as="nav"
          className={classNames(
            pathname.includes('swap')
              ? ''
              : 'backdrop-blur-[20px] bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.12)]',
            'z-10 w-full'
          )}
        >
          {({ open }) => (
            <Container maxWidth="7xl" className="mx-auto">
              <DesktopNav mobileMenuOpen={open} />
              <MobileNav />
            </Container>
          )}
        </Popover>
      </header>
      <div style={{ height, minHeight: height }} />
    </>
  )
}

export default Header
