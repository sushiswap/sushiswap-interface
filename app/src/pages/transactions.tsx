import { ExternalLink, User } from 'react-feather'
import useSWR, { SWRResponse } from 'swr'

import { Currency } from '@sushiswap/sdk'
import Dots from '../components/Dots'
import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'
import React from 'react'
import TransactionList from '../components/TransactionList'
import { getExplorerLink } from '../functions/explorer'
import { shortenAddress } from '../functions/format'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useETHBalances } from '../state/wallet/hooks'
import { useLingui } from '@lingui/react'

function Transactions() {
    const { i18n } = useLingui()

    const { account, chainId } = useActiveWeb3React()
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

    const { data, error }: SWRResponse<any, Error> = useSWR(
        `https://api.covalenthq.com/v1/${chainId}/address/${account}/stacks/sushiswap/acts/?&key=ckey_cba3674f2ce5450f9d5dd290589&swaps=true&quote-currency=usd`,
        url =>
            fetch(url)
                .then(r => r.json())
                .then(j => j.data)
    )

    if (error) return <div>{i18n._(t`failed to load`)}</div>
    if (!data) return <div>{i18n._(t`loading...`)}</div>

    console.log(data)

    return (
        <Layout>
            <Head>
                <title>{i18n._(t`Transactions`)} | Sushi</title>
                <meta name="description" content="Transactions..." />
            </Head>

            {/* <div className="w-full max-w-2xl">
                <Button size="small" className="flex items-center text-white">
                    <ChevronLeft strokeWidth={2} size={18} color="currentColor" />
                    <span className="ml-1">Go Back</span>
                </Button>
                <div className="px-4 mb-5">
                    <div className="text-xl font-medium text-white">Your History & Positions</div>
                </div>
            </div> */}

            <div className="w-full max-w-2xl p-4 mb-3 rounded bg-dark-900">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="p-1.5 bg-dark-800 rounded">
                            <User strokeWidth={1} size={34} className="text-white" />
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
                                            <Dots>{i18n._(t`Loading`)}</Dots>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm font-semibold text-primary">
                        {/* <div className="flex items-center">
                            <Copy strokeWidth={0.5} size={14} className="text-white"/>
                            <div className="ml-1">Copy Address</div>
                        </div> */}
                        <div className="flex items-center">
                            <ExternalLink strokeWidth={0.5} size={14} className="text-white" />
                            {/* <div className="ml-1">View on Explorer</div> */}
                            {chainId && account && (
                                <a href={getExplorerLink(chainId, account, 'address')}>
                                    <span style={{ marginLeft: '4px' }}>{i18n._(t`View on explorer`)}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl p-4 rounded bg-dark-900">
                <div className="w-auto flex justify-between items-center rounded bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto mt-3 mb-6">
                    <Link href="/pool">
                        <a className="w-3/6 p-3 text-center rounded-lg text-secondary">
                            {i18n._(t`Liquidity Positions`)}
                        </a>
                    </Link>
                    <Link href="/transactions">
                        <a className="w-3/6 p-3 text-center rounded-lg text-primary text-bold bg-dark-900">
                            {i18n._(t`Transaction History`)}
                        </a>
                    </Link>
                </div>
                <TransactionList transactions={data.items} />
            </div>
        </Layout>
    )
}

Transactions.Layout = Layout

export default Transactions
