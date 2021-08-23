import { CheckIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'

import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'
import NavLink from '../../components/NavLink'
import Popups from '../../components/Popups'
import { classNames } from '../../functions/styling'
import ExternalLink from '../../components/ExternalLink'

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
      {steps.length > 0 && (
        <div className="lg:border-t lg:border-b lg:border-gray-500">
          <nav className="mx-auto" aria-label="Progress">
            <ol role="list" className="rounded-md overflow-hidden lg:flex lg:border-gray-500 lg:rounded-none">
              {steps.map((step, stepIdx) => (
                <li key={stepIdx} className="relative overflow-hidden lg:flex-1">
                  <div
                    className={classNames(
                      stepIdx === 0 ? 'border-b-0 rounded-t-md' : '',
                      stepIdx === steps.length - 1 ? 'border-t-0 rounded-b-md' : '',
                      'border border-gray-200 overflow-hidden lg:border-0'
                    )}
                  >
                    {stepIdx < data.active ? (
                      <a href={step.href} className="group">
                        <span
                          className="absolute top-0 left-0 w-1 h-full bg-transparent lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                          aria-hidden="true"
                        />
                        <span className={classNames('pl-9 py-5 flex items-start text-sm font-medium')}>
                          <span className="flex-shrink-0">
                            <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue to-pink rounded-full">
                              <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                            </span>
                          </span>
                          <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                            <span className="text-xs font-semibold tracking-wide uppercase text-white">
                              {step.heading}
                            </span>
                            <span className="text-sm font-medium">{step.content}</span>
                          </span>
                        </span>
                      </a>
                    ) : stepIdx === data.active ? (
                      <div>
                        <span
                          className="absolute top-0 left-0 w-1 h-full bg-blue lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                          aria-hidden="true"
                        />
                        <span className={classNames('pl-9 py-5 flex items-start text-sm font-medium')}>
                          <span className="flex-shrink-0">
                            <span className="w-10 h-10 flex items-center justify-center border-2 border-blue rounded-full">
                              <span className="text-blue">{stepIdx + 1}</span>
                            </span>
                          </span>
                          <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                            <span className="text-xs font-semibold text-white tracking-wide uppercase">
                              {step.heading}
                            </span>
                            <span className="text-sm font-medium">{step.content}</span>
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span
                          className="absolute top-0 left-0 w-1 h-full bg-transparent lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                          aria-hidden="true"
                        />
                        <span className={classNames('pl-9 py-5 flex items-start text-sm font-medium')}>
                          <span className="flex-shrink-0">
                            <span className="w-10 h-10 flex items-center justify-center border-2 border-gray-500 rounded-full">
                              <span className="text-gray-500">{stepIdx + 1}</span>
                            </span>
                          </span>
                          <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                            <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                              {step.heading}
                            </span>
                            <span className="text-sm font-medium text-gray-500">{step.content}</span>
                          </span>
                        </span>
                      </div>
                    )}

                    {stepIdx !== 0 ? (
                      <>
                        {/* Separator */}
                        <div className="hidden absolute top-0 left-0 w-3 inset-0 lg:block" aria-hidden="true">
                          <svg
                            className="h-full w-full text-gray-500"
                            viewBox="0 0 12 82"
                            fill="none"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0.5 0V31L10.5 41L0.5 51V82"
                              stroke="currentcolor"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        </div>
                      </>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
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
      <Popups />
    </div>
  )
}

export default Layout
