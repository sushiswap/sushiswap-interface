import Badge from '../../components/Badge'
import { ChainId } from '@sushiswap/sdk'
import NavLink from '../../components/NavLink'
import React from 'react'
import { useActiveWeb3React } from '../../hooks'

const Menu = ({ positionsLength }) => {
  const { account, chainId } = useActiveWeb3React()
  return (
    <div className="space-y-4">
      {account && positionsLength > 0 && (
        <NavLink
          exact
          href={`/farm?filter=portfolio`}
          activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
        >
          <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
            Your Farms
          </a>
        </NavLink>
      )}

      <NavLink
        exact
        href="/farm"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          All Farms
        </a>
      </NavLink>

      {[ChainId.MAINNET, ChainId.ARBITRUM].includes(chainId) && (
        <>
          <NavLink
            exact
            href={`/farm?filter=kashi`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              Kashi Farms
            </a>
          </NavLink>
          <NavLink
            exact
            href={`/farm?filter=sushi`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              SushiSwap Farms
            </a>
          </NavLink>
        </>
      )}

      {(chainId === ChainId.MAINNET || chainId === ChainId.MATIC) && (
        <NavLink
          exact
          href={`/farm?filter=2x`}
          activeClassName="bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
        >
          <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
            2x Reward Farms
          </a>
        </NavLink>
      )}
    </div>
  )
}

export default Menu
