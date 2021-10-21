import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import Typography from '../../../components/Typography'
import Input from '../../../features/miso/Input'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import Layout from '../../../layouts/Miso'
import childrenWithProps from '../../../layouts/Miso/children'
import { socialsPlaceholder } from '../../../components/SocialPlaceholder'
import { numberWithCommas } from '../../../features/miso/helper/numberWithCommas'
import { useRouter } from 'next/router'
import { useAuctionInfo } from '../../../hooks/miso/useAuctionInfo'
import { useAdminAuctions, useGetDocuments, useGetPermissionList } from '../../../hooks/miso/useAuctions'

function EditAuction({ pageIndex, movePage }) {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const router = useRouter()
  const { id } = router.query
  const auctionAddress = id.toString()

  const auctionInfo = useAuctionInfo(auctionAddress)
  const { setDocument, updatePermissionList, updatePermissionListStatus, cancelAuction } = useAdminAuctions()

  const [projectWebsiteUrl, setProjectWebsiteUrl] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectTwitterUrl, setProjectTwitterUrl] = useState('')
  const [projectInstagramUrl, setProjectInstagramUrl] = useState('')
  const [projectMediumUrl, setProjectMediumUrl] = useState('')
  const [projectDiscordUrl, setProjectDiscordUrl] = useState('')
  const [projectGithubUrl, setProjectGithubUrl] = useState('')

  const [tokenIcon, setTokenIcon] = useState('')
  const [desktopBanner, setDesktopBanner] = useState('')
  const [mobileBanner, setMobileBanner] = useState('')

  const [permissionList, setPermissionList] = useState('')
  const [bannedCountry, setBannedCountry] = useState('')
  const [warningMessage, setWarningMessage] = useState('')

  const [liquidityReceiver, setLiquidityReceiver] = useState('')
  const [permissionListStatus, setPermissionListStatus] = useState(false)

  const ethAmount = 900000
  const ethCurrency = 'ETH'
  const tokenAmount = 2000000
  const tokenCurrency = 'CBBG'

  const documents = useGetDocuments(auctionAddress)
  const permissionListInfo = useGetPermissionList(auctionAddress)

  useEffect(() => {
    documents.forEach((document) => {
      if (document.name == 'website') {
        setProjectWebsiteUrl(document.data)
      } else if (document.name == 'description') {
        setProjectDescription(document.data)
      } else if (document.name == 'twitter') {
        setProjectTwitterUrl(document.data)
      } else if (document.name == 'medium') {
        setProjectMediumUrl(document.data)
      } else if (document.name == 'discord') {
        setProjectDiscordUrl(document.data)
      } else if (document.name == 'github') {
        setProjectGithubUrl(document.data)
      } else if (document.name == 'twitter') {
        setProjectTwitterUrl(document.data)
      } else if (document.name == 'icon') {
        setTokenIcon(document.data)
      } else if (document.name == 'desktopBanner') {
        setDesktopBanner(document.data)
      } else if (document.name == 'mobileBanner') {
        setMobileBanner(document.data)
      } else if (document.name == 'bannedCountries') {
        setBannedCountry(document.data)
      } else if (document.name == 'bannedWarning') {
        setWarningMessage(document.data)
      }
    })

    if (permissionListInfo.address) {
      setPermissionList(permissionListInfo.address)
    }

    if (permissionListInfo.status) {
      setPermissionListStatus(permissionListInfo.status)
    }
  }, [documents, permissionListInfo])

  const handleUpdate = async (name, data) => {
    if (name === 'icon' || name === 'desktopBanner' || name === 'mobileBanner') {
      const width = name === 'icon' ? 256 : name === 'desktopBanner' ? 478 : 360
      const height = name === 'icon' ? 256 : name === 'desktopBanner' ? 678 : 104
      const img = new Image()
      img.onerror = async () => {
        alert('The image url is invalid.')
      }
      img.onload = async () => {
        if (img.width === width && img.height === height) {
          await setDocument(auctionAddress, name, data)
        } else {
          alert(
            `The ${
              name === 'icon' ? 'icon' : name === 'desktopBanner' ? 'desktop banner' : 'mobile banner'
            } must be ${width} X ${height}`
          )
        }
      }
      img.src = data
    } else {
      await setDocument(auctionAddress, name, data)
    }
  }

  const handleUpdatePermissionList = async () => {
    await updatePermissionList(auctionAddress, permissionList)
  }

  const handleEnablePermissionList = async () => {
    await updatePermissionListStatus(auctionAddress, !permissionListStatus)
  }

  const handleCancelAuction = async () => {
    await cancelAuction(auctionAddress)
  }

  const handleCancelLiquidityLauncher = () => {}

  const handleWithdrawLiquidity = () => {}

  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div>
        {pageIndex === 0 && (
          <div>
            <div className="mt-4">
              <Input
                label="Project Website"
                value={projectWebsiteUrl}
                type="text"
                placeholder="Enter the url of your project website."
                onUserInput={(input) => setProjectWebsiteUrl(input)}
                onAction={() => handleUpdate('website', projectWebsiteUrl)}
                actionTitle="Update"
                actionVisible={true}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Project Description"
                value={projectDescription}
                type="textarea"
                placeholder=""
                onUserInput={(input) => setProjectDescription(input)}
                onAction={() => handleUpdate('description', projectDescription)}
                actionTitle="Update"
                actionVisible={true}
                maxLength={300}
              />
            </div>
            <div className="mt-4">
              <Typography className="text-xl">{i18n._(t`Social Links`)}</Typography>
              <Input
                value={projectTwitterUrl}
                type="text"
                placeholder="Enter your project Twitter's URL here."
                onUserInput={(input) => setProjectTwitterUrl(input)}
                onAction={() => handleUpdate('twitter', projectTwitterUrl)}
                actionTitle="Update"
                actionVisible={true}
                icon={socialsPlaceholder.twitter.icon}
              />
              {/* <Input
                value={projectInstagramUrl}
                type="text"
                placeholder="Enter your project Instagram's URL here."
                onUserInput={(input) => setProjectInstagramUrl(input)}
                onAction={() => handleUpdate(3)}
                actionTitle="Update"
                actionVisible={true}
                icon={socialsPlaceholder.instagram.icon}
              /> */}
              <Input
                value={projectMediumUrl}
                type="text"
                placeholder="Enter your project Medium's URL here."
                onUserInput={(input) => setProjectMediumUrl(input)}
                onAction={() => handleUpdate('medium', projectMediumUrl)}
                actionTitle="Update"
                actionVisible={true}
                icon={socialsPlaceholder.medium.icon}
              />
              <Input
                value={projectDiscordUrl}
                type="text"
                placeholder="Enter your project Discord's URL here."
                onUserInput={(input) => setProjectDiscordUrl(input)}
                onAction={() => handleUpdate('discord', projectDiscordUrl)}
                actionTitle="Update"
                actionVisible={true}
                icon={socialsPlaceholder.discord.icon}
              />
              <Input
                value={projectGithubUrl}
                type="text"
                placeholder="Enter your project github's URL here."
                onUserInput={(input) => setProjectGithubUrl(input)}
                onAction={() => handleUpdate('github', projectGithubUrl)}
                actionTitle="Update"
                actionVisible={true}
                icon={socialsPlaceholder.github.icon}
              />
            </div>
          </div>
        )}
        {pageIndex === 1 && (
          <div>
            <div className="mt-4">
              <Input
                label="Token Icon"
                value={tokenIcon}
                type="text"
                placeholder="Enter the URL of your token icon."
                onUserInput={(input) => setTokenIcon(input)}
                onAction={() => handleUpdate('icon', tokenIcon)}
                actionTitle="Update"
                actionVisible={true}
                hint={
                  <span className="text-secondary">
                    <b>{i18n._(t`Note`)}</b>: {i18n._(t`Uploaded icon size must be 256*256`)}
                  </span>
                }
              />
            </div>

            <div className="mt-4">
              <Input
                label="Desktop Banner"
                value={desktopBanner}
                type="text"
                placeholder="Enter the URL of desktop banner for marketing display."
                onUserInput={(input) => setDesktopBanner(input)}
                onAction={() => handleUpdate('desktopBanner', desktopBanner)}
                actionTitle="Update"
                actionVisible={true}
                hint={
                  <span className="text-secondary">
                    <b>{i18n._(t`Note`)}</b>: {i18n._(t`Uploaded desktop banner size must be 478*678`)}
                  </span>
                }
              />
            </div>

            <div className="mt-4">
              <Input
                label="Mobile Banner"
                value={mobileBanner}
                type="text"
                placeholder="Enter the URL of mobile banner for marketing display."
                onUserInput={(input) => setMobileBanner(input)}
                onAction={() => handleUpdate('mobileBanner', mobileBanner)}
                actionTitle="Update"
                actionVisible={true}
                hint={
                  <span className="text-secondary">
                    <b>{i18n._(t`Note`)}</b>: {i18n._(t`Uploaded mobile banner size must be 360*104`)}
                  </span>
                }
              />
            </div>
          </div>
        )}
        {pageIndex === 2 && (
          <div>
            <div className="mt-4">
              <Input
                label="Permission List"
                description="Auctions are open by default. You can add a smart contract with approval logic to your auction. This will restrict users participating in your auction if enabled. Please refer to our developer documentation and sample list in our Github Repo."
                value={permissionList}
                type="text"
                placeholder="Enter the permission list smart contract address."
                onUserInput={(input) => setPermissionList(input)}
                onAction={() => handleUpdatePermissionList()}
                actionTitle="Update"
                actionVisible={true}
                hint={
                  <div className="text-secondary flex items-center space-x-5">
                    <b>{i18n._(t`Status`)}</b>: {i18n._(`${permissionListStatus ? 'Active' : 'Inactive'}`)}
                    <div
                      className="text-blue underline ml-2 cursor-pointer text-sm"
                      onClick={() => handleEnablePermissionList()}
                    >
                      {permissionListStatus ? 'Disable' : 'Enable'}
                    </div>
                  </div>
                }
              />
            </div>
            <div className="mt-4">
              <Input
                label="Country Ban"
                value={bannedCountry}
                type="text"
                placeholder="Search and select a country by entering the name."
                onUserInput={(input) => setBannedCountry(input)}
                onAction={() => handleUpdate('bannedCountries', bannedCountry)}
                actionTitle="Update"
                actionVisible={true}
              />
              <Typography className="text-secondary text-base">{i18n._(t`Warning Message*`)}</Typography>
              <Input
                value={warningMessage}
                type="textarea"
                placeholder="Enter the warning message."
                onUserInput={(input) => setWarningMessage(input)}
                onAction={() => handleUpdate('bannedWarning', warningMessage)}
                actionTitle="Update"
                actionVisible={true}
              />
            </div>
            <div>
              <Typography className="text-primary text-xl">{i18n._(t`Cancel Auction`)}</Typography>
              <Typography className="mt-2 text-secondary">
                {i18n._(t`The Auction can only be cancelled by the admin before the start date.`)}
              </Typography>
              <button
                className="w-[142px] px-5 py-2 mt-8 bg-gradient-to-r rounded-lg from-blue to-pink text-high-emphesis"
                onClick={handleCancelAuction}
              >
                <Typography className="text-high-emphesis text-base">{i18n._(t`Cancel`)}</Typography>
              </button>
            </div>
          </div>
        )}
        {pageIndex === 3 && (
          <div>
            <div className="mt-4">
              <Input
                label="Liquidity Receiving Address"
                value={liquidityReceiver}
                type="text"
                placeholder=""
                onUserInput={(input) => setLiquidityReceiver(input)}
                onAction={() => handleUpdate}
                actionTitle="Update"
                actionVisible={true}
                hint={
                  <span className="text-secondary">
                    <b>{i18n._(t`Note`)}</b>:{' '}
                    {i18n._(t`The LP tokens will transferred to this wallet after lock up duration is over.`)}
                  </span>
                }
              />
            </div>

            <div className="mt-4">
              <Input
                label="Cancel Liquidity Launcher"
                type="hidden"
                onAction={handleCancelLiquidityLauncher}
                actionTitle="Cancel"
                actionVisible={true}
                description="The liquidity launcher can only be cancelled by the admin before auction finishes.\nPlease use the section below to withdraw the tokens from the liquidity launcher before cancelling it."
              />
            </div>

            <div className="mt-4">
              <Input
                label="Withdrawl Deposits in Launcher"
                type="hidden"
                actionVisible={false}
                description="The admin will be able to withdraw the remaining deposits in liquidity launcher when the auction is finalized or when the liquidity launcher is canceled."
              />
              <Typography weight={700} className="text-secondary text-base">
                {i18n._(t`Liquidity Launcher Balance`)}
              </Typography>
              <div className="flex items-center">
                <div className="flex-1 flex space-x-5">
                  <Typography className="inline-block text-primary text-sm rounded bg-blue bg-opacity-50 px-3 py-0.5">
                    {i18n._(`${numberWithCommas(ethAmount)} ${ethCurrency}`)}
                  </Typography>
                  <Typography className="">{i18n._(t`+`)}</Typography>
                  <Typography className="inline-block text-primary text-sm rounded bg-blue bg-opacity-50 px-3 py-0.5">
                    {i18n._(`${numberWithCommas(tokenAmount)} ${tokenCurrency}`)}
                  </Typography>
                </div>
                <div className="w-[200px]">
                  <button
                    className="w-[142px] px-5 py-2 bg-gradient-to-r rounded-lg from-blue to-pink text-high-emphesis"
                    onClick={handleWithdrawLiquidity}
                  >
                    <Typography className="text-high-emphesis text-base">{i18n._(t`Withdrawl`)}</Typography>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const EditAuctionLayout = ({ children }) => {
  const [pageIndex, movePage] = useState(0)

  return (
    <Layout
      navs={[
        { link: '/miso', name: 'MISO Factory' },
        { link: '/miso/edit-auction', name: 'Cabbage Auction 0x89112...3b50' },
        { link: '/miso/edit-auction', name: 'Edit Auction' },
      ]}
      title={{
        heading: 'Edit Auction',
        content:
          'Only the Auction admin and approved operators for this auction are able to edit any of the details below.\nDo not waste your gas.',
      }}
      tabs={[
        { heading: 'Project Details', content: '' },
        { heading: 'Icon & Banners', content: '' },
        { heading: 'Auction Settings', content: '' },
        { heading: 'Liquidity Launcher Settings', content: '' },
      ]}
      active={pageIndex}
      onTabChange={(index) => movePage(index)}
      tabType="simple"
    >
      {childrenWithProps(children, { pageIndex, movePage })}
    </Layout>
  )
}
EditAuction.Layout = EditAuctionLayout

export default EditAuction
