import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart, User } from 'react-feather'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'

export default function Navigation() {
  return (
    <nav className="-mb-px flex space-x-4">
      <NavLink to="/bento/kashi/portfolio" className="border-transparent py-2 px-1 border-b-2">
        <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
          <User size={16} />
          <div className="whitespace-nowrap text-base ml-2">Portfolio</div>
        </div>
      </NavLink>
      <NavLink to="/bento/balances" className="border-transparent py-2 px-1 border-b-2">
        <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
          <img src={BentoBoxLogo} className="w-6" />
          <div className="whitespace-nowrap text-base ml-2">My Bento</div>
        </div>
      </NavLink>
    </nav>
  )
}
