import Container from 'app/components/Container'
import Image from 'app/components/Image'
import Main from 'app/components/Main'
import Popups from 'app/components/Popups'
import Link from 'next/link'
import React, { FC } from 'react'

interface LayoutProps {
  left?: JSX.Element
  right?: JSX.Element
}

const Layout: FC<LayoutProps> = ({ left, children, right }) => {
  return (
    <>
      <Main>
        <Container className="px-4 py-4 md:py-8 lg:py-12" maxWidth="7xl">
          <div className={`mb-2 grid grid-cols-12 gap-4`}>
            <div className="flex justify-center col-span-12 xl:col-span-3 lg:justify-start">
              <Link href="/borrow">
                <a className="flex justify-center xl:justify-start xl:mx-8">
                  <Image src="/images/kashi/logo.png" alt="Kashi" height={64} width={250} placeholder="empty" />
                </a>
              </Link>
            </div>
          </div>
          <div className={`grid grid-cols-12 gap-4 min-h-1/2`}>
            {left && (
              <div className={`hidden xl:block xl:col-span-3`} style={{ maxHeight: '40rem' }}>
                {left}
              </div>
            )}
            <div
              className={`col-span-12 ${right ? 'lg:col-span-8 xl:col-span-6' : 'xl:col-span-9'}`}
              style={{ minHeight: '40rem' }}
            >
              {children}
            </div>
            {right && (
              <div className="col-span-12 lg:col-span-4 xl:col-span-3" style={{ maxHeight: '40rem' }}>
                {right}
              </div>
            )}
          </div>
        </Container>
      </Main>
      <Popups />
    </>
  )
}

export default Layout
