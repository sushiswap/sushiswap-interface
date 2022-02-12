import Container from 'app/components/Container'
import Image from 'app/components/Image'
import Main from 'app/components/Main'
import NavLink from 'app/components/NavLink'
import Popups from 'app/components/Popups'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface LayoutProps {
  left?: JSX.Element
  right?: JSX.Element
}

const Layout: FC<LayoutProps> = ({ left, children, right }) => {
  const router = useRouter()
  return (
    <>
      <Main>
        <Container className="px-4 py-4 md:py-8 lg:py-12" maxWidth="7xl">
          <div className={`mb-2 grid grid-cols-12 gap-4`}>
            <div className="flex justify-center col-span-12 xl:col-span-3 lg:justify-start">
              <Link href="/borrow">
                <a className="flex justify-center xl:justify-start xl:mx-8">
                  <Image
                    src="https://app.sushi.com/images/kashi/logo.png"
                    alt="Kashi"
                    height={64}
                    width={250}
                    placeholder="empty"
                    priority
                  />
                </a>
              </Link>
            </div>
            <div className="flex items-end col-span-12 xl:col-span-9">
              <nav className="flex items-center justify-end w-full">
                <div className="flex pr-2 sm:pr-4">
                  <NavLink href="/portfolio">
                    <a
                      className={`px-2 sm:px-4 flex justify-end items-center font-medium ${
                        router.pathname === '/portfolio' ? 'text-high-emphesis' : 'text-secondary hover:text-primary'
                      }`}
                    >
                      <svg
                        className="mr-2 fill-current"
                        width={24}
                        height={24}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 355.24 205.5"
                      >
                        <path d="M350.43,97c-8.7-20-28.9-43.7-56.7-63.5S237.13,2,215.43.2c-1.2-.1-2.4-.2-3.5-.2H76.53c-13,0-23,4-28.4,11.7L4.63,72.3c-6.3,8.8-6.1,21.7.2,36.2,8.7,20,29,43.7,56.7,63.5s56.7,31.5,78.4,33.3c1.7.1,3.3.2,4.9.2h135.5c12.1-.4,21.5-4.3,26.8-11.6l43.4-60.6C356.93,124.3,356.73,111.5,350.43,97ZM209.93,7.4c1.6,0,3.2.1,4.9.2,20.7,1.7,48.2,13,74.6,31.9,4.3,3.1,11.8,9.7,15.7,12.9H188.43l-45-45ZM41.06,40.25c0-1.12-.15-2.24-.15-3.36a1.67,1.67,0,0,1,1.58-1.74,1.62,1.62,0,0,1,1.74,1.61,23.39,23.39,0,0,0,.15,3.11A1.52,1.52,0,0,1,43,41.62,1.68,1.68,0,0,1,41.06,40.25Zm53.15,71.67a1.74,1.74,0,0,1-2.37.13C72.54,95.5,48.5,72,42.33,47a1.77,1.77,0,0,1,1.27-2,1.83,1.83,0,0,1,2,1.24c6,24.39,29.58,47.16,48.41,63.46A1.7,1.7,0,0,1,94.21,111.92ZM173,146.77a1.5,1.5,0,0,1-1.89,1.24c-2.22-.37-4.27-1-6.49-1.49a1.58,1.58,0,0,1-1.11-2.12,1.52,1.52,0,0,1,2.06-1.12l6.17,1.49A1.7,1.7,0,0,1,173,146.77ZM200.51,150c-6.49,1.12-14.4.75-22.94-.62a1.63,1.63,0,0,1-1.42-1.87,1.68,1.68,0,0,1,1.9-1.37c8.22,1.37,15.66,1.75,22,.63a1.67,1.67,0,0,1,1.9,1.36A1.62,1.62,0,0,1,200.51,150Zm-11.78-12.6c-1.6,0-3.1-.1-4.7-.2-20.8-1.7-48.3-13-74.7-31.9s-45.8-41.4-54.2-60.5c-4.9-11.3-5.9-21.4-1.2-28.4l.3-.4c4.1-5.8,11.6-8.4,21.2-8.6h57.5l130,130Zm155.8-8.7-.3.4c-4.2,5.6-11.7,8.1-21.1,8.2h-49.7l-77.9-77.9h117.7c15.8,14.6,24.4,26.8,30.3,40.5C348.63,111.5,349.63,121.8,344.53,128.7Z" />
                      </svg>
                      <div className="text-base whitespace-nowrap">BentoBox</div>
                    </a>
                  </NavLink>
                </div>
              </nav>
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
