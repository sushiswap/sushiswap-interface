import { ArrowSmRightIcon, ExclamationCircleIcon as ExclamationCircleIconOutline } from '@heroicons/react/outline'
import { ExclamationCircleIcon as ExclamationCircleIconSolid } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/sdk'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

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
import PaymentCurrency from '../../../features/miso/PaymentCurrency'
import DutchAuctionSettings from '../../../features/miso/DutchAuctionSettings'
import AuctionPeriod from '../../../features/miso/AuctionPeriod'
import ConfirmAuction from '../../../features/miso/ConfirmAuction'
import NavLink from '../../../components/NavLink'
import { classNames } from '../../../functions'
import { getPaymentCurrency } from '../../../features/miso/helper/PaymentCurrencies'

function CreateAuction({ pageIndex, movePage }) {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const [auctionType, setAuctionType] = useState('Dutch Auction')

  const [token, selectToken] = useState<Token>(null)
  const [tokenAmount, setTokenAmount] = useState(null)
  const [paymentCurrency, setPaymentCurrency] = useState(null)
  const [fundWallet, setFundWallet] = useState(null)

  const [startingPrice, setStartingPrice] = useState(null)
  const [endingPrice, setEndingPrice] = useState(null)

  const [startDate, setStartDate] = useState<Date>(null)
  const [endDate, setEndDate] = useState<Date>(null)

  const balance = useTokenBalance(account ?? undefined, token)

  const typedTokenAmount = tryParseAmount(tokenAmount, token)
  const [approvalState, approve] = useApproveCallback(typedTokenAmount, MISO_MARKET_ADDRESS[chainId])

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (startDate || endDate) {
      setCurrentStep(5)
    } else if (startingPrice || endingPrice) {
      setCurrentStep(4)
    } else if (fundWallet) {
      setCurrentStep(3)
    } else if (paymentCurrency) {
      setCurrentStep(2)
    } else if (tokenAmount) {
      setCurrentStep(1)
    } else {
      setCurrentStep(0)
    }
  }, [token, tokenAmount, paymentCurrency, fundWallet, startingPrice, endingPrice, startDate, endDate])

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
                  <ExclamationCircleIconOutline className="w-4 mr-2 mt-1" aria-hidden="true" />
                  <div className="flex-1 italic">
                    {i18n._(t`Great for a completely novel item’s true price discovery`)}
                  </div>
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
                  <ExclamationCircleIconOutline className="w-4 mr-2 mt-1" aria-hidden="true" />
                  <div className="flex-1 italic">
                    {i18n._(t`Great for projects looking to ensure that everyone taking part is rewarded`)}
                  </div>
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
                  <ExclamationCircleIconOutline className="w-4 mr-2 mt-1" aria-hidden="true" />
                  <div className="flex-1 italic">
                    {i18n._(t`Great when the token price is already known or has been decided on previously`)}
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" disabled size="sm" className="w-[133px]">
                {i18n._(t`Previous`)}
              </Button>
              <Button color="blue" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex + 1)}>
                {i18n._(t`Next`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 1 && (
          <div>
            <div className="mb-16">
              <TokenSelect onTokenSelect={(token) => selectToken(token)} />
              <div className={classNames('mt-8', currentStep < 1 ? 'opacity-50' : null)}>
                <Input
                  label="Auction Token Amount*"
                  value={tokenAmount}
                  type="digit"
                  placeholder="Enter the amount of token you would like to auction."
                  alert="This will be the number of tokens you will put into the auction contract. Please consider this carefully."
                  error={
                    !(tokenAmount && balance && !balance.lessThan(tokenAmount.toBigNumber(token.decimals).toString()))
                  }
                  hint={
                    <span className="text-secondary">
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
                  actionTitle={`Approve ${token?.symbol.length < 5 ? token.symbol : ''}`}
                  actionVisible={approvalState === ApprovalState.NOT_APPROVED}
                  actionPending={approvalState === ApprovalState.PENDING}
                />
              </div>
              <PaymentCurrency
                label="Payment Currency*"
                className={classNames(currentStep < 2 ? 'opacity-50' : null)}
                paymentCurrency={paymentCurrency}
                onChange={(value) => setPaymentCurrency(value)}
              />
              <div className={classNames('mt-8', currentStep < 3 ? 'opacity-50' : null)}>
                <Input
                  label="Fund Wallet*"
                  value={fundWallet}
                  type="text"
                  placeholder="Enter the wallet address where funds raised will be sent"
                  alert="This will be the number of tokens you will put into the auction contract. Please consider this carefully."
                  hint={
                    <div
                      className="text-blue underline ml-2 cursor-pointer text-sm"
                      onClick={() => setFundWallet(account)}
                    >
                      Use My Account
                    </div>
                  }
                  onUserInput={(input) => setFundWallet(input)}
                />
              </div>
              <DutchAuctionSettings
                className={classNames(currentStep < 4 ? 'opacity-50' : null)}
                paymentCurrency={paymentCurrency}
                tokenAmount={tokenAmount}
                startingPrice={startingPrice}
                endingPrice={endingPrice}
                onChange={(newStartingPrice, newEndingPrice) => {
                  setStartingPrice(newStartingPrice)
                  setEndingPrice(newEndingPrice)
                }}
              />
              <AuctionPeriod
                className={classNames(currentStep < 4 ? 'opacity-50' : null)}
                startDate={startDate}
                endDate={endDate}
                onChange={(newStartDate, newEndDate) => {
                  console.log(newStartDate)
                  setStartDate(newStartDate)
                  setEndDate(newEndDate)
                }}
              />
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button color="blue" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex + 1)}>
                {i18n._(t`Review`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 2 && (
          <div>
            <div className="mb-16">
              <ConfirmAuction
                auctionType={auctionType}
                auctionToken={token}
                auctionTokenAllowance={tokenAmount}
                auctionTokenAmount={tokenAmount}
                auctionStartDate={startDate}
                auctionEndDate={endDate}
                paymentCurrency={getPaymentCurrency(paymentCurrency, chainId)}
                fundWallet={fundWallet}
                startingPrice={startingPrice}
                endingPrice={endingPrice}
              />
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button color="gradient" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex + 1)}>
                {i18n._(t`Deploy`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 3 && (
          <div className="grid grid-cols-2 gap-16">
            <div>
              <Typography variant="h3" className="text-high-emphesis">
                {i18n._(t`Your Transaction is submitted...`)}
              </Typography>
              <ExternalLink className="underline" color="blue" href="#">
                {i18n._(t`View on Explorer`)}
              </ExternalLink>
              <Typography variant="lg" weight={700} className="text-secondary mt-10">
                {i18n._(t`Auction Contract Address`)}
              </Typography>
              <Typography variant="base" className="text-primary mt-2">
                {i18n._(t`You can view the auction address here once the transaction is completed`)}
              </Typography>
              <div className="flex flex-row gap-8 mt-8">
                <NavLink href="/miso/create-auction">
                  <div>
                    <Button color="gradient" className="w-[180px]" size="sm">
                      {i18n._(t`View Auction`)}
                    </Button>
                  </div>
                </NavLink>
                <NavLink href="/miso">
                  <div>
                    <Button variant="outlined" className="w-[180px]" size="sm" color="gradient_1000">
                      {i18n._(t`Edit Auction`)}
                    </Button>
                  </div>
                </NavLink>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex-1"></div>
              <div className="flex space-x-1 items-end mb-1 border-b border-b-2 border-primary">
                <Typography variant="lg" className="text-primary">
                  {i18n._(t`Create a Permission List`)}
                </Typography>
                <ArrowSmRightIcon className="text-secondary w-[30px] h-[30px] transform rotate-45" />
              </div>
              <div className="flex space-x-1 items-end mb-1 border-b border-b-2 border-primary mt-5">
                <Typography variant="lg" className="text-primary">
                  {i18n._(t`Set Up a Liquidity Launcher`)}
                </Typography>
                <ArrowSmRightIcon className="text-secondary w-[30px] h-[30px] transform rotate-45" />
              </div>
              <div className="flex space-x-1 items-end mb-1 border-b border-b-2 border-primary mt-5">
                <Typography variant="lg" className="text-primary">
                  {i18n._(t`Go To Marketplace`)}
                </Typography>
                <ArrowSmRightIcon className="text-secondary w-[30px] h-[30px] transform rotate-45" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const CreateAuctionLayout = ({ children }) => {
  const [pageIndex, movePage] = useState(0)

  return (
    <Layout
      navs={[
        { link: '/miso', name: 'MISO Factory' },
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
