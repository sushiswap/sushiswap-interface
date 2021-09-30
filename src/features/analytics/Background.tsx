import Image from 'next/image'
import React from 'react'
import { classNames } from '../../functions'

interface BackgroundProps {
  background: 'dashboard' | 'bar' | 'farms' | 'pool' | 'pools' | 'token' | 'tokens'
  children: any
}

const backgrounds = {
  dashboard: '/analytics-background-dashboard.jpg',
  bar: '/analytics-background-bar.jpg',
  farms: '/analytics-background-farms.jpg',
  pool: `/formal-invitation.svg`,
  pools: '/analytics-background-pools.jpg',
  token: `/happy-intersection.svg`,
  tokens: '/analytics-background-tokens.jpg',
}

export default function Background({ background, children }: BackgroundProps) {
  return (
    <div className="h-[200px] md:h-[151px] w-full relative bg-dark-900">
      <div
        className={classNames(
          'absolute w-full h-full',
          !backgrounds[background].includes('svg') && 'bg-cover bg-center opacity-[0.15]'
        )}
        style={{
          backgroundImage: `url('${backgrounds[background]}')`,
          WebkitMaskImage: `url('${backgrounds[background]}')`,
        }}
      />
      <div className="absolute w-full py-8 px-14 z-1">{children}</div>
    </div>
  )
}
