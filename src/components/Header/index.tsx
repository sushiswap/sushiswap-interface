import { Popover } from '@headlessui/react'
import Container from 'app/components/Container'
import { classNames } from 'app/functions'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

const Header: FC = () => {
  const { route } = useRouter()
  return (
    <header className={classNames(route.includes('swap') ? '' : 'header-border-b', 'flex-shrink-0 w-full')}>
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
