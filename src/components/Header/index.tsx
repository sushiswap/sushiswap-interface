import { Popover } from '@headlessui/react'
import useScrollPosition from '@react-hook/window-scroll'
import Container from 'app/components/Container'
import { classNames } from 'app/functions'
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'

import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

const HEADER_HEIGHT = 64

const Header: FC = () => {
  const { pathname } = useRouter()
  const scrollY = useScrollPosition()

  return (
    <>
      <header className="fixed z-20 flex-shrink-0 w-full filter" style={{ height: HEADER_HEIGHT }}>
        <Popover as={Fragment}>
          {({ open }) => {
            return (
              <nav
                className={classNames(
                  'backdrop-blur-[20px] bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.12)]',
                  'z-10 w-full'
                )}
              >
                <Container maxWidth="7xl" className="mx-auto">
                  <DesktopNav mobileMenuOpen={open} />
                  <MobileNav />
                </Container>
              </nav>
            )
          }}
        </Popover>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Header
