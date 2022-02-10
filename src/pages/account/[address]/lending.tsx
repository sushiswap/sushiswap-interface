import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ActionsModal from 'app/features/account/ActionsModal'
import HeaderDropdown from 'app/features/account/HeaderDropdown'
import { KashiLendingList } from 'app/features/kashi/KashiLendingList'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Head from 'next/head'
import React from 'react'

const Lending = () => {
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
      <TridentBody className="flex flex-col lg:flex-row">
        <KashiLendingList />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Lending.Layout = TridentLayout

export default Lending
