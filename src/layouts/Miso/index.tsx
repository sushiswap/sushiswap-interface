import { ChevronRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'

import ExternalLink from '../../components/ExternalLink'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'
import NavLink from '../../components/NavLink'
import Stepper from '../../components/Stepper'

const Navbar = styled.div`
  background: linear-gradient(90.12deg, rgba(9, 147, 236, 0.05) 12.77%, rgba(243, 56, 195, 0.05) 87.29%), #161522;
`

function Sidebar() {
  const menuItems = [
    { link: '/swap', title: 'Overview' },
    { link: '/pool', title: 'Manage Pools' },
    { link: '/incentive', title: 'Manage Incentives' },
    { link: '/analytics', title: 'Analytics' },
    { link: '/miso', title: 'MISO Launchpad' },
    { link: '/settings', title: 'Settings' },
  ]
  return (
    <div className="w-[250px] border-[#202231] border-r-2 p-4 flex flex-col">
      {menuItems.map((item, index) => {
        return (
          <NavLink key={index} href={item.link} activeClassName="text-white bg-[#202231] rounded">
            <a className="pl-5 py-2 my-1">{item.title}</a>
          </NavLink>
        )
      })}
    </div>
  )
}

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
  const steps = data.tabs

  return (
    <div className="w-full bg-miso">
      <div className="w-full px-10 py-5">
        <div className="text-2xl font-bold mb-3 text-white">{data.heading}</div>
        <div className="flex flex-row">
          <div className="flex-[7]">{data.content}</div>
          <div className="h-[46px] flex justify-end flex-[3]">
            {isFactoryPage && (
              <ExternalLink href="https://instantmiso.gitbook.io/miso/">
                <a className="px-12 py-3 text-base font-medium text-center text-white rounded-md font-bold cursor-pointer border rounded border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink">
                  {i18n._(t`Documentation`)}
                </a>
              </ExternalLink>
            )}
          </div>
        </div>
      </div>
      {steps.length > 0 && <Stepper steps={steps} active={data.active} />}
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
      <div className="w-full flex flex-row">
        <Sidebar />
        <div className="w-full">
          <Main>
            <Navs data={navs} />
            <Title data={{ ...title, tabs, active }} isFactoryPage={isFactoryPage} />
            <div className="w-full p-10">{children}</div>
          </Main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Layout
