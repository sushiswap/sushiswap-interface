import React from 'react'
import { Popover } from '@headlessui/react'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

function AppBar(): JSX.Element {
  return (
    <header className="flex-shrink-0 w-full">
      <Popover as="nav" className="z-10 w-full bg-transparent header-border-b">
        {({ open }) => (
          <>
            <DesktopNav mobileMenuOpen={open} />
            <MobileNav />
          </>
        )}
      </Popover>
    </header>
  )
}

export default AppBar
