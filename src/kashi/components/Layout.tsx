import React from 'react'
import { TeardropCard, Navigation } from '.'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import MarketsNavigation from './MarketsNavigation'
import Card from './Card'
import { Warning } from './Alert'

interface LayoutProps {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

export default function Layout({ left = undefined, children = undefined, right = undefined }: LayoutProps) {
  return (
    <div
      style={{
        maxWidth: '1280px',
        width: '100%'
      }}
    >
      <div className={`md:px-4 grid grid-cols-10 gap-4`}>
        <div className="flex justify-center col-span-10 lg:col-span-2 lg:justify-start">
          <div className="flex items-center pb-3">
            <img src={KashiLogo} className="block w-20 lg:w-28 mr-2" />
            <div className="font-semibold text-2xl">Kashi</div>
          </div>
        </div>
        <div className="flex col-span-10 lg:col-span-8 items-end">
          <div className="w-full flex justify-center lg:justify-between pb-2 px-6">
            <div className="hidden lg:block">
              <MarketsNavigation />
            </div>
            <Navigation />
          </div>
        </div>
        <div className="flex col-span-10 pb-6 px-2 justify-center">
          <Warning predicate={true}>
            The Kashi staging pools will soon be replaced with production pools, so please bare this in mind before
            interacting with them.
          </Warning>
        </div>
      </div>
      <div className={`md:px-4 grid grid-cols-10 gap-4`}>
        {left && <div className={`hidden lg:block lg:col-span-2`}>{left}</div>}
        <TeardropCard className={`col-span-10 ${right ? 'lg:col-span-5' : 'lg:col-span-8'}`}>{children}</TeardropCard>
        {right && <Card className="col-span-10 lg:col-span-3">{right}</Card>}
      </div>
    </div>
  )
}
