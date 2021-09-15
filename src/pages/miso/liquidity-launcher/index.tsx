import { ArrowSmRightIcon, ExclamationCircleIcon as ExclamationCircleIconOutline } from '@heroicons/react/outline'
import { DuplicateIcon, ExclamationCircleIcon as ExclamationCircleIconSolid } from '@heroicons/react/outline'
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
import { classNames, shortenAddress } from '../../../functions'
import { getPaymentCurrency } from '../../../features/miso/helper/PaymentCurrencies'
import PaymentOption from '../../../features/miso/PaymentOption'
import { numberWithCommas } from '../../../features/miso/helper/numberWithCommas'
import Slider from '../../../components/Slider'
import LiquidityLockTimeline from '../../../features/miso/LiquidityLockTimeline'
import ConfirmAuctionRow from '../../../features/miso/ConfirmAuctionRow'
import useCopyClipboard from '../../../hooks/useCopyClipboard'
import BaseModal from '../../../modals/MisoModal/BaseModal'
import TransactionFailedModal from '../../../modals/TransactionFailedModal'

function LiquidityLauncher({ pageIndex, movePage }) {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const [isCopied, setCopied] = useCopyClipboard()
  // const [auctionType, setAuctionType] = useState('Dutch Auction')

  // const [token, selectToken] = useState<Token>(null)
  const [adminAddress, setAdminAddress] = useState(null)
  const [auctionAddress, setAuctionAddress] = useState(null)
  const [vaultAddress, setVaultAddress] = useState(null)
  const [liquidityAmount, setLiquidityAmount] = useState(null)
  const [lockDays, setLockDays] = useState(null)

  const token = {
    symbol: 'CBBG',
    balance: 1000000,
    allowance: 1000,
    address: '0xC146C87c8E66719fa1E151d5A7D6dF9f0D3AD156',
  }
  const pairToken = { symbol: 'ETH' }

  const [currentStep, setCurrentStep] = useState(0)

  const [liquidityLauncherAddress, setLiquidityLauncherAddress] = useState(null)
  const [deploymentTx, setDeploymentTx] = useState('0xC146C87c8E66719fa1E151d5A7D6dF9f0D3AD156')

  const [activationDialog, setActivationDialog] = useState(false)

  useEffect(() => {
    if (lockDays) {
      setCurrentStep(3)
    } else if (vaultAddress) {
      setCurrentStep(2)
    } else if (auctionAddress) {
      setCurrentStep(1)
    } else {
      setCurrentStep(0)
    }
  }, [lockDays, vaultAddress, auctionAddress, adminAddress])

  const approveLiquidityAmount = () => {}

  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div>
        {pageIndex === 0 && (
          <div>
            <div className="">
              <Input
                label="Admin Address*"
                value={adminAddress}
                type="text"
                placeholder="Enter the wallet address of the token administrator"
                alert="Enter the wallet address used to create this token on MISO.  This enables you launch liquidity on SUSHI, and is needed for administrative actions like defining permission lists, setting token distribution percentages, and lockup timelines."
                hint={
                  <div
                    className="text-blue underline ml-2 cursor-pointer text-sm"
                    onClick={() => setAdminAddress(account)}
                  >
                    Use My Account
                  </div>
                }
                onUserInput={(input) => setAdminAddress(input)}
              />
            </div>
            <div className={classNames('mt-8', currentStep < 1 ? 'opacity-50' : null)}>
              <Input
                label="Auction Address*"
                value={auctionAddress}
                type="text"
                placeholder="Enter the address of the auction of the token"
                alert="Enter the address of the auction created for this token. 
                This enables us to import data from the auction to facilitate the launching process."
                hint={
                  <div
                    className="text-blue underline ml-2 cursor-pointer text-sm"
                    onClick={() => setAuctionAddress(account)}
                  >
                    Use My Account
                  </div>
                }
                onUserInput={(input) => setAuctionAddress(input)}
              />
            </div>
            <div className={classNames('mt-8', currentStep < 2 ? 'opacity-50' : null)}>
              <Input
                label="Vault Address*"
                value={vaultAddress}
                type="text"
                placeholder="Enter the wallet address to deposit SLP tokens and extra base pair tokens"
                alert="Enter the wallet address to create SLP tokens and any remaining base pair tokens.  This can be the admin address, or any other wallet address you have access to."
                hint={
                  <div
                    className="text-blue underline ml-2 cursor-pointer text-sm"
                    onClick={() => setVaultAddress(account)}
                  >
                    Use My Account
                  </div>
                }
                onUserInput={(input) => setVaultAddress(input)}
              />
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" size="sm" className="w-[133px]">
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
            <div className="pr-3 mr-[200px]">
              <div className="flex space-x-4 items-center">
                <Typography className="text-primary text-xl">{i18n._(t`Liquidity Pair Token*`)}</Typography>
                <div className="text-primary text-sm rounded bg-blue bg-opacity-50 px-3 py-0.5">
                  {token.symbol} + {pairToken.symbol}
                </div>
              </div>
              <PaymentOption className="mt-2" title="ETHEREUM" selected={true} />
              <Typography className="mt-3 text-secondary text-sm">
                {i18n._(t`The base pair token is set to the payment currency from your auction.`)}
              </Typography>
            </div>

            <div className="pr-3 mr-[200px] mt-8">
              <Typography className="text-primary text-xl">{i18n._(t`Liquidity Provisioning Setup*`)}</Typography>

              <div className="mt-3 grid grid-cols-2">
                <div>
                  <Typography className="text-secondary">{i18n._(t`Your Token Balance`)}</Typography>
                  <Typography className="text-primary">
                    {i18n._(`${numberWithCommas(token.balance)} ${token.symbol}`)}
                  </Typography>
                </div>
                <div>
                  <Typography className="text-secondary">{i18n._(t`Your Token Allowance`)}</Typography>
                  <Typography className="text-primary">
                    {i18n._(`${numberWithCommas(token.allowance)} ${token.symbol}`)}
                  </Typography>
                </div>
              </div>

              <Slider className="mt-5" currentValue={25} minValue={0} maxValue={100} />
            </div>
            <div className="mt-5">
              <Input
                label=""
                value={liquidityAmount}
                type="digit"
                onUserInput={(input) => setLiquidityAmount(input)}
                onAction={approveLiquidityAmount}
                actionTitle="Approve"
                actionVisible={true}
                hint={
                  <span className="text-secondary">
                    {i18n._(
                      t`Enter the amount or percentage from the auction sale you would like to reserve for the liquidity pool. The amount is taken from your token allowance to launch a 50/50 weighting liquidity pool on Sushi.`
                    )}
                  </span>
                }
                alert="Select the amount of your custom and pair token to allocate for the liquidity pool on Sushi."
              />
            </div>
            <LiquidityLockTimeline lockDays={lockDays} onChange={(value) => setLockDays(value)} />

            <div className="mb-10"></div>
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
            <Typography variant="h3" className="text-primary font-bold">
              {i18n._(t`Confirm Your Post Auction Liquidity Launcher`)}
            </Typography>
            <div className="grid grid-cols-12 gap-10 mt-3">
              <div className="col-span-7 mr-10">
                <ConfirmAuctionRow
                  title="Your Token Pair"
                  content={`${token.symbol} (${shortenAddress(token.address)}) + ${pairToken.symbol}`}
                />
                <ConfirmAuctionRow
                  title="Liquidity Provisioning"
                  content={`${token.symbol} (${shortenAddress(token.address)}) + ${pairToken.symbol}   50%:50%`}
                />
                <Typography className="text-secondary">
                  {i18n._(
                    t`25% of amount raised in ETH, pairing with 2000,000 CBBG, will be launched on Sushi as a 50/50 weighting liqudity pool.`
                  )}
                </Typography>

                <Typography variant="lg" className="mt-10 text-secondary font-bold">
                  {i18n._(t`Liquidity Lockup Timeline`)}*
                </Typography>
                <Typography className="text-primary">
                  {i18n._(t`Liquidity is set to unlock 90 days after the auction is finalized`)}
                </Typography>
              </div>
              <div className="col-span-5">
                <Typography className="text-secondary font-bold my-1 mb-5">
                  {i18n._(t`Connected Addresses`)}*
                </Typography>
                <ConfirmAuctionRow title="Admin Address" toCopy={adminAddress} showCopy />
                <ConfirmAuctionRow title="Auction Address" toCopy={auctionAddress} showCopy />
                <ConfirmAuctionRow title="Vault Address" toCopy={vaultAddress} showCopy />
              </div>
            </div>
            <BaseModal
              isOpen={activationDialog}
              onDismiss={() => setActivationDialog(false)}
              title="Activation Required"
              description="To activate the liquidity launcher after it is deployed, the auction wallet address needs to be updated to liquidity launcher contract address."
              actionTitle="Activate Liquidity Launcher"
              actionDescription="Please wait for liquidity launcher to be deployed first..."
              onAction={() => movePage(pageIndex + 1)}
            >
              <div className="flex">
                <Typography className="flex-1 text-secondary">{i18n._(t`Deployment TX ID`)}</Typography>
                <Typography className="text-blue">{i18n._(`${shortenAddress(deploymentTx)}`)}</Typography>
                <DuplicateIcon className="cursor-pointer w-[20px] h-[20px]" onClick={() => setCopied(deploymentTx)} />
              </div>
              <div className="flex">
                <Typography className="flex-1 text-secondary">{i18n._(t`Auction Address`)}</Typography>
                <Typography className="text-blue">{i18n._(`${shortenAddress(auctionAddress)}`)}</Typography>
                <DuplicateIcon className="cursor-pointer w-[20px] h-[20px]" onClick={() => setCopied(auctionAddress)} />
              </div>
              <div className="flex">
                <Typography className="flex-1 text-secondary">{i18n._(t`Liquidity Launcher Address`)}</Typography>
                {liquidityLauncherAddress ? (
                  <Typography className="text-blue">{i18n._(`${liquidityLauncherAddress}`)}</Typography>
                ) : (
                  <Typography className="text-high-emphesis mr-[20px]">{i18n._(t`Pending`)}</Typography>
                )}
                {liquidityLauncherAddress && (
                  <DuplicateIcon
                    className="cursor-pointer w-[20px] h-[20px]"
                    onClick={() => setCopied(liquidityLauncherAddress)}
                  />
                )}
              </div>
            </BaseModal>
            <div className="mb-5"></div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button color="gradient" size="sm" className="w-[133px]" onClick={() => setActivationDialog(true)}>
                {i18n._(t`Deploy`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 3 && (
          <div className="flex flex-col items-start">
            <Typography variant="h3" className="text-high-emphesis">
              {i18n._(t`Your Post Auction Liquidity Launcher is deployed and activated!`)}
            </Typography>
            <div className="mt-8 flex space-x-1 items-end mb-1 border-b border-b-2 border-primary">
              <Typography variant="lg" className="text-primary">
                {i18n._(t`Create a Permission List`)}
              </Typography>
              <ArrowSmRightIcon className="text-primary w-[30px] h-[30px] transform rotate-45" />
            </div>
            <div className="flex space-x-1 items-end mb-1 border-b border-b-2 border-primary mt-5">
              <Typography variant="lg" className="text-primary">
                {i18n._(t`View This Auction`)}
              </Typography>
              <ArrowSmRightIcon className="text-primary w-[30px] h-[30px] transform rotate-45" />
            </div>
            <div className="flex space-x-1 items-end mb-1 border-b border-b-2 border-primary mt-5">
              <Typography variant="lg" className="text-primary">
                {i18n._(t`Go To Marketplace`)}
              </Typography>
              <ArrowSmRightIcon className="text-primary w-[30px] h-[30px] transform rotate-45" />
            </div>
            <div className="flex-1"></div>
          </div>
        )}
      </div>
    </>
  )
}

const LiquidityLauncherLayout = ({ children }) => {
  const [pageIndex, movePage] = useState(0)

  return (
    <Layout
      navs={[
        { link: '/miso', name: 'MISO Factory' },
        { link: '/miso/create-auction', name: 'Post Auction Liquidity Launcher' },
      ]}
      title={{
        heading: 'Post Auction Liquidity Launcher',
        content:
          'Deploy the contract to launch liquidity pool of the auction sale token pairing with the auction payment token to the SushiSwap exchange.',
      }}
      tabs={[
        { heading: 'SET ADDRESSES', content: 'Enter the relevant addreses' },
        { heading: 'CONFIGURE LIQUIDITY SETUP', content: 'Set required liquidity pool parameters' },
        { heading: 'REVIEW', content: 'Deploy your liquidity launcher' },
      ]}
      active={pageIndex}
    >
      {childrenWithProps(children, { pageIndex, movePage })}
    </Layout>
  )
}
LiquidityLauncher.Layout = LiquidityLauncherLayout

export default LiquidityLauncher
