import NavLink from '../NavLink'
import React from 'react'
import { currencyId } from '../../functions/currency'

export default function LiquidityHeader({ input = undefined, output = undefined }: any): JSX.Element {
    return (
        <div className="grid grid-cols-2 rounded-md p-3px bg-dark-800">
            <NavLink
                activeClassName="font-bold text-high-emphesis bg-dark-900"
                href={`/add/${currencyId(input)}/${currencyId(output)}`}
            >
                <a className="flex items-center justify-center px-4 py-3 md:px-10 rounded-md text-center text-secondary hover:text-high-emphesis text-base font-medium">
                    Add
                </a>
            </NavLink>
            <NavLink
                onClick={event => {
                    if (!output) event.preventDefault()
                }}
                activeClassName="text-high-emphesis font-bold bg-dark-900"
                href={`/remove/${currencyId(input)}/${currencyId(output)}`}
            >
                <a className="flex items-center justify-center px-4 py-3 md:px-10 rounded-md text-center text-secondary hover:text-high-emphesis text-base font-medium">
                    Remove
                </a>
            </NavLink>
        </div>
    )
}
