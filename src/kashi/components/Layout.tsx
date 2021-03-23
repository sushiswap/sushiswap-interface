import React from 'react'
import { TeardropCard, Navigation } from '.'
import styled from 'styled-components'
import { TYPE } from 'theme'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import MarketsNavigation from './MarketsNavigation'
import { BaseCard } from 'components/Card'
import { NavLink, useLocation } from 'react-router-dom'
import { BarChart, User } from 'react-feather'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'

interface LayoutProps {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

export default function Layout({ left = undefined, children = undefined, right = undefined }: LayoutProps) {
  const location = useLocation()
  return (
    <>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-12 gap-4`}>
        <div className="flex col-span-3 justify-center lg:justify-start">
          <div className="flex items-center pb-3">
            <img src={KashiLogo} className="w-10 y-10 sm:w-20 sm:y-20 lg:w-28 lg:y-28" />
            <TYPE.extraLargeHeader color="extraHighEmphesisText" lineHeight={1}>
              Kashi
            </TYPE.extraLargeHeader>
          </div>
        </div>
        <div className="flex col-span-9 items-end">
          <div className="w-full flex justify-center lg:justify-between pb-2 px-6">
            <div className="hidden lg:block">
              <nav className="-mb-px flex space-x-4 justify-center pb-2 md:pb-0 md:justify-start ">
                <NavLink to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
                  <div
                    className={
                      'flex items-center font-medium ' +
                      (location.pathname === '/bento/kashi' ? 'text-white' : 'text-gray-500')
                    }
                  >
                    <div className={'whitespace-nowrap text-base mr-2'}>All</div>
                  </div>
                </NavLink>
                <NavLink to="/bento/kashi/supply" className="border-transparent py-2 px-1 border-b-2">
                  <div
                    className={
                      'flex items-center font-medium ' +
                      (location.pathname === '/bento/kashi/supply' ? 'text-white' : 'text-gray-500')
                    }
                  >
                    <div className="whitespace-nowrap text-base mr-2">Supply</div>
                  </div>
                </NavLink>
                <NavLink to="/bento/kashi/borrow" className="border-transparent py-2 px-1 border-b-2">
                  <div
                    className={
                      'flex items-center font-medium ' +
                      (location.pathname === '/bento/kashi/borrow' ? 'text-white' : 'text-gray-500')
                    }
                  >
                    <div className="whitespace-nowrap text-base mr-2">Borrow</div>
                  </div>
                </NavLink>
              </nav>
            </div>
            <nav className="-mb-px flex space-x-4 justify-center pb-2 md:pb-0 md:justify-start float-right">
              <NavLink to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
                <div
                  className={
                    'flex items-center font-medium ' +
                    (location.pathname === '/bento/kashi' ||
                    location.pathname === '/bento/kashi/supply' ||
                    location.pathname === '/bento/kashi/borrow'
                      ? 'text-white'
                      : 'text-gray-500')
                  }
                >
                  <div className={'whitespace-nowrap text-base mr-2'}>Markets</div>
                  <BarChart size={16} />
                </div>
              </NavLink>
              <NavLink to="/bento/kashi/positions" className="border-transparent py-2 px-1 border-b-2">
                <div
                  className={
                    'flex items-center font-medium ' +
                    (location.pathname === '/bento/kashi/positions' ? 'text-white' : 'text-gray-500')
                  }
                >
                  <div className="whitespace-nowrap text-base mr-2">Positions</div>
                  <User size={16} />
                </div>
              </NavLink>
              <NavLink to="/bento/balances" className="border-transparent py-2 px-1 border-b-2">
                <div
                  className={
                    'flex items-center font-medium ' +
                    (location.pathname === '/bento/balances' ? 'text-white' : 'text-gray-500')
                  }
                >
                  <div className="whitespace-nowrap text-base mr-2">My Bento</div>
                  <img src={BentoBoxLogo} className="w-6" />
                </div>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-12 gap-4`}>
        {left && <div className={`hidden lg:block lg:col-span-3`}>{left}</div>}
        <TeardropCard className={`${right ? 'lg:col-span-6' : 'lg:col-span-9'}`}>{children}</TeardropCard>
        {right && <BaseCard className="hidden lg:block lg:col-span-3">{right}</BaseCard>}
      </div>
    </>
  )
}
