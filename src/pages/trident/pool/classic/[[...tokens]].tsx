import TridentLayout, { TridentBody, TridentHeader } from '../../../../layouts/Trident'
import PoolStats from '../../../../features/trident/pool/PoolStats'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'
import ClassicMarket from '../../../../features/trident/pool/classic/ClassicMarket'
import Header from '../../../../features/trident/pool/Header'
import { RecoilRoot, useRecoilValue } from 'recoil'
import ClassicMyRewards from '../../../../features/trident/pool/classic/ClassicMyRewards'
import ClassicMyPosition from '../../../../features/trident/pool/classic/ClassicMyPosition'
import ClassicLinkButtons from '../../../../features/trident/pool/classic/ClassicLinkButtons'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import Button from '../../../../components/Button'
import { useLingui } from '@lingui/react'
import Rewards from '../../../../features/trident/pool/Rewards'
import { BREADCRUMBS } from '../../../../features/trident/Breadcrumb'
import useInitClassicPoolState from '../../../../features/trident/context/hooks/useInitClassicPoolState'
import { TridentTransactions } from '../../../../features/transactions/Transactions'
import { poolAtom } from '../../../../features/trident/context/atoms'

const Pool = () => {
  useInitClassicPoolState()
  const { i18n } = useLingui()
  const linkButtons = <ClassicLinkButtons />
  const [, pool] = useRecoilValue(poolAtom)

  return (
    <>
      <TridentHeader pattern="bg-chevron-pattern" condensed>
        <div className="lg:w-8/12 flex flex-col lg:gap-5 gap-3 lg:pr-6">
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
          <div className="order-0 mb-5">
            <Header />
          </div>
          <div className="order-1 lg:order-3 lg:hidden">{linkButtons}</div>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-col lg:flex-row w-full mt-px mb-5 gap-10">
          <div className="lg:w-8/12 flex flex-col lg:gap-10 gap-5">
            <div className="order-5 lg:order-1">
              <PoolStatsChart />
            </div>
            <div className="order-6 lg:order-2">
              <PoolStats />
            </div>
            <div className="order-2 lg:order-3">
              <ClassicMarket />
            </div>
            <div className="order-2 lg:order-4">
              <Rewards />
            </div>
          </div>
          <div className="lg:w-4/12">
            <div className="flex flex-col gap-5 sticky top-5 lg:-mt-52">
              <div className="order-0">
                <ClassicMyPosition />
              </div>
              <div className="order-1">
                <ClassicMyRewards />
              </div>
              <div className="order-2 lg:block hidden">{linkButtons}</div>
            </div>
          </div>
        </div>
        <TridentTransactions poolAddress={pool?.liquidityToken.address} />
      </TridentBody>
    </>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = (props) => <TridentLayout {...props} breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic']]} />

export default Pool
