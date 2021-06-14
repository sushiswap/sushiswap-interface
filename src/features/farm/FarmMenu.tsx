import Badge from "../../components/Badge";
import { ChainId } from "@sushiswap/sdk";
import NavLink from "../../components/NavLink";
import React from "react";
import { useActiveWeb3React } from "../../hooks";

const Menu = () => {
  const { chainId } = useActiveWeb3React();
  return (
    <div className="space-y-4">
      <NavLink
        href="/farm/portfolio"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center justify-between px-4 py-6 font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800 text-caption">
          Your Farms
        </a>
      </NavLink>

      <NavLink
        href="/farm"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center justify-between px-4 py-6 font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800 text-caption">
          All Farms
        </a>
      </NavLink>

      {chainId === ChainId.MAINNET && (
        <>
          <NavLink
            href="/farm/km"
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800 text-caption">
              Kashi Farms
            </a>
          </NavLink>
          <NavLink
            href="/farm/slp"
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800 text-caption">
              SushiSwap Farms
            </a>
          </NavLink>
          <NavLink
            href="/farm/dual"
            activeClassName="bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800 text-caption">
              Dual Reward Farms
              <Badge color="gradient" className="text-xs font-normal">
                New
              </Badge>
            </a>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Menu;
