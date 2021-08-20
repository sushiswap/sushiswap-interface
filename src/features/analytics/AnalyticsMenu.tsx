import NavLink from '../../components/NavLink'
import React from 'react'

const items = [
  {
    text: 'Dashboard',
    href: '/analytics/dashboard',
  },
  {
    text: 'Bar',
    href: '/analytics/bar',
  },
  {
    text: 'Pools',
    href: '/analytics/pools',
  },
  {
    text: 'Pairs',
    href: '/analytics/pairs',
  },
  {
    text: 'Tokens',
    href: '/analytics/tokens',
  },
]

const Menu = () => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <NavLink href={item.href} activeClassName="font-bold text-high-emphesis bg-dark-800">
          <a className="flex items-center px-1 py-3 border-transparent rounded hover:bg-dark-900">
            <div className="ml-5">{item.text}</div>
          </a>
        </NavLink>
      ))}
    </div>
  )
}

export default Menu
