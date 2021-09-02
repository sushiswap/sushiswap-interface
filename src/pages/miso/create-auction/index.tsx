import { ExclamationCircleIcon as ExclamationCircleIconOutline } from '@heroicons/react/outline'
import { ExclamationCircleIcon as ExclamationCircleIconSolid } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/sdk'
import Head from 'next/head'
import React from 'react'

import Button from '../../../components/Button'
import ExternalLink from '../../../components/ExternalLink'
import Image from '../../../components/Image'
import Typography from '../../../components/Typography'
import { MISO_MARKET_ADDRESS } from '../../../constants/miso'
import Divider from '../../../features/miso/Divider'
import Input from '../../../features/miso/Input'
import Radio from '../../../features/miso/Radio'
import TokenSelect from '../../../features/miso/TokenSelect'
import { tryParseAmount } from '../../../functions/parse'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import Layout from '../../../layouts/Miso'
import childrenWithProps from '../../../layouts/Miso/children'
import { useTokenBalance } from '../../../state/wallet/hooks'

import dutchAuction from '../../../../public/images/miso/create-auction/miso-dutch-auction.svg'
import crowdsale from '../../../../public/images/miso/create-auction/miso-crowdsale.svg'
import batchAuction from '../../../../public/images/miso/create-auction/miso-batch-auction.svg'

function CreateAuction({ pageIndex, movePage }) {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const [auctionType, setAuctionType] = React.useState('Dutch Auction')

  const [token, selectToken] = React.useState<Token>(null)
  const [tokenAmount, setTokenAmount] = React.useState('')
  const balance = useTokenBalance(account ?? undefined, token)

  const typedTokenAmount = tryParseAmount(tokenAmount, token)
  const [approvalState, approve] = useApproveCallback(typedTokenAmount, MISO_MARKET_ADDRESS[chainId])

  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div>
        {pageIndex === 0 && (
          <div>
            <div className="flex flex-row items-start bg-purple bg-opacity-20 mt-2 p-3 rounded">
              <ExclamationCircleIconSolid className="w-12 mt-1 mr-2 text-purple" aria-hidden="true" />
              <Typography>
                {i18n._(t`Choose which type of auction you’d like to hold. Each of the three types has their own unique
                characteristics, so choose the one you think is most appropriate for your project. Need more information
                on what these mean, and which is best for you? Read our documentation`)}
                <ExternalLink href="https://instantmiso.gitbook.io/miso/markets/markets">
                  <Typography component="span" className="text-blue ml-1">
                    {i18n._(t`here`)}
                  </Typography>
                </ExternalLink>
                .
              </Typography>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-5 mb-16">
              <div>
                <div className="pl-10">
                  <Image src={dutchAuction} height={64} alt="Dutch" />
                </div>
                <Radio
                  label="Dutch Auction"
                  selected={auctionType === 'Dutch Auction'}
                  onSelect={(label) => setAuctionType(label)}
                  className="my-5"
                />
                <div>
                  {i18n._(
                    t`The price is set at a higher value per token than expected and descends linearly over time.`
                  )}
                </div>
                <div className="flex flex-row items-start mt-3">
                  <ExclamationCircleIconOutline className="w-6 mr-2 mt-1" aria-hidden="true" />
                  <div>{i18n._(t`Great for a completely novel item’s true price discovery`)}</div>
                </div>
              </div>
              <div>
                <div className="pl-10">
                  <Image src={crowdsale} height={64} alt="Crowdsale" />
                </div>
                <Radio
                  label="Crowdsale"
                  selected={auctionType === 'Crowdsale'}
                  onSelect={(label) => setAuctionType(label)}
                  className="my-5"
                />
                <div>
                  {i18n._(t`A set amount of tokens are divided amongst all the contributors to the Market event, weighted
                  according to their contribution to the pool.`)}
                </div>
                <div className="flex flex-row items-start mt-3">
                  <ExclamationCircleIconOutline className="w-6 mr-2 mt-1" aria-hidden="true" />
                  <div>{i18n._(t`Great for projects looking to ensure that everyone taking part is rewarded`)}</div>
                </div>
              </div>
              <div>
                <div className="pl-10">
                  <Image src={batchAuction} height={64} alt="Batch" />
                </div>
                <Radio
                  label="Batch Auction"
                  selected={auctionType === 'Batch Auction'}
                  onSelect={(label) => setAuctionType(label)}
                  className="my-5"
                />
                <div>{i18n._(t`A fixed price and a fixed set of tokens.`)}</div>
                <div className="flex flex-row items-start mt-3">
                  <ExclamationCircleIconOutline className="w-6 mr-2 mt-1" aria-hidden="true" />
                  <div>{i18n._(t`Great when the token price is already known or has been decided on previously`)}</div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" disabled className="w-[133px]">
                {i18n._(t`Previous`)}
              </Button>
              <Button color="blue" className="w-[133px]" onClick={() => movePage(pageIndex + 1)}>
                {i18n._(t`Next`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 1 && (
          <div>
            <div className="mb-16">
              <TokenSelect onTokenSelect={(token) => selectToken(token)} />
              <Input
                label="Auction Token Amount*"
                value={tokenAmount}
                type="digit"
                placeholder="Enter the amount of token you would like to auction."
                alert="This will be the number of tokens you will put into the auction contract. Please consider this carefully."
                error={!(balance && !balance.lessThan(tokenAmount.toBigNumber(token.decimals).toString()))}
                hint={
                  <span>
                    <b>{i18n._(t`Note`)}</b>: {i18n._(t`Token amount must be lower or equal to allowance.`)}
                  </span>
                }
                trailing={
                  <span>
                    {token
                      ? `${i18n._(t`Your Token Balance`)}: ${balance ? balance.toSignificant(4) : 'N/A'} ${
                          token?.symbol
                        }`
                      : ''}
                  </span>
                }
                onUserInput={(input) => setTokenAmount(input)}
                onAction={approve}
                actionTitle={`Approve ${token?.symbol}`}
                actionVisible={approvalState === ApprovalState.NOT_APPROVED}
                actionPending={approvalState === ApprovalState.PENDING}
              />
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button color="blue" className="w-[133px]" onClick={() => movePage(pageIndex + 1)}>
                {i18n._(t`Next`)}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const CreateAuctionLayout = ({ children }) => {
  const [pageIndex, movePage] = React.useState(0)

  return (
    <Layout
      navs={[
        { link: '/miso', name: 'MISO Launchpad' },
        { link: '/miso/create-auction', name: 'Create Auction' },
      ]}
      title={{
        heading: 'Create Auction',
        content: 'Follow the instructions below, and deploy your auction with your token.',
      }}
      tabs={[
        { heading: 'SELECT AUCTION TYPE', content: 'Decide on the type of auction' },
        { heading: 'SET PARAMETERS', content: 'Set up required auction parameters' },
        { heading: 'REVIEW', content: 'Deploy your auction' },
      ]}
      active={pageIndex}
    >
      {childrenWithProps(children, { pageIndex, movePage })}
    </Layout>
  )
}
CreateAuction.Layout = CreateAuctionLayout

export default CreateAuction
