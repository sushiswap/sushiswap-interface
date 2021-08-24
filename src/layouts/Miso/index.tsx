import { ChevronRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import ExternalLink from '../../components/ExternalLink'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'
import NavLink from '../../components/NavLink'
import Stepper from '../../components/Stepper'
import Typography from '../../components/Typography'

function Sidebar() {
  const { i18n } = useLingui()

  const menuItems = [
    { link: '/swap', title: i18n._(t`Overview`) },
    { link: '/pool', title: i18n._(t`Manage Pools`) },
    { link: '/incentive', title: i18n._(t`Manage Incentives`) },
    { link: '/analytics', title: i18n._(t`Analytics`) },
    { link: '/miso', title: i18n._(t`MISO Launchpad`) },
    { link: '/settings', title: i18n._(t`Settings`) },
  ]
  return (
    <div className="w-[250px] border-gray-800 border-r-[1px] p-4 flex flex-col">
      {menuItems.map((item, index) => {
        return (
          <NavLink key={index} href={item.link} activeClassName="text-white bg-gray-800 rounded">
            <Typography className="pl-5 py-2 my-1">{item.title}</Typography>
          </NavLink>
        )
      })}
    </div>
  )
}

function Navs({ data }) {
  return (
    <div className="flex flex-row w-full px-10 py-1 bg-gradient-to-r from-[#0993EC0D] to-[#F338C30D]">
      {data.map((item: any, index) => {
        return (
          <div className="flex flex-row items-center justify-center" key={index}>
            <NavLink href={item.link} activeClassName="text-white" exact>
              <Typography className="mr-2">{item.name}</Typography>
            </NavLink>
            {index !== data.length - 1 && <ChevronRightIcon className="w-5 h-5 mr-2" aria-hidden="true" />}
          </div>
        )
      })}
    </div>
  )
}

function Title({ data, isFactoryPage }) {
  const { i18n } = useLingui()
  const steps = data.tabs

  return (
    <div className="w-full bg-miso">
      <div className="w-full px-10 py-5">
        <Typography className="mb-3 text-white" variant="h3" weight={700}>
          {data.heading}
        </Typography>
        <div className="flex flex-row">
          <Typography className="flex-[7]">{data.content}</Typography>
          <div className="h-[46px] flex justify-end flex-[3]">
            {isFactoryPage && (
              <ExternalLink href="https://instantmiso.gitbook.io/miso/">
                <Typography className="px-12 py-3 text-center text-white rounded-md border border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink">
                  {i18n._(t`Documentation`)}
                </Typography>
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
