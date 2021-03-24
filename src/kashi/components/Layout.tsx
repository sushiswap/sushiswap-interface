import React from 'react'
import { TeardropCard, Navigation } from '.'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import MarketsNavigation from './MarketsNavigation'
import Card from './Card'

interface LayoutProps {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

export default function Layout({ left = undefined, children = undefined, right = undefined }: LayoutProps) {
  return (
    <>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-10 gap-4`}>
        <div className="flex justify-center col-span-10 lg:col-span-2 lg:justify-start">
          <div className="flex items-center pb-3">
            <img src={KashiLogo} className="w-20 y-20 h-12 lg:w-28 lg:h-20 lg:y-28 mr-2" />
            <div className="font-semibold text-2xl">Kashi</div>
          </div>
        </div>
        <div className="flex col-span-8 items-end">
          <div className="w-full flex justify-center lg:justify-between pb-2 px-6">
            <div className="hidden lg:block">
              <MarketsNavigation />
            </div>
            <Navigation />
          </div>
        </div>
      </div>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-10 gap-4`}>
        {left && <div className={`col-span-12 lg:col-span-2`}>{left}</div>}
        <TeardropCard className={`col-span-12 ${right ? 'lg:col-span-5' : 'lg:col-span-8'}`}>{children}</TeardropCard>
        {right && <Card className="col-span-12 lg:col-span-3">{right}</Card>}
      </div>
    </>
  )
}
