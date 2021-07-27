import { ExternalLink, User } from 'react-feather'
import React, { useCallback, useMemo } from 'react'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import useSWR, { SWRResponse } from 'swr'

import Back from '../../components/Back'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import Head from 'next/head'
import { NETWORK_LABEL } from '../../constants/networks'
import { TransactionDetails } from '../../state/transactions/reducer'
import TransactionList from '../../components/TransactionList'
import Typography from '../../components/Typography'
import { clearAllTransactions } from '../../state/transactions/actions'
import { getExplorerLink } from '../../functions/explorer'
import { shortenAddress } from '../../functions/format'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAppDispatch } from '../../state/hooks'
import useENSName from '../../hooks/useENSName'
import { useETHBalances } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function Me() {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const dispatch = useAppDispatch()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  const { data, error }: SWRResponse<any, Error> = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${account}/stacks/sushiswap/acts/?&key=ckey_cba3674f2ce5450f9d5dd290589&swaps=true&quote-currency=usd`,
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((j) => j.data)
  )

  if (error) return <div>{i18n._(t`failed to load`)}</div>
  if (!data) return <div>{i18n._(t`loading...`)}</div>

  return (
    <Container id="user-page" className="py-4 space-y-3 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>My SUSHI | Sushi</title>
        <meta key="description" name="description" content="My SUSHI" />
      </Head>
      <div className="p-4 mb-3 space-y-3">
        <Back />

        <Typography component="h1" variant="h2" className=" text-high-emphesis">
          {i18n._(t`My SUSHI`)}
        </Typography>
      </div>

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
                      <div>{userEthBalance?.toSignificant(4)} ETH</div>
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

      {/* <Typography component="h2" variant="h3" className="p-4 text-primary">
          {i18n._(t`Balance`)}
        </Typography> */}

      <div className="w-full max-w-2xl p-4 rounded bg-dark-900">
        <div className="flex flex-col items-center justify-between mb-3 sm:flex-row">
          <Typography component="h2" variant="lg" className="font-medium text-high-emphesis">
            {i18n._(t`Transaction History ${chainId && NETWORK_LABEL[chainId]}`)}
          </Typography>
          <Button variant="link" onClick={clearAllTransactionsCallback}>
            <span className="text-sm">{i18n._(t`Clear History`)}</span>
          </Button>
        </div>

        {/* TODO: KEEP THIS STYLE BUT FEED WITH AGNOSTIC TX DATA */}
        <TransactionList transactions={data.items} />

        {/* <TransactionList transactions={data.items} /> */}
      </div>
    </Container>
  )
}
