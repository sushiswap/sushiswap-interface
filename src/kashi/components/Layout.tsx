import React from 'react'
import KashiLogo from 'assets/kashi/logo.png'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ReactComponent as BentoBoxLogo } from 'assets/kashi/bento-symbol.svg'
import { formattedNum } from 'utils'

interface LayoutProps {
    left?: JSX.Element
    children?: React.ReactChild | React.ReactChild[]
    right?: JSX.Element
    netWorth?: string
}

export default function Layout({ left = undefined, children = undefined, right = undefined, netWorth = "" }: LayoutProps) {
    const location = useLocation()
    return (
        <div className="container mx-auto px-0 sm:px-4">
            <div className={`mb-2 grid grid-cols-12 gap-4`}>
                <div className="flex justify-center col-span-12 xl:col-span-3 lg:justify-start">
                    <Link to="/bento/kashi/borrow" className="flex justify-center xl:justify-start xl:mx-8">
                        <img src={KashiLogo} alt="" className="w-1/2 md:w-1/3 xl:w-full" />
                    </Link>
                </div>
                <div className="flex col-span-12 xl:col-span-9 items-end">
                    <nav className="flex justify-between items-center w-full">
                        <div className="flex">
                            <NavLink to="/bento/kashi/lend" className="border-transparent pl-4 pr-2 sm:pl-8 sm:pr-4 border-b-2">
                                <div
                                    className={
                                        'flex items-center font-medium ' +
                                        (location.pathname.startsWith('/bento/kashi/lend')
                                            ? 'text-high-emphesis'
                                            : 'text-secondary hover:text-primary')
                                    }
                                >
                                    <div className="whitespace-nowrap text-base">Lend</div>
                                </div>
                            </NavLink>
                            <NavLink to="/bento/kashi/borrow" className="border-transparent px-2 sm:px-4 border-b-2">
                                <div
                                    className={
                                        'flex items-center font-medium ' +
                                        (location.pathname.startsWith('/bento/kashi/borrow')
                                            ? 'text-high-emphesis'
                                            : 'text-secondary hover:text-primary')
                                    }
                                >
                                    <div className="whitespace-nowrap text-base">Borrow</div>
                                </div>
                            </NavLink>
                        </div>
                        <div className="flex pr-2 sm:pr-4">
                            <NavLink
                                to="/bento/balances"
                                className={`border-transparent px-2 sm:px-4 border-b-2 flex justify-end items-center font-medium ${
                                    location.pathname === '/bento/balances'
                                        ? 'text-high-emphesis'
                                        : 'text-secondary hover:text-primary'
                                }`}
                            >
                                <BentoBoxLogo className="fill-current h-auto w-6 mr-2" />
                                <div className="whitespace-nowrap text-base">My BentoBox</div>
                            </NavLink>
                            {netWorth && (
                                <div
                                    className={`hidden md:block border-transparent px-6 border-b-2 justify-end items-center font-medium text-high-emphesis`}
                                >
                                    <div className="whitespace-nowrap text-base">{formattedNum(netWorth, true)}</div>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
            <div className={`grid grid-cols-12 gap-4 min-h-1/2`}>
                {left && (
                    <div className={`hidden xl:block xl:col-span-3`} style={{ maxHeight: '40rem' }}>
                        {left}
                    </div>
                )}
                <div
                    className={`col-span-12 ${right ? 'lg:col-span-8 xl:col-span-6' : 'xl:col-span-9'}`}
                    style={{ minHeight: '40rem' }}
                >
                    {children}
                </div>
                {right && (
                    <div className="col-span-12 lg:col-span-4 xl:col-span-3" style={{ maxHeight: '40rem' }}>
                        {right}
                    </div>
                )}
            </div>
        </div>
    )
}
