import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import { BentoBalances, WalletBalances } from 'app/features/portfolio/AssetBalances/bentoAndWallet'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'app/features/portfolio/useAccountInUrl'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Head from 'next/head'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()

  const account = useAccountInUrl('/portfolio')
  if (!account) return

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
        <HeaderDropdown account={account} />
      </TridentHeader>
      <TridentBody className="flex flex-col grid-cols-2 gap-10 lg:grid lg:gap-4">
        {/*<KashiLent account={account} />*/}
        {/*<KashiCollateral account={account} />*/}
        <WalletBalances account={account} />
        <BentoBalances account={account} />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio
