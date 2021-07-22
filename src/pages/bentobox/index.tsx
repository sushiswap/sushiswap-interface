import Card from '../../components/Card'
import Container from '../../components/Container'
import Head from 'next/head'
import Image from '../../components/Image'
import Link from 'next/link'
import NextImage from 'next/image'
import React from 'react'
import Web3Status from '../../components/Web3Status'
import bentoBoxHero from '../../../public/bentobox-hero.jpg'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

export default function BenotBox() {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  return (
    <Container
      id="bentobox-page"
      className="z-0 flex flex-col justify-center text-center y-4 md:py-8 lg:py-12"
      maxWidth="full"
    >
      <Head>
        <title>BentoBox | Sushi</title>
        <meta
          key="description"
          name="description"
          content="BentoBox is a token vault that generates yield for liquidity providers. BentoBox creates a source of liquidity that any user can access with minimal approvals, minimal gas usage, and maximal capital efficiency."
        />
      </Head>
      <div className="absolute top-0 left-0 right-0 z-0 w-full h-full" style={{ maxHeight: 700 }}>
        <Image
          src={bentoBoxHero}
          alt="BentoBox Hero"
          layout="responsive"
          objectFit="contain"
          objectPosition="top"
          className="opacity-50"
          priority
        />
      </div>

      <div className="flex justify-center">
        <Image
          src="/bentobox-logo.png"
          alt="BentoBox Logo"
          objectFit="scale-down"
          layout="responsive"
          height={150}
          width={240}
        />
      </div>

      <Container className="z-50 mx-auto" maxWidth="5xl">
        <div className="text-3xl font-bold md:text-5xl text-high-emphesis">{i18n._(t`BentoBox Apps`)}</div>
        <div className="p-4 mt-0 mb-8 text-base font-medium md:text-lg lg:text-xltext-high-emphesis md:mt-4">
          {i18n._(t`BentoBox is an innovative way to use dapps gas-efficiently and gain extra yield.`)}
        </div>
        <div className="grid grid-cols-4 gap-4 sm:gap-12 grid-flow-auto">
          <Card className="flex items-center justify-center w-full col-span-2 space-y-1 rounded cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-pink-glow hover:shadow-pink-glow-hovered">
            <Image
              src="/kashi-neon.png"
              alt="Kashi Logo"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
            {account ? (
              <Link href="/borrow">
                <a className="w-full px-4 py-2 text-center bg-transparent border border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-900">
                  {i18n._(t`Enter`)}
                </a>
              </Link>
            ) : (
              <Web3Status />
            )}
          </Card>
          <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-blue-glow hover:shadow-blue-glow-hovered">
            <Image
              src="/coming-soon.png"
              alt="Coming Soon"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
          </Card>
          <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-pink-glow hover:shadow-pink-glow-hovered">
            <Image
              src="/coming-soon.png"
              alt="Coming Soon"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
          </Card>
          <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-blue-glow hover:shadow-blue-glow-hovered">
            <Image
              src="/coming-soon.png"
              alt="Coming Soon"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
          </Card>
        </div>
      </Container>
    </Container>
  )
}
