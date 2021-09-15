import { ChevronRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import ExternalLink from '../../components/ExternalLink'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'
import NavLink from '../../components/NavLink'
import SimpleTab from '../../components/SimpleTab'
import Stepper from '../../components/Stepper'
import Typography from '../../components/Typography'
import { classNames } from '../../functions'

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
    <div className="w-[250px] h-full p-4 flex flex-col">
      {menuItems.map((item, index) => {
        return (
          <NavLink key={index} href={item.link} activeClassName="text-white bg-gray-800 rounded">
            <div className="pl-5 py-3 my-1 cursor-pointer">{item.title}</div>
          </NavLink>
        )
      })}
    </div>
  )
}

function Navs({ data }) {
  return (
    <div className="w-full bg-dark-900">
      <div className="flex flex-row w-full px-10 py-1 bg-gradient-to-r from-[#0993EC0D] to-[#F338C30D]">
        {data.map((item: any, index) => {
          return (
            <div className="flex flex-row items-center justify-center text-secondary" key={index}>
              <NavLink href={item.link} exact>
                <Typography
                  variant="sm"
                  className={classNames('mr-2', index === data.length - 1 ? 'text-high-emphesis' : null)}
                >
                  {item.name}
                </Typography>
              </NavLink>
              {index !== data.length - 1 && <ChevronRightIcon className="w-5 h-5 mr-2" aria-hidden="true" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Title({ data, isFactoryPage, onTabChange }) {
  const { i18n } = useLingui()
  const steps = data.tabs
  const contents = data.content.split('\n')

  return (
    <div className="w-full bg-miso">
      <div className="w-full px-10 py-10">
        <Typography className="mb-3 text-white" variant="h3" weight={700}>
          {data.heading}
        </Typography>
        <div className="flex flex-row">
          <div className="flex flex-col">
            {contents.map((content) => (
              <Typography className="flex-[7]">{content}</Typography>
            ))}
          </div>
          <div className="flex justify-end flex-[3]">
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
      {steps.length > 0 && data.tabType == 'stepper' && <Stepper steps={steps} active={data.active} />}
      {steps.length > 0 && data.tabType == 'simple' && (
        <SimpleTab className="px-32 2xl:px-48" tabs={steps} active={data.active} onChange={onTabChange} />
      )}
    </div>
  )
}

const Layout = ({
  navs = [],
  title = {},
  tabs = [],
  active = 0,
  children,
  tabType = 'stepper',
  onTabChange,
}: {
  navs?: any[]
  title?: any
  tabs?: any[]
  active?: Number
  children?: any
  tabType?: any
  onTabChange?: any
}) => {
  const isFactoryPage = navs.length === 1
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <div className="w-full flex flex-row">
        <Sidebar />
        <div className="w-full border-gray-800 border-l-[1px] ">
          <Main>
            <Navs data={navs} />
            <Title data={{ ...title, tabs, active, tabType }} isFactoryPage={isFactoryPage} onTabChange={onTabChange} />
            <div className="w-full p-10">{children}</div>
          </Main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Layout
