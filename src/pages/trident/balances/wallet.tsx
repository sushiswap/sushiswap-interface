import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import Typography from 'app/components/Typography'
import { ActionsAsideWallet } from 'app/features/trident/balances/ActionsAside'
import { WalletActionsModal } from 'app/features/trident/balances/ActionsModal'
import { WalletBalances } from 'app/features/trident/balances/AssetBalances'
import BalancesSideBar from 'app/features/trident/balances/BalancesSideBar'
import { WalletBalancesSum } from 'app/features/trident/balances/BalancesSum'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import { BREADCRUMBS } from 'app/features/trident/Breadcrumb'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const Wallet = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex justify-center flex-grow">
      <div className="flex w-full">
        <BalancesSideBar />
        <div className="w-full">
          <TridentHeader pattern="bg-binary-pattern" condensed className="!pt-5 lg:!pt-10 z-[2]">
            <div className="lg:max-w-[calc(100%-360px)]">
              <HeaderDropdown label={i18n._(t`My Wallet`)} />
              <div className="mb-[-52px] lg:mb-[-70px] lg:mt-4">
                <WalletBalancesSum />
              </div>
            </div>
          </TridentHeader>
          <TridentBody className="!pt-14">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-10 w-full lg:max-w-[calc(100%-360px)] overflow-auto">
                <div className="block lg:hidden">
                  <Card.Gradient>
                    <div className="flex flex-col p-4 border rounded border-dark-900">
                      <Typography variant="sm" className="text-center text-high-emphesis">
                        {i18n._(t`Tap any asset row to view available actions.`)}
                      </Typography>
                    </div>
                  </Card.Gradient>
                </div>
                <div className="px-2 lg:mt-7 lg:px-0">
                  <WalletBalances />
                  <WalletActionsModal />
                </div>
              </div>
              <div className="flex flex-col hidden -mt-40 lg:block lg:w-[304px]">
                <ActionsAsideWallet />
              </div>
            </div>
          </TridentBody>
        </div>
      </div>
    </div>
  )
}

Wallet.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[BREADCRUMBS['my_portfolio'], BREADCRUMBS['wallet']]} />
)
export default Wallet
