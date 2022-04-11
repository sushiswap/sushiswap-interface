import { KashiBorrowingList } from 'app/features/kashi/KashiBorrowingList'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

const Lending = () => {
  const router = useRouter()

  const account = router.query.account as string
  const chainId = router.query.account ? Number(router.query.chainId) : undefined

  if (!account || !chainId) return null

  return (
    <>
      <NextSeo title={`Kashi borrow positions for account ${account}`} />

      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} chainId={chainId} />
      </TridentHeader>
      <TridentBody className="flex flex-col lg:flex-row">
        {/* Need to pass down account and chainId */}
        <KashiBorrowingList />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Lending.Layout = TridentLayout

export default Lending
