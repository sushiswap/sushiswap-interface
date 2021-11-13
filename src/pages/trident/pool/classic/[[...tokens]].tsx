import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Button from 'app/components/Button'
import { TridentTransactions } from 'app/features/transactions/Transactions'
import { BREADCRUMBS } from 'app/features/trident/Breadcrumb'
import { poolAtom } from 'app/features/trident/context/atoms'
import ClassicLinkButtons from 'app/features/trident/pool/classic/ClassicLinkButtons'
import ClassicMarket from 'app/features/trident/pool/classic/ClassicMarket'
import ClassicMyPosition from 'app/features/trident/pool/classic/ClassicMyPosition'
import Header from 'app/features/trident/pool/Header'
import PoolStats from 'app/features/trident/pool/PoolStats'
import PoolStatsChart from 'app/features/trident/pool/PoolStatsChart'
import TridentRecoilRoot from 'app/features/trident/TridentRecoilRoot'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React from 'react'
import { useRecoilValue } from 'recoil'

const Pool = () => {
  const { i18n } = useLingui()
  const linkButtons = <ClassicLinkButtons />
  const { pool } = useRecoilValue(poolAtom)

  return (
    <>
      <TridentHeader pattern="bg-chevron-pattern" condensed>
        <div className="flex flex-col gap-3 lg:w-8/12 lg:gap-5 lg:pr-6">
          <div>
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="rounded-full !pl-2 !py-1"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={'/trident/pools'}>{i18n._(t`Pools`)}</Link>
            </Button>
          </div>
          <div className="mb-5 order-0">
            <Header />
          </div>
          <div className="order-1 lg:order-3 lg:hidden">{linkButtons}</div>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-col w-full gap-10 mt-px mb-5 lg:flex-row">
          <div className="flex flex-col gap-5 lg:w-8/12 lg:gap-10">
            <div className="order-5 lg:order-1">
              <PoolStatsChart />
            </div>
            <div className="order-6 lg:order-2">
              <PoolStats />
            </div>
            <div className="order-2 lg:order-3">
              <ClassicMarket />
            </div>
            {/*<div className="order-2 lg:order-4">*/}
            {/*  <Rewards />*/}
            {/*</div>*/}
          </div>
          <div className="lg:w-4/12">
            <div className="sticky flex flex-col gap-5 top-5 lg:-mt-52">
              <div className="order-0">
                <ClassicMyPosition />
              </div>
              {/*<div className="order-1">*/}
              {/*  <ClassicMyRewards />*/}
              {/*</div>*/}
              <div className="order-2 hidden lg:block">{linkButtons}</div>
            </div>
          </div>
        </div>
        <TridentTransactions poolAddress={pool?.liquidityToken.address} />
      </TridentBody>
    </>
  )
}

Pool.Provider = (props) => <TridentRecoilRoot poolType={PoolType.ConstantProduct} {...props} />
Pool.Layout = (props) => <TridentLayout {...props} breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic']]} />

export default Pool
