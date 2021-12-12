import { DocumentTextIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Chip from 'app/components/Chip'
import CurrencyLogo from 'app/components/CurrencyLogo'
import { DiscordIcon, GithubIcon, MediumIcon, TokenomicsIcon, TwitterIcon } from 'app/components/Icon'
import NumericalInput from 'app/components/Input/Numeric'
import Typography from 'app/components/Typography'
import AuctionCardTimer from 'app/features/miso/AuctionCard/AuctionCardTimer'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import { useMisoAuction } from 'app/features/miso/context/hooks/useMisoAuctions'
import { AuctionTitleByTemplateId } from 'app/features/miso/context/utils'
import { classNames } from 'app/functions'
import MisoLayout from 'app/layouts/Miso'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const MisoAuction = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const router = useRouter()
  const { auction: address } = router.query
  const auction = useMisoAuction(address as string)
  const balance = useCurrencyBalance(account ?? undefined, auction?.paymentToken)
  const [value, setValue] = useState()
  const tabs = [i18n._(t`Auction Details`), i18n._(t`About Project`), i18n._(t`Bids `)]
  const [tab, setTab] = useState(tabs[0])

  if (!auction) return <></>

  return (
    <>
      <section className="flex my-12 flex-col gap-10 px-6 w-full">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <Typography weight={700} className="text-secondary">
              {auction?.auctionToken.symbol}
            </Typography>
            <Typography variant="h2" weight={700} className="text-high-emphesis">
              {auction?.auctionToken.name}
            </Typography>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <Typography weight={700} variant="sm" className="text-secondary">
                Current Token Price
              </Typography>
              <Typography variant="h2" weight={700} className="text-high-emphesis text-right">
                {auction?.currentPrice?.toSignificant(6)} {auction?.currentPrice?.quoteCurrency.symbol}
              </Typography>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6">
        <div className="grid grid-cols-12">
          <div className="col-span-4">
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-center">
                <Chip label="DeFi" color="blue" />
                <div className="flex gap-1.5">
                  <AuctionIcon auctionTemplate={auction.template} width={18} />
                  <Typography variant="sm" weight={700} className="text-secondary">
                    {AuctionTitleByTemplateId(i18n)[auction.template]}
                  </Typography>
                </div>

                <Typography variant="sm" weight={700} className="text-secondary">
                  {i18n._(t`Restricted`)}
                </Typography>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="sm" weight={700} className="text-low-emphesis">
                  {i18n._(t`Technical Information`)}
                </Typography>
                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <DocumentTextIcon width={20} />
                    <Typography variant="sm" weight={700} className="underline text-high-emphesis">
                      {i18n._(t`Whitepaper`)}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <TokenomicsIcon width={18} />
                    <Typography variant="sm" weight={700} className="underline text-high-emphesis">
                      {i18n._(t`Tokenomics`)}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="sm" weight={700} className="text-low-emphesis">
                  {i18n._(t`Social`)}
                </Typography>
                <div className="flex gap-5">
                  <GithubIcon width={20} />
                  <TwitterIcon width={20} />
                  <MediumIcon width={20} />
                  <DiscordIcon width={20} />
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-12 gap-3">
              <div className="flex justify-between items-baseline">
                <Typography weight={700} className="text-high-emphesis">
                  {i18n._(t`Participate`)}
                </Typography>
                <Typography variant="sm" weight={700} className="text-low-emphesis">
                  Balance: {balance?.toSignificant(6)} {balance?.currency.symbol}
                </Typography>
              </div>
              <div className="flex rounded bg-dark-900 px-4 py-2.5 gap-4 items-center">
                <CurrencyLogo currency={auction?.paymentToken} size={42} className="rounded-full" />
                <div className="flex items-baseline gap-2 flex-grow">
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    {auction?.paymentToken.symbol}
                  </Typography>
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    <NumericalInput
                      disabled={false}
                      value={value || ''}
                      onUserInput={(val) => setValue(val)}
                      placeholder="0.00"
                      className="bg-transparent text-inherit"
                      autoFocus
                    />
                  </Typography>
                </div>
                <div
                  onClick={() => {}}
                  className="cursor-pointer flex flex-col items-center justify-center rounded-full overflow-hidden bg-pink bg-opacity-20 border border-red text-pink px-3 h-9"
                >
                  <Typography>{i18n._(t`MAX`)}</Typography>
                </div>
              </div>
              <Button className="h-[74px] bg-gradient-to-r from-pink-red to-pink transition-all hover:scale-[1.02] !opacity-100">
                <div className="flex flex-col">
                  <Typography className="text-white" weight={700}>
                    {i18n._(t`Commit`)}
                  </Typography>
                  <AuctionCardTimer auction={auction} />
                </div>
              </Button>
            </div>
          </div>
          <div className="col-span-8"></div>
        </div>
      </section>
      <section className="px-6 mt-14">
        <div className="flex flex-col border-b border-dark-800">
          <div
            className="flex flex-row space-x-8 overflow-x-auto overflow-y-hidden whitespace-nowrap"
            aria-label="Tabs"
          >
            {[i18n._(t`Auction Details`), i18n._(t`About Project`), i18n._(t`Bids `)].map((_tab) => (
              <div key={_tab} onClick={() => setTab(_tab)} className="space-y-2 cursor-pointer h-full">
                <div
                  className={classNames(
                    _tab === tab ? 'text-high-emphesis' : '',
                    'capitalize font-bold text-sm text-secondary'
                  )}
                >
                  {_tab}
                </div>
                <div
                  className={classNames(
                    _tab === tab ? 'relative bg-gradient-to-r from-blue to-pink h-[3px] w-full' : ''
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

MisoAuction.Layout = MisoLayout

export default MisoAuction
