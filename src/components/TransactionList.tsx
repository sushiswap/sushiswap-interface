import { ArrowUpRight, CheckCircle } from 'react-feather'

import Button from './Button'
import Dots from '../components/Dots'
import Image from 'next/image'
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
      <div className="flex flex-col items-start justify-between mb-6 sm:flex-row">
        <div className="text-xl font-medium text-white">
          {i18n._(t`Your Transaction History on ${chainId && NETWORK_LABEL[chainId]}`)}
        </div>
        <Button variant="link">
          <span className="text-sm">{i18n._(t`Clear History`)}</span>
        </Button>
      </div>
      <div>
        {transactions ? (
          transactions.map((t: any) => (
            <div key={t.tx_hash} className="flex items-center justify-between px-3 py-1 mb-3 rounded bg-dark-800">
              <div className="flex flex-row items-center space-x-1">
                <div>
                  <Image
                    src={t.token_0.logo_url}
                    className="block w-6 h-6 rounded-full"
                    alt={t.token_0.symbol}
                    width="24px"
                    height="24px"
                  />
                </div>
                <div>
                  <Image
                    src={t.token_1.logo_url}
                    className="block w-6 h-6 mr-2 rounded-full"
                    alt={t.token_1.symbol}
                    width="24px"
                    height="24px"
                  />
                </div>
              </div>
              {chainId && (
                <a
                  href={getExplorerLink(chainId, t.tx_hash, 'transaction')}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center flex-1 px-3 py-2 text-sm rounded-lg text-primary text-bold bg-dark-900"
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
          <div className="px-4 text-center text-gray-500 border border-gray-800 rounded py-14">
            <Dots>Loading</Dots>
          </div>
        )}
      </div>
    </>
  )
}
