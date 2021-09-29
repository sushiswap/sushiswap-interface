import TridentLayout from '../../../../layouts/Trident'
import PoolStats from '../../../../features/trident/pool/PoolStats'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'
import ClassicMarket from '../../../../features/trident/pool/classic/ClassicMarket'
import Header from '../../../../features/trident/pool/Header'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { useCurrency } from '../../../../hooks/Tokens'
import { useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { useRouter } from 'next/router'
import { useActiveWeb3React } from '../../../../hooks'
import { poolAtom, poolBalanceAtom, totalSupplyAtom } from '../../../../features/trident/context/atoms'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useEffect } from 'react'
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

const Pool = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()

  const setPool = useSetRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
  const classicPool = useTridentClassicPool(currencyA, currencyB, 30, true)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)

  useEffect(() => {
    if (!classicPool[1]) return
    setPool(classicPool)
  }, [chainId, classicPool, setPool])

  useEffect(() => {
    if (!totalSupply) return
    setTotalSupply(totalSupply)
  }, [setTotalSupply, totalSupply])

  useEffect(() => {
    if (!poolBalance) return
    setPoolBalance(poolBalance)
  }, [poolBalance, setPoolBalance])

  const linkButtons = <ClassicLinkButtons />

  return (
    <>
      <div>
        <Button
          color="blue"
          variant="outlined"
          size="sm"
          className="rounded-full py-1 pl-2"
          startIcon={<ChevronLeftIcon width={24} height={24} />}
        >
          <Link href={'/trident/pools'}>{i18n._(t`Pools`)}</Link>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row w-full mt-px mb-5 gap-10">
        <div className="lg:w-8/12 flex flex-col lg:gap-10">
          <div className="order-0 mb-5">
            <Header />
          </div>
          <div className="order-1 lg:order-3 lg:hidden">{linkButtons}</div>
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
          <div className="flex flex-col gap-5 sticky top-5">
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
    </>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = (props) => (
  <TridentLayout
    {...props}
    headerBg="bg-dots-pattern"
    headerHeight="h-[220px]"
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic']]}
  />
)

export default Pool
