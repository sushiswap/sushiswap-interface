import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart, User } from 'react-feather'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'

export default function Navigation() {
  return (
    <nav className="-mb-px flex space-x-4">
      <NavLink to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
        <div className="flex items-center text-gray-500 font-medium">
          <div className="whitespace-nowrap text-base mr-2 text-white">Markets</div>
          <BarChart size={16} />
        </div>
      </NavLink>
      <NavLink to="/bento/kashi/positions" className="border-transparent py-2 px-1 border-b-2">
        <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
          <div className="whitespace-nowrap text-base mr-2">Positions</div>
          <User size={16} />
        </div>
      </NavLink>
      <NavLink to="/bento/balances" className="border-transparent py-2 px-1 border-b-2">
        <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
          <div className="whitespace-nowrap text-base mr-2">My Bento</div>
          <img src={BentoBoxLogo} className="w-6" />
        </div>
      </NavLink>
    </nav>
  )
}
