import { ArrowUpRight, CheckCircle } from 'react-feather'
import Dots from '../../components/Dots'
import Image from '../../components/Image'
import React from 'react'
import { getExplorerLink } from '../../functions/explorer'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

export default function TransactionList({ transactions }) {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  return transactions ? (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.tx_hash} className="flex items-center justify-between px-3 py-1 rounded bg-dark-800">
          <div className="flex flex-row items-center pr-3 space-x-1">
            <Image src={transaction.token_0.logo_url} alt={transaction.token_0.symbol} width="24px" height="24px" />
            <Image src={transaction.token_1.logo_url} alt={transaction.token_1.symbol} width="24px" height="24px" />
          </div>
          {chainId && (
            <a
              href={getExplorerLink(chainId, transaction.tx_hash, 'transaction')}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center flex-1 px-3 py-2 text-sm rounded-lg text-primary text-bold bg-dark-900"
            >
              <span className="mr-1">{transaction.description}</span>
              <ArrowUpRight strokeWidth={2} size={14} className="text-blue" />
            </a>
          )}
          <div className="ml-4 mr-1">
            <CheckCircle strokeWidth={2} size={18} className="text-green" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="px-4 text-center text-gray-500 border border-gray-800 rounded py-14">
      <Dots>{i18n._(t`Loading`)}</Dots>
    </div>
  )
}
