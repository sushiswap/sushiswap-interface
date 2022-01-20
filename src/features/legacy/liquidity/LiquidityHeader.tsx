import NavLink from 'app/components/NavLink'
import { currencyId } from 'app/functions/currency'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'

export default function LiquidityHeader({ input = undefined, output = undefined }: any): JSX.Element {
  const { chainId } = useActiveWeb3React()
  return (
    <div className="grid grid-cols-2 rounded-md p-3px bg-dark-800">
      <NavLink
        activeClassName="font-bold text-high-emphesis bg-dark-900"
        href={`/add/${currencyId(input)}/${currencyId(output)}`}
      >
        <a className="flex items-center justify-center px-4 py-3 text-base font-medium text-center rounded-md md:px-10 text-secondary hover:text-high-emphesis">
          Add
        </a>
      </NavLink>
      <NavLink
        // @ts-ignore TYPE NEEDS FIXING
        onClick={(event) => {
          if (!output) event.preventDefault()
        }}
        activeClassName="text-high-emphesis font-bold bg-dark-900"
        href={`/remove/${currencyId(input)}/${currencyId(output)}`}
      >
        <a className="flex items-center justify-center px-4 py-3 text-base font-medium text-center rounded-md md:px-10 text-secondary hover:text-high-emphesis">
          Remove
        </a>
      </NavLink>
    </div>
  )
}
