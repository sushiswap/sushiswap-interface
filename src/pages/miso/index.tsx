import { t } from '@lingui/macro'
import { useLingui, Trans } from '@lingui/react'
import Head from 'next/head'

import Image from '../../components/Image'
import NavLink from '../../components/NavLink'
import Typography from '../../components/Typography'
import Layout from '../../layouts/Miso'

import createTokenImage from '../../../public/images/miso/launchpad/miso-create-token.svg'
import setupAuctionImage from '../../../public/images/miso/launchpad/miso-setup-auction.svg'
import createPermissionListImage from '../../../public/images/miso/launchpad/miso-create-permission-list.svg'
import setupLiquidityLauncherImage from '../../../public/images/miso/launchpad/miso-setup-liquidity-launcher.svg'
import loadingIndicator from '../../../public/images/miso/launchpad/miso-loading.svg'

function Launchpad() {
  const { i18n } = useLingui()
  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div>
        <Typography variant="lg" weight={700}>
          {i18n._(t`Factory Options`)}
        </Typography>
        <div className="mt-3 grid grid-cols-4 gap-5">
          <div className="cursor-pointer">
            <NavLink href="/miso/create-token">
              <div>
                <Image src={createTokenImage} layout="responsive" alt="Create Token" />
              </div>
            </NavLink>
          </div>
          <div className="cursor-pointer">
            <NavLink href="/miso/create-auction">
              <div>
                <Image src={setupAuctionImage} layout="responsive" alt="Setup Auction" />
              </div>
            </NavLink>
          </div>
          <div className="cursor-pointer">
            <NavLink href="/miso/permission-list">
              <div>
                <Image src={createPermissionListImage} layout="responsive" alt="Create Permission List" />
              </div>
            </NavLink>
          </div>
          <div className="cursor-pointer">
            <NavLink href="/miso/liquidity-launcher">
              <div>
                <Image src={setupLiquidityLauncherImage} layout="responsive" alt="Setup Liquidity Launcher" />
              </div>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-end justify-between">
          <Typography variant="lg" weight={700}>
            {i18n._(t`Your Auctions:`)}
          </Typography>
          <NavLink href="/miso/create-auction">
            <Typography variant="sm" className="text-blue">
              {i18n._(t`Set Up Auction`)}
            </Typography>
          </NavLink>
        </div>
        <div className="mt-3 bg-dark-900 rounded">
          <div className="text-center py-10">
            <div className="w-6 m-auto">
              <Image src={loadingIndicator} layout="responsive" alt="loading..." />
            </div>
            <Typography className="mt-2">{i18n._(t`No auctions found.`)}</Typography>
            <div className="flex flex-row justify-center">
              <Typography>{i18n._(t`Please start by`)}</Typography>
              <NavLink href="/miso/create-auction">
                <Typography className="text-blue ml-1">{i18n._(t`setting up a new auction`)}</Typography>
              </NavLink>
              .
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-end justify-between">
          <Typography variant="lg" weight={700}>
            {i18n._(t`Your Tokens:`)}
          </Typography>
          <NavLink href="/miso/create-token">
            <Typography variant="sm" className="text-blue">
              {i18n._(t`Create Token`)}
            </Typography>
          </NavLink>
        </div>
        <div className="mt-3 bg-dark-900 rounded">
          <div className="text-center py-10">
            <div className="w-6 m-auto">
              <Image src={loadingIndicator} layout="responsive" alt="loading..." />
            </div>
            <Typography className="mt-2">{i18n._(t`No tokens found.`)}</Typography>
            <div className="flex flex-row justify-center">
              <Typography>{i18n._(t`Please start by`)}</Typography>
              <NavLink href="/miso/create-token">
                <Typography className="text-blue ml-1">{i18n._(t`creating a new token`)}</Typography>
              </NavLink>
              .
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const LaunchpadLayout = ({ children }) => {
  const { i18n } = useLingui()

  return (
    <Layout
      navs={[{ link: '/miso', name: 'MISO Launchpad' }]}
      title={{
        heading: i18n._(t`MISO Launchpad`),
        content: i18n._(
          t`Get Started by importing an exisiting pool or create a new pool. You can find the TVLs and your pool shares of your liquidity pools as well as adding and removing liquidity.`
        ),
      }}
    >
      {children}
    </Layout>
  )
}
Launchpad.Layout = LaunchpadLayout

export default Launchpad
