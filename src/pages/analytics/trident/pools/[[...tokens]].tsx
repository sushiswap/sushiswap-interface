import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { Feature } from 'app/enums'
import { TridentTransactions } from 'app/features/transactions/Transactions'
import ClassicLinkButtons from 'app/features/trident/pool/ClassicLinkButtons'
import ClassicMarket from 'app/features/trident/pool/ClassicMarket'
import ClassicTokenPrices from 'app/features/trident/pool/ClassicTokenPrices'
import Header from 'app/features/trident/pool/Header'
import PoolStats from 'app/features/trident/pool/PoolStats'
import PoolStatsChart from 'app/features/trident/pool/PoolStatsChart'
import PoolContext, { usePoolContext } from 'app/features/trident/PoolContext'
import NetworkGuard from 'app/guards/Network'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

const Pool = () => {
  const { i18n } = useLingui()
  const _linkButtons = <ClassicLinkButtons />
  const _header = (
    <>
      <div className="mb-5 order-0">
        <Header />
      </div>
      <div className="order-1 lg:order-3 lg:hidden">{_linkButtons}</div>
    </>
  )

  const { poolWithState } = usePoolContext()

  console.log('POOL ADDRESS:', poolWithState?.pool?.liquidityToken.address)

  return (
    <>
      <NextSeo
        title={`Pool ${poolWithState?.pool?.token0?.symbol}/${poolWithState?.pool?.token1?.symbol} Fee ${
          Number(poolWithState?.pool?.fee) / 10000
        } Twap ${poolWithState?.pool?.twap ? 'Enabled' : 'Disabled'}`}
      />
      <TridentHeader pattern="bg-chevron" condensed className="lg:py-[22px]">
        <div className="flex flex-col gap-3 lg:w-8/12 lg:gap-5 lg:pr-6 h-[68px] lg:h-auto">
          <div>
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="rounded-full !pl-2 !py-1.5"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={'/analytics/trident'}>{i18n._(t`Trident Analytics`)}</Link>
            </Button>
          </div>
          <div className="hidden lg:block">{_header}</div>
        </div>
      </TridentHeader>

      <TridentBody className="lg:pt-[26px]">
        <div className="block lg:hidden mt-[-54px] lg:mt-0">{_header}</div>
        <ClassicTokenPrices />
        <PoolStatsChart />
        <PoolStats />
        <ClassicMarket />
        <TridentTransactions poolAddress={poolWithState?.pool?.liquidityToken.address} />
      </TridentBody>
    </>
  )
}

Pool.Guard = NetworkGuard(Feature.TRIDENT)
Pool.Provider = PoolContext
Pool.Layout = TridentLayout

export default Pool
