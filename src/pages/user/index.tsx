import Back from '../../components/Back'
import Container from '../../components/Container'
import Head from 'next/head'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ExternalLink, User } from 'react-feather'
import useSWR, { SWRResponse } from 'swr'
import Dots from '../../components/Dots'
import Button from '../../components/Button'
import React from 'react'
import TransactionList from '../../components/TransactionList'
import { getExplorerLink } from '../../functions/explorer'
import { shortenAddress } from '../../functions/format'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useETHBalances } from '../../state/wallet/hooks'
import { NETWORK_LABEL } from '../../constants/networks'

export default function Me() {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

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
    <>
      <Head>
        <title>My SUSHI | Sushi</title>
        <meta name="description" content="My SUSHI" />
      </Head>

      <Container maxWidth="2xl" className="p-4 space-y-3">
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
            {/* <Button variant="link">
              <span className="text-sm">{i18n._(t`Clear History`)}</span>
            </Button> */}
          </div>

          <TransactionList transactions={data.items} />
        </div>
      </Container>
    </>
  )
}
