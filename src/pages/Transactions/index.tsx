import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ThemeContext } from 'styled-components'
import { getExplorerLink, shortenAddress } from '../../utils'
import TransactionHistory from './TransactionHistory'
import { ChevronLeft, User, Copy, ExternalLink } from 'react-feather'
import { Button, Dots } from 'components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useETHBalances } from 'state/wallet/hooks'
import { Currency } from '@sushiswap/sdk'

const mock = {
    transactions: [
        'Swap 0.1234 ETH for 32.1245 SUSHI',
        'Swap 0.1235 ETH for 32.1245 SUSHI',
        'Swap 0.1236 ETH for 32.1245 SUSHI',
        'Swap 0.1237 ETH for 32.1245 SUSHI'
    ]
}

export default function Transactions() {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

    // const [transactions, setTransactions] = useState<any>()
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const results = await Promise.all([
    //             sushiData.bar.info(),
    //             sushiData.exchange.dayData(),
    //             sushiData.sushi.priceUSD()
    //         ])
    //         const APR =
    //             (((results[1][1].volumeUSD * 0.05) / results[0].totalSupply) * 365) / (results[0].ratio * results[2])

    //         setApr(APR)
    //     }
    //     fetchData()
    // }, [])

    return (
        <>
            <Helmet>
                <title>Transactions | Sushi</title>
            </Helmet>

            {/* <div className="w-full max-w-2xl">
                <Button size="small" className="flex items-center">
                    <ChevronLeft strokeWidth={2} size={18} color={theme.white} />
                    <span className="ml-1">Go Back</span>
                </Button>
                <div className="px-4 mb-5">
                    <div className="text-xl font-medium text-white">Your History & Positions</div>
                </div>
            </div> */}

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-3 p-4">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="p-1.5 bg-dark-800 rounded">
                            <User strokeWidth={1} size={34} color={theme.white} />
                        </div>
                        <div className="ml-3">
                            <div className="font-semibold text-gray-300">{account && shortenAddress(account)}</div>
                            <div className="text-sm text-gray-500">
                                {account && chainId && (
                                    <>
                                        {userEthBalance ? (
                                            <div>
                                                {userEthBalance?.toSignificant(4)}{' '}
                                                {Currency.getNativeCurrencySymbol(chainId)}
                                            </div>
                                        ) : (
                                            <Dots>Loading</Dots>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-primary font-semibold">
                        {/* <div className="flex items-center">
                            <Copy strokeWidth={0.5} size={14} color={theme.white} />
                            <div className="ml-1">Copy Address</div>
                        </div> */}
                        <div className="flex items-center">
                            <ExternalLink strokeWidth={0.5} size={14} color={theme.white} />
                            {/* <div className="ml-1">View on Explorer</div> */}
                            {chainId && account && (
                                <a href={getExplorerLink(chainId, account, 'address')}>
                                    <span style={{ marginLeft: '4px' }}>View on explorer</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-dark-900 w-full max-w-2xl rounded p-4">
                <div className="w-auto flex justify-between items-center rounded bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto mt-3 mb-6">
                    <Link to={'/pool'} className={`w-3/6 p-3 text-center rounded-lg text-secondary`}>
                        Liquidity Positions
                    </Link>
                    <Link
                        to={'/transactions'}
                        className={`w-3/6 p-3 text-center rounded-lg text-primary text-bold bg-dark-900 `}
                    >
                        Transaction History
                    </Link>
                </div>
                <TransactionHistory transactions={mock.transactions} />
            </div>
        </>
    )
}
