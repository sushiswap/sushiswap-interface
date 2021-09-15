import { ArrowSmRightIcon, ExclamationCircleIcon as ExclamationCircleIconOutline } from '@heroicons/react/outline'
import {
  DuplicateIcon,
  ExclamationCircleIcon,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
} from '@heroicons/react/solid'
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
import CsvAddresses from '../../../features/miso/CsvAddresses'
import ManualAddresses from '../../../features/miso/ManualAddresses'
import useCopyClipboard from '../../../hooks/useCopyClipboard'
import BaseModal from '../../../modals/MisoModal/BaseModal'

function PermissionList({ pageIndex, movePage }) {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [isCopied, setCopied] = useCopyClipboard()

  const [ownerAddress, setOwnerAddress] = useState(null)
  const [paymentToken, setPaymentToken] = useState(null)
  const [addresses, setAddresses] = useState([
    { address: '0xC146C87c8E66719fa1E151d5A7D6dF9f0D3AD156', purchaseLimit: '5000' },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [isCsv, setIsCsv] = useState(true)

  const [addressPack, setAddressPack] = useState(null)

  const [permissionListAddress, setPermissionListAddress] = useState('0xC146C87c8E66719fa1E151d5A7D6dF9f0D3AD156')

  const [activationDialog, setActivationDialog] = useState(false)

  useEffect(() => {
    let packCount = Math.floor(addresses.length / 100)
    if (addresses.length % 100 > 0) packCount++
    let pack = []
    for (var i = 0; i < packCount - 1; i++) {
      pack.push({ from: i * 100 + 1, to: i * 100 + 100, status: 'Not Added' })
    }
    pack.push({ from: (packCount - 1) * 100 + 1, to: addresses.length, status: 'Not Added' })
    console.log(pack)
    setAddressPack(pack)
  }, [addresses])

  useEffect(() => {
    if (paymentToken) {
      setCurrentStep(1)
    } else {
      setCurrentStep(0)
    }
  }, [paymentToken])

  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div>
        {pageIndex === 0 && (
          <div>
            <div>
              <Input
                label="List Owner Address*"
                value={ownerAddress}
                type="text"
                placeholder="Enter the address of the administrator/owner of this list."
                alert="Enter the address of the owner or administrator of this list used to create the auction."
                hint={
                  <div
                    className="text-blue underline ml-2 cursor-pointer text-sm"
                    onClick={() => setOwnerAddress(account)}
                  >
                    Use My Account
                  </div>
                }
                onUserInput={(input) => setOwnerAddress(input)}
              />
            </div>

            <PaymentCurrency
              label="Auction Payment Token*"
              className={classNames(currentStep < 1 ? 'opacity-50' : null)}
              paymentCurrency={paymentToken}
              onChange={(value) => setPaymentToken(value)}
            />
            <div className="py-6" />
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
            {isCsv ? (
              <CsvAddresses addresses={addresses} onManualMode={() => setIsCsv(false)} />
            ) : (
              <ManualAddresses addresses={addresses} setAddresses={setAddresses} />
            )}

            <div className="py-6" />
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button color="blue" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex + 1)}>
                {i18n._(t`Next`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 2 && (
          <div>
            <div className="mr-[200px]">
              <Input
                label="List Owner Address*"
                value={ownerAddress}
                type="text"
                hint={
                  <span className="text-secondary">
                    <b>{i18n._(t`Note`)}</b>:{' '}
                    {i18n._(t`Make sure the wallet owner/admin address and the name are set correctly to your liking.`)}
                  </span>
                }
                padding={false}
                readOnly
              />
              <div className="mt-3 grid grid-cols-3">
                <Typography variant="lg" className="mb-3 text-primary underline">
                  {i18n._(t`Entry Index`)}
                </Typography>
                <Typography variant="lg" className="mb-3 text-primary underline">
                  {i18n._(t`Status`)}
                </Typography>
                <div></div>
                {addressPack.map((pack, index) => [
                  <div key={'col_1_' + index} className="flex items-center">
                    <Typography className="text-primary rounded bg-blue px-4 py-0.5">
                      {i18n._(`${pack.from} - ${pack.to}`)}
                    </Typography>
                  </div>,
                  <div key={'col_2_' + index} className="flex items-center">
                    <Typography className="text-primary">{i18n._(`${pack.status}`)}</Typography>
                  </div>,
                  <div key={'col_3_' + index} className="flex justify-end">
                    {pack.status == 'Not Added' ? (
                      <Button size="sm" variant="outlined" color="gradient_1000" onClick={() => {}}>
                        {i18n._(t`Add To List`)}
                      </Button>
                    ) : (
                      <Button variant="outlined" color="gradient_1000" onClick={() => {}}>
                        {i18n._(t`View On Explorer`)}
                      </Button>
                    )}
                  </div>,
                ])}
              </div>

              <div className="mt-8 flex justify-between">
                <Typography className="text-primary">
                  {i18n._(t`Total Number of Entries: ${addresses.length}`)}
                </Typography>
                <Typography className="text-blue underline">{i18n._(t`Downlaod .csv file`)}</Typography>
              </div>

              <div className="flex flex-row items-start space-x-2 bg-purple bg-opacity-20 bg- mt-5 p-3 rounded">
                <ExclamationCircleIcon className="w-5 h-5 mr-2 text-purple" aria-hidden="true" />
                <div className="flex-1">
                  <Typography className="">
                    {i18n._(t`Double-check your entries by downloading the .csv file to review.`)}
                  </Typography>
                  <Typography className="">
                    {i18n._(t`Click ‘PREVIOUS’ button and re-upload the file if you would like to make any changes.`)}
                  </Typography>
                  <Typography className="">
                    {i18n._(t`Click ‘Add To List’ to deploy the entries on the smart contract.`)}
                  </Typography>
                </div>
              </div>
            </div>

            <BaseModal
              isOpen={activationDialog}
              onDismiss={() => setActivationDialog(false)}
              title="Activation Required"
              description="In order to activate this list, go to ‘Edit Auction’ first. Then, copy and paste this address in the permission list input field."
              actionTitle="Go To Edit Auction"
              actionDescription=""
              onAction={() => {}}
            >
              <div className="flex">
                <Typography className="flex-1 text-secondary">{i18n._(t`Permission List Contract Address`)}</Typography>
                <Typography className="text-blue">{i18n._(`${shortenAddress(permissionListAddress)}`)}</Typography>
                <DuplicateIcon
                  className="cursor-pointer w-[20px] h-[20px]"
                  onClick={() => setCopied(permissionListAddress)}
                />
              </div>
            </BaseModal>

            <div className="py-6" />
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" size="sm" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button color="gradient" size="sm" className="w-[133px]" onClick={() => setActivationDialog(true)}>
                {i18n._(t`Next`)}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const PermissionListLayout = ({ children }) => {
  const [pageIndex, movePage] = useState(0)

  return (
    <Layout
      navs={[
        { link: '/miso', name: 'MISO Factory' },
        { link: '/miso/permission-list', name: 'Create a Permission List' },
      ]}
      title={{
        heading: 'Create a PermissionList',
        content:
          'Deploy the contract to launch liquidity pool of the auction sale token pairing with the auction payment token to the SushiSwap exchange.',
      }}
      tabs={[
        { heading: 'INITIAL SETUP', content: 'Set up owner address & list token' },
        { heading: 'SET PERMISSIONS', content: 'Upload or Create your permission list' },
        { heading: 'REVIEW & DEPLOY', content: 'Deploy your permission list' },
      ]}
      active={pageIndex}
    >
      {childrenWithProps(children, { pageIndex, movePage })}
    </Layout>
  )
}
PermissionList.Layout = PermissionListLayout

export default PermissionList
