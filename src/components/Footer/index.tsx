import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, InstagramIcon, MediumIcon, TwitterIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import Container from '../Container'

const Footer = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  return (
    <div className="z-10 w-full px-6 py-20 mt-20">
      <Container maxWidth="7xl" className="mx-auto">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-start gap-2">
              <div className="">
                <Image src="https://app.sushi.com/images/logo.svg" alt="Sushi logo" width="28px" height="28px" />
              </div>
              <Typography variant="h2" weight={700} className="tracking-[0.02em] scale-y-90 hover:text-high-emphesis">
                Sushi
              </Typography>
            </div>
            <Typography variant="sm" className="text-low-emphesis">
              {i18n._(t`Our community is building a comprehensive decentralized trading platform for the future of finance. Join
              us!`)}
            </Typography>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/sushiswap" target="_blank" rel="noreferrer">
                <TwitterIcon width={16} className="text-low-emphesis" />
              </a>
              <a href="https://instagram.com/instasushiswap" target="_blank" rel="noreferrer">
                <InstagramIcon width={16} className="text-low-emphesis" />
              </a>
              <a href="https://medium.com/sushiswap-org" target="_blank" rel="noreferrer">
                <MediumIcon width={16} className="text-low-emphesis" />
              </a>
              <a href="https://discord.gg/NVPXN4e" target="_blank" rel="noreferrer">
                <DiscordIcon width={16} className="text-low-emphesis" />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <Typography variant="lg" weight={700} className="my-2.5 hover:text-high-emphesis">
              {i18n._(t`Products`)}
            </Typography>
            <Link
              href={featureEnabled(Feature.TRIDENT, chainId || 1) ? '/trident/pools' : '/legacy/pools'}
              passHref={true}
            >
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Liquidity Pools`)}
              </Typography>
            </Link>
            <Link href="/lend" passHref={true}>
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Lending`)}
              </Typography>
            </Link>
            <Link href="/miso" passHref={true}>
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Launchpad`)}
              </Typography>
            </Link>
            <a href="https://shoyunft.com" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Shoyu NFT`)}
              </Typography>
            </a>
            <Link href="/tools" passHref={true}>
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Tools`)}
              </Typography>
            </Link>
          </div>
          <div className="flex flex-col gap-1 md:text-right lg:text-right">
            <Typography variant="lg" weight={700} className="my-2.5 hover:text-high-emphesis">
              {i18n._(t`Help`)}
            </Typography>
            <a href="https://docs.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`What is Sushi?`)}
              </Typography>
            </a>
            <a href="https://discord.gg/NVPXN4e" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Ask on Discord`)}
              </Typography>
            </a>
            <a href="https://twitter.com/sushiswap" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Ask on Twitter`)}
              </Typography>
            </a>
            <a href="https://forum.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Ask on Forum`)}
              </Typography>
            </a>
          </div>
          <div className="flex flex-col gap-1 text-right sm:text-right md:text-left lg:text-right">
            <Typography variant="lg" weight={700} className="my-2.5 hover:text-high-emphesis">
              {i18n._(t`Developers`)}
            </Typography>
            <a href="https://docs.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`GitBook`)}
              </Typography>
            </a>
            <a href="https://github.com/sushiswap" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`GitHub`)}
              </Typography>
            </a>
            <a href="https://dev.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Development`)}
              </Typography>
            </a>
            <a href="https://docs.openmev.org" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Sushi Relay`)}
              </Typography>
            </a>
          </div>
          <div className="flex flex-col gap-1 md:text-right lg:text-right">
            <Typography variant="lg" weight={700} className="my-2.5 hover:text-high-emphesis">
              {i18n._(t`Governance`)}
            </Typography>
            <a href="https://forum.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Forum & Proposals`)}
              </Typography>
            </a>
            <a href="https://snapshot.org/#/sushigov.eth" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Vote`)}
              </Typography>
            </a>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <Typography variant="lg" weight={700} className="my-2.5 hover:text-high-emphesis">
              {i18n._(t`Protocol`)}
            </Typography>
            <a
              href="https://docs.google.com/document/d/19bL55ZTjKtxlom2CpVo6K8jL1e-OZ13y6y9AQgw_qT4"
              target="_blank"
              rel="noreferrer"
            >
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Apply for Onsen`)}
              </Typography>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSecahmrXOJytn-wOUB8tEfONzOTP4zjKqz3sIzNzDDs9J8zcA/viewform"
              target="_blank"
              rel="noreferrer"
            >
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Apply for Miso`)}
              </Typography>
            </a>

            <Link href="/vesting" passHref={true}>
              <Typography variant="sm" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Vesting`)}
              </Typography>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Footer
