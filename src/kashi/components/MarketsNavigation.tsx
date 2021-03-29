import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'

export default function MarketsNavigation() {
  const location = useLocation()
  return (
    <nav className="-mb-px flex space-x-4 justify-center pb-2 md:pb-0 md:justify-start items-baseline">
      {/* <NavLink to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
        <div
          className={
            'flex items-center font-medium ' + (location.pathname === '/bento/kashi' ? 'text-white' : 'text-gray-500')
          }
        >
          <div className={'whitespace-nowrap text-base mr-2'}>All</div>
        </div>
      </NavLink> */}
      <NavLink to="/bento/kashi/supply" className="border-transparent px-1 border-b-2">
        <div
          className={
            'flex items-center font-medium ' +
            (location.pathname === '/bento/kashi/supply' ? 'text-white' : 'text-gray-500')
          }
        >
          <div className="whitespace-nowrap text-base mr-2">Lend</div>
        </div>
      </NavLink>
      <NavLink to="/bento/kashi/borrow" className="border-transparent px-1 border-b-2">
        <div
          className={
            'flex items-center font-medium ' +
            (location.pathname === '/bento/kashi/borrow' ? 'text-white' : 'text-gray-500')
          }
        >
          <div className="whitespace-nowrap text-base mr-2">Borrow</div>
        </div>
      </NavLink>
      <NavLink to="/bento/balances" className="border-transparent px-1 border-b-2">
        <div
          className={
            'flex items-center font-medium ' +
            (location.pathname === '/bento/balances' ? 'text-white' : 'text-gray-500')
          }
        >
          <img src={BentoBoxLogo} className="block w-6" />
          <div className="whitespace-nowrap text-base ml-2">My Bento</div>
        </div>
      </NavLink>
    </nav>
  )
}
