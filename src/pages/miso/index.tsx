import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Head from 'next/head'
import Lottie from 'lottie-react'

import loadingCircle from '../../animation/loading-circle.json'
import Image from '../../components/Image'
import NavLink from '../../components/NavLink'
import Layout from '../../layouts/Miso'
import createTokenImage from '../../../public/images/miso/launchpad/miso-create-token.svg'
import setupAuctionImage from '../../../public/images/miso/launchpad/miso-setup-auction.svg'
import createPermissionListImage from '../../../public/images/miso/launchpad/miso-create-permission-list.svg'
import setupLiquidityLauncherImage from '../../../public/images/miso/launchpad/miso-setup-liquidity-launcher.svg'

function Launchpad() {
  const { i18n } = useLingui()
  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div>
        <div className="font-bold text-lg">{i18n._(t`Factory Options`)}</div>
        <div className="mt-3 grid grid-cols-4 gap-5">
          <div className="cursor-pointer">
            <NavLink href="/miso/create-token">
              <Image src={createTokenImage} layout="responsive" alt="Create Token" />
            </NavLink>
          </div>
          <div className="cursor-pointer">
            <NavLink href="/miso/create-auction">
              <Image src={setupAuctionImage} layout="responsive" alt="Setup Auction" />
            </NavLink>
          </div>
          <div className="cursor-pointer">
            <NavLink href="/miso/permission-list">
              <Image src={createPermissionListImage} layout="responsive" alt="Create Permission List" />
            </NavLink>
          </div>
          <div className="cursor-pointer">
            <NavLink href="/miso/liquidity-launcher">
              <Image src={setupLiquidityLauncherImage} layout="responsive" alt="Setup Liquidity Launcher" />
            </NavLink>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex justify-between">
          <span className="font-bold text-lg">{i18n._(t`Your Auctions:`)}</span>
          <a className="text-blue text-sm cursor-pointer">{i18n._(t`Set Up Auction`)}</a>
        </div>
        <div className="mt-3 bg-[#161522] rounded">
          <div className="text-center py-10">
            <div className="w-8 m-auto">
              <Lottie animationData={loadingCircle} autoplay loop />
            </div>
            <div>{i18n._(t`No auctions found.`)}</div>
            <div>{i18n._(t`Please start by setting up a new auction.`)}</div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex justify-between">
          <span className="font-bold text-lg">{i18n._(t`Your Tokens:`)}</span>
          <NavLink href="/miso/create-token">
            <a className="text-blue text-sm cursor-pointer">{i18n._(t`Create Token`)}</a>
          </NavLink>
        </div>
        <div className="mt-3 bg-[#161522] rounded">
          <div className="text-center py-10">
            <div className="w-8 m-auto">
              <Lottie animationData={loadingCircle} autoplay loop />
            </div>
            <div>{i18n._(t`No tokens found.`)}</div>
            <div>{i18n._(t`Please start by creating a new token.`)}</div>
          </div>
        </div>
      </div>
    </>
  )
}

const LaunchpadLayout = ({ children }) => {
  return (
    <Layout
      navs={[{ link: '/miso', name: 'MISO Launchpad' }]}
      title={{
        heading: 'MISO Launchpad',
        content:
          'Get Started by importing an exisiting pool or create a new pool. You can find the TVLs and your pool shares of your liquidity pools as well as adding and removing liquidity.',
      }}
    >
      {children}
    </Layout>
  )
}
Launchpad.Layout = LaunchpadLayout

export default Launchpad
