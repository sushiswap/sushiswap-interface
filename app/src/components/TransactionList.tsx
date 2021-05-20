import { ArrowUpRight, CheckCircle } from 'react-feather'

import Dots from '../components/Dots'
import { NETWORK_LABEL } from '../constants/networks'
import React from 'react'
import { getExplorerLink } from '../functions/explorer'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

// type Props = {
//     transactions: string[]
// }

export default function TransactionList({ transactions }: any) {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    return (
        <>
            <div className="flex justify-between mb-6 flex-col sm:flex-row items-start">
                <div className="text-xl font-medium text-white">
                    {i18n._(t`Your Transaction History on ${chainId && NETWORK_LABEL[chainId]}`)}
                </div>
                {/* <LinkStyledButton>
                    <span className="text-sm">{i18n._(t`Clear History`)}</span>
                </LinkStyledButton> */}
            </div>
            <div>
                {transactions ? (
                    transactions.map((t: any) => (
                        <div
                            key={t.tx_hash}
                            className="flex justify-between items-center rounded bg-dark-800 px-3 py-1 mb-3"
                        >
                            <div className="flex flex-row space-x-1 items-center">
                                <div>
                                    <img src={t.token_0.logo_url} className="block w-6 h-6 rounded-full" alt="" />
                                </div>
                                <div>
                                    <img src={t.token_1.logo_url} className="block w-6 h-6 rounded-full mr-2" alt="" />
                                </div>
                            </div>
                            {chainId && (
                                <a
                                    href={getExplorerLink(chainId, t.tx_hash, 'transaction')}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="flex flex-1 items-center text-sm px-3 py-2 text-primary rounded-lg text-bold bg-dark-900"
                                >
                                    <span className="mr-1">{t.description}</span>
                                    <ArrowUpRight strokeWidth={2} size={14} className="text-blue" />
                                </a>
                            )}
                            <div className="ml-4 mr-1">
                                <CheckCircle strokeWidth={2} size={18} className="text-green" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center px-4 py-14 border border-gray-800 rounded">
                        <Dots>Loading</Dots>
                    </div>
                )}
            </div>
        </>
    )
}
