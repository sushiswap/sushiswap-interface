import ActionsModal from 'app/features/trident/balances/ActionsModal'
import { BentoBalances, WalletBalances } from 'app/features/trident/balances/AssetBalances'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const Balances = () => {
  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown />
      </TridentHeader>
      <TridentBody className="flex flex-col gap-10">
        <WalletBalances />
        <BentoBalances />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Balances.Layout = TridentLayout

export default Balances
