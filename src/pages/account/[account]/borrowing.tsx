import { KashiBorrowingList } from 'app/features/kashi/KashiBorrowingList'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'app/features/portfolio/useAccountInUrl'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { NextSeo } from 'next-seo'
import React from 'react'

const Lending = () => {
  const account = useAccountInUrl('/')

  if (!account) return <></>

  return (
    <>
      <NextSeo title={`Kashi borrow positions for account ${account}`} />

      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader>
      <TridentBody className="flex flex-col lg:flex-row">
        <KashiBorrowingList />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Lending.Layout = TridentLayout

export default Lending
