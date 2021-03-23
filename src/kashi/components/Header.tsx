import React from 'react'
import { useKashiCounts } from 'kashi/context'
import Stats from './Stats'

export default function Header() {
  const counts = useKashiCounts()
  return (
    <div>
      <div className="flex-col space-y-8">
        <div className="w-full md:w-2/3 m-auto">
          <Stats />
        </div>
        <div className="text-2xl md:text-3xl font-semibold text-center">{counts.markets} Kashi Markets</div>
      </div>
    </div>
  )
}
