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
  return (
    <>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-12 gap-4`}>
        <div className="hidden lg:flex col-span-3 justify-center lg:justify-start">
          <div className="flex items-center pb-3 px-4">
            <img src={KashiLogo} className="w-10 y-10 sm:w-14 sm:y-14 lg:w-18 lg:y-18 mx-2" />
            <div className="font-semibold text-2xl">Kashi</div>
          </div>
        </div>
        <div className="flex items-end">
          <div className="w-full flex justify-between px-6 md:px-4">
            <div className="hidden lg:block">
              <MarketsNavigation />
            </div>
            <div className="flex lg:hidden items-center pb-2">
              <img src={KashiLogo} className="block w-10 h-7 sm:w-14 sm:h-10 mr-2" />
              <div className="hidden sm:block font-semibold text-2xl">Kashi</div>
            </div>
            <Navigation />
          </div>
        </div>
      </div>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-12 gap-4`}>
        {left && <div className={`col-span-12 lg:col-span-3`}>{left}</div>}
        <TeardropCard className={`col-span-12 ${right ? 'lg:col-span-6' : 'lg:col-span-9'}`}>{children}</TeardropCard>
        {right && <BaseCard className="col-span-12 lg:col-span-3">{right}</BaseCard>}
      </div>
    </>
  )
}
