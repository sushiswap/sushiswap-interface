import { ChevronRightIcon } from '@heroicons/react/solid'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import styled from 'styled-components'

import Container from '../../components/Container'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Image from '../../components/Image'
import Main from '../../components/Main'
import NavLink from '../../components/NavLink'
import Popups from '../../components/Popups'

import headerBackground from '../../../public/images/miso/miso-header-background.svg'

const Navbar = styled.div`
  background: linear-gradient(90.12deg, rgba(9, 147, 236, 0.05) 12.77%, rgba(243, 56, 195, 0.05) 87.29%), #161522;
`

function Navs({ data }) {
  return (
    <Navbar className="flex flex-row w-full px-10 py-1">
      {data.map((item: any, index) => {
        return (
          <div className="flex flex-row items-center justify-center" key={index}>
            <NavLink href={item.link} activeClassName="text-white" exact>
              <span className="mr-2 cursor-pointer">{item.name}</span>
            </NavLink>
            {index !== data.length - 1 && <ChevronRightIcon className="w-5 h-5 mr-2" aria-hidden="true" />}
          </div>
        )
      })}
    </Navbar>
  )
}

function Title({ data, isFactoryPage }) {
  const { i18n } = useLingui()

  return (
    <div className="relative w-full h-[190px]">
      <Image src={headerBackground} layout="fill" objectFit="cover" />
      <div className="absolute left-0 top-0 w-full h-full px-10 pt-5">
        <div className="text-2xl font-bold mb-3 text-white">{data.heading}</div>
        <div className="flex flex-row">
          <div className="flex-[7]">{data.content}</div>
          <div className="h-[46px] flex justify-end flex-[3]">
            {isFactoryPage && (
              <a className="px-12 py-3 text-base font-medium text-center text-white rounded-md font-bold cursor-pointer border rounded border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink">
                {i18n._(t`Documentation`)}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Layout = ({
  navs = [],
  title = {},
  tabs = [],
  active = 0,
  children,
}: {
  navs?: any[]
  title?: any
  tabs?: any[]
  active?: Number
  children?: any
}) => {
  const isFactoryPage = navs.length === 1
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <Main>
        <Container className="px-4 py-4 md:py-8 lg:py-12" maxWidth="5xl">
          <Navs data={navs} />
          <Title data={title} isFactoryPage={isFactoryPage} />
          <div className="p-10">{children}</div>
        </Container>
      </Main>
      <Popups />
      <Footer />
    </div>
  )
}

export default Layout
