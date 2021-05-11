import React from 'react'
import { NavLink } from '../Link'

export default function LiquidityHeader({ input = undefined, output = undefined }: any): JSX.Element {
    return (
        <div className="grid grid-cols-2 rounded-md p-3px bg-dark-800">
            <NavLink
                className="flex items-center justify-center px-4 py-3 md:px-10 rounded-md text-center text-secondary hover:text-high-emphesis text-base font-medium"
                activeClassName="font-bold text-high-emphesis bg-dark-900"
                to={`/add/${input && input.address ? input.address : 'ETH'}${
                    output && output.address ? `/${output.address}` : ''
                }`}
            >
                Add
            </NavLink>
            <NavLink
                onClick={event => {
                    if (!output) event.preventDefault()
                }}
                className="flex items-center justify-center px-4 py-3 md:px-10 rounded-md text-center text-secondary hover:text-high-emphesis text-base font-medium"
                activeClassName="text-high-emphesis font-bold bg-dark-900"
                to={`/remove/${input && input.address ? input.address : 'ETH'}${
                    output && output.address ? `/${output.address}` : `${input.address ? '/ETH' : ''}`
                }`}
            >
                Remove
            </NavLink>
        </div>
    )
}
