import { ArrowSmRightIcon, ExclamationCircleIcon as ExclamationCircleIconOutline } from '@heroicons/react/outline'
import { ExclamationCircleIcon as ExclamationCircleIconSolid } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Token } from '@sushiswap/sdk'
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
import NavLink from '../../../components/NavLink'
import { classNames, shortenString } from '../../../functions'
import { getPaymentCurrency } from '../../../features/miso/helper/PaymentCurrencies'
import ConfirmAuctionRow from '../../../features/miso/ConfirmAuctionRow'
import { useTokenAllowance } from '../../../hooks/useTokenAllowance'
import { format } from 'date-fns'
import { useCurrency } from '../../../hooks/Tokens'
import useAuctions from '../../../hooks/miso/useAuctions'
import { defaultAbiCoder } from '@ethersproject/abi'
import { getExplorerLink } from '../../../functions/explorer'
import { parseUnits } from '@ethersproject/units'

function CreateAuction({ pageIndex, movePage }) {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const [auctionType, setAuctionType] = useState('2')

  const [token, selectToken] = useState<Token>(null)
  const [tokenAmount, setTokenAmount] = useState(null)
  const [currencyId, setCurrencyId] = useState(null)
  const [fundWallet, setFundWallet] = useState(null)

  const [startingPrice, setStartingPrice] = useState(null)
  const [endingPrice, setEndingPrice] = useState(null)

  const [startDate, setStartDate] = useState<Date>(null)
  const [endDate, setEndDate] = useState<Date>(null)

  const balance = useTokenBalance(account ?? undefined, token)

  const paymentCurrency = useCurrency(currencyId)

  const tokenAllowance = useTokenAllowance(token, account ?? undefined, MISO_MARKET_ADDRESS[chainId])

  const typedTokenAmount = tryParseAmount(tokenAmount, token)
  const [approvalState, approve] = useApproveCallback(typedTokenAmount, MISO_MARKET_ADDRESS[chainId])

  const { createMarket } = useAuctions()

  const [currentStep, setCurrentStep] = useState(0)
  const [txState, setTxState] = React.useState(0)
  const [tx, setTx] = React.useState(null)
  const [receipt, setRecipt] = React.useState(null)

  useEffect(() => {
    if (startDate || endDate) {
      setCurrentStep(5)
    } else if (startingPrice || endingPrice) {
      setCurrentStep(4)
    } else if (fundWallet) {
      setCurrentStep(3)
    } else if (currencyId) {
      setCurrentStep(2)
    } else if (tokenAmount) {
      setCurrentStep(1)
    } else {
      setCurrentStep(0)
    }
  }, [token, tokenAmount, currencyId, fundWallet, startingPrice, endingPrice, startDate, endDate])

  const makeDutchData = () => {
    const _startDate = Math.floor(startDate.getTime() / 1000)
    const _endDate = Math.floor(endDate.getTime() / 1000)

    const pointList = '0x0000000000000000000000000000000000000000'

    return defaultAbiCoder.encode(
      [
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'address',
        'uint256',
        'uint256',
        'address',
        'address',
        'address',
      ],
      [
        MISO_MARKET_ADDRESS[chainId],
        token.address,
        parseUnits(tokenAmount, token.decimals).toString(),
        _startDate,
        _endDate,
        paymentCurrency instanceof Token ? paymentCurrency.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        parseUnits(startingPrice, paymentCurrency.decimals).toString(),
        parseUnits(endingPrice, paymentCurrency.decimals).toString(),
        account,
        pointList,
        fundWallet,
      ]
    )
  }

  const makeCrowdsaleData = () => {}

  const makeBatchData = () => {}

  const deployAuction = () => {
    let data
    if (auctionType == '2') {
      data = makeDutchData()
    } else if (auctionType == '1') {
      data = makeCrowdsaleData()
    } else if (auctionType == '3') {
      data = makeBatchData()
    }

    const txPromise = createMarket(auctionType, token.address, tokenAmount, data)
    setTxState(1)
    txPromise
      .then((createTx) => {
        console.log(createTx)
        setTx(createTx)
        setTxState(2)
        movePage(pageIndex + 1)
        createTx
          .wait()
          .then((createReceipt) => {
            console.log(createReceipt)
            setRecipt(createReceipt)
            if (createReceipt.status) setTxState(3)
            else setTxState(4)
          })
          .catch((reason) => {
            console.log(reason)
            setTxState(4)
          })
      })
      .catch((reason) => {
        console.log(reason)
        setTxState(0)
      })
  }

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
                  selected={auctionType === '2'}
                  onSelect={() => setAuctionType('2')}
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
                  selected={auctionType === '1'}
                  onSelect={(label) => setAuctionType('1')}
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
                  selected={auctionType === '3'}
                  onSelect={(label) => setAuctionType('3')}
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
                chainId={chainId}
                className={classNames(currentStep < 2 ? 'opacity-50' : null)}
                paymentCurrency={currencyId}
                onChange={(value) => setCurrencyId(value)}
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
              <Typography variant="h3" className="text-primary font-bold">
                {i18n._(t`Confirm Your Auction Setup`)}
              </Typography>
              <div className="grid grid-cols-12 gap-10 mt-3">
                <div className="col-span-7">
                  <ConfirmAuctionRow title="Auction Type" content={auctionType} />
                  <ConfirmAuctionRow
                    title="Auction Token"
                    content={token.name + ' (' + token.symbol + ')'}
                    toCopy={token.address}
                    showCopy
                  />
                  <ConfirmAuctionRow
                    title="Auction Token Allowance"
                    content={shortenString(tokenAllowance.toSignificant(6), 20) + ' ' + token.symbol}
                  />
                  <ConfirmAuctionRow title="Auction Token Amount" content={tokenAmount + ' ' + token.symbol} />
                  <ConfirmAuctionRow
                    title="Auction Start &amp; End"
                    content={format(startDate, 'PPpp') + ' - ' + format(endDate, 'PPpp')}
                  />
                </div>
                <div className="col-span-5">
                  <ConfirmAuctionRow
                    title="Payment Currency"
                    content={paymentCurrency.name + '(' + paymentCurrency.symbol + ')'}
                    toCopy={paymentCurrency instanceof Token ? paymentCurrency.address : ''}
                    showCopy
                  />
                  <ConfirmAuctionRow title="Fund Wallet" toCopy={fundWallet} showCopy />

                  <Typography className="text-secondary font-bold my-1">{i18n._(t`Price Settings`)}*</Typography>
                  <div className="grid grid-cols-2 gap-8 text-primary mb-2">
                    <div>
                      <Typography variant="sm" className="text-primary mb-1">
                        {i18n._(`STARTING PRICE`)}
                      </Typography>
                      <Typography className="rounded bg-dark-900 px-4 py-0.5">
                        {i18n._(`${startingPrice} ${paymentCurrency.symbol}`)}
                      </Typography>
                    </div>
                    <div className="flex items-start">
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-1 mb-1">
                          <ArrowSmRightIcon className="text-secondary w-[20px] h-[20px] transform rotate-45" />
                          <Typography variant="sm" className="text-primary">
                            {i18n._(`MAXIMUM RAISED`)}
                          </Typography>
                        </div>
                        <Typography variant="sm" className="rounded bg-blue bg-opacity-50 px-2">
                          {i18n._(`${tokenAmount * parseFloat(startingPrice)} ${paymentCurrency.symbol}`)}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <Typography className="text-secondary font-bold my-1">{i18n._(t`Price Settings`)}*</Typography>
                  <div className="grid grid-cols-2 gap-8 text-primary mb-2">
                    <div>
                      <Typography variant="sm" className="text-primary mb-1">
                        {i18n._(`ENDING PRICE`)}
                      </Typography>
                      <Typography className="rounded bg-dark-900 px-4 py-0.5">
                        {i18n._(`${endingPrice} ${paymentCurrency.symbol}`)}
                      </Typography>
                    </div>
                    <div className="flex items-start">
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-1 mb-1">
                          <ArrowSmRightIcon className="text-secondary w-[20px] h-[20px] transform rotate-45" />
                          <Typography variant="sm" className="text-primary">
                            {i18n._(`MINIMUM RAISED`)}
                          </Typography>
                        </div>
                        <Typography variant="sm" className="rounded bg-blue bg-opacity-50 px-2">
                          {i18n._(`${tokenAmount * parseFloat(endingPrice)} ${paymentCurrency.symbol}`)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button color="gradient" size="sm" className="w-[133px]" onClick={() => deployAuction()}>
                {i18n._(t`Deploy`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 3 && (
          <div className="grid grid-cols-2 gap-16">
            <div>
              <Typography variant="h3" className="text-high-emphesis">
                {txState === 3 && i18n._(t`Transaction Completed!`)}
                {txState === 2 && i18n._(t`Your Transaction is submitted...`)}
              </Typography>
              <ExternalLink className="underline" color="blue" href={getExplorerLink(chainId, tx.hash, 'transaction')}>
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
