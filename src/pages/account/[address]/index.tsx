import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ActionsModal from 'app/features/account/ActionsModal'
import { BentoBalances, WalletBalances } from 'app/features/account/AssetBalances/bentoAndWallet'
import { KashiCollateral } from 'app/features/account/AssetBalances/kashi/KashiCollateral'
import { KashiLent } from 'app/features/account/AssetBalances/kashi/KashiLent'
import HeaderDropdown from 'app/features/account/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Head from 'next/head'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()
  return (
    <>
      <Head>
        <title>{i18n._(t`Portfolio`)} | Sushi</title>
        <meta
          key="description"
          name="description"
          content="Get a summary of all of the balances in your portfolio on Sushi."
        />
      </Head>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown />
      </TridentHeader>
      <TridentBody className="flex flex-col grid-cols-2 gap-10 lg:grid lg:gap-4">
        <WalletBalances />
        <BentoBalances />
        <KashiCollateral />
        <KashiLent />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio
