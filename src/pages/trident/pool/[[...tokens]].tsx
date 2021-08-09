import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { CurrencyLogoArray } from '../../../components/CurrencyLogo'
import Chip from '../../../components/Chip'
import PoolStats from '../../../features/trident/pool/PoolStats'
import PoolStatsChart from '../../../features/trident/pool/PoolStatsChart'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../hooks/useTridentPools'
import { POOL_TYPES } from '../../../features/trident/constants'
import ClassicMyDeposits from '../../../features/trident/pool/ClassicMyDeposits'
import ClassicMarket from '../../../features/trident/pool/ClassicMarket'
import { TridentPoolPageContextProvider } from '../../../features/trident/pool/context'
import { PoolType } from '../../../features/trident/pool/context/types'
import HybridPoolComposition from '../../../features/trident/pool/HybridPoolComposition'

const Pool = () => {
  const { i18n } = useLingui()
  const { query } = useRouter()
  const { tokens: tokenAddresses } = query
  const [pool, { toHref }] = useTridentPool(tokenAddresses)

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col">
        <div className="flex flex-col bg-dark-900">
          <div className="flex flex-row p-5 justify-between bg-dots-pattern">
            <div className="flex flex-col items-start gap-5">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="rounded-full py-1 pl-2"
                startIcon={<ChevronLeftIcon width={24} height={24} />}
              >
                <Link href={'/trident/pools'}>{i18n._(t`Pools`)}</Link>
              </Button>

              {/*spacer*/}
              <div className="h-2" />
            </div>
            <div className="flex flex-col text-right gap-2">
              <Typography variant="sm">{i18n._(t`APY (Annualized)`)}</Typography>
              <div className="flex flex-col">
                <Typography variant="h3" className="text-high-emphesis" weight={700}>
                  {pool.apy}
                </Typography>
                <Typography variant="xxs" className="text-secondary">
                  {i18n._(t`Including fees`)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 mt-[-32px] flex flex-col gap-2">
          <CurrencyLogoArray currencies={pool.tokens} size={64} />
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {pool.tokens.map((token) => token.symbol).join('-')}
          </Typography>
          <div className="flex flex-row gap-2 items-center">
            <Chip label={POOL_TYPES[pool.type].label} color={POOL_TYPES[pool.type].color} />
            <Typography weight={700} variant="sm">
              {pool.fee} {i18n._(t`Fees`)}
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 px-5 pt-6">
          <Button variant="outlined" color="gradient" className="text-high-emphesis">
            <Link href={`/trident/add/${toHref(pool)}`}>{i18n._(t`Add Liquidity`)}</Link>
          </Button>
          <Button variant="outlined" color="gradient" className="text-high-emphesis">
            {i18n._(t`Remove Liquidity`)}
          </Button>
          <Button variant="outlined" color="gray" className="w-full col-span-2 text-high-emphesis py-3" size="xs">
            {i18n._(t`View Analytics`)}
          </Button>
        </div>
      </div>

      {pool.type === PoolType.CLASSIC && (
        <>
          <ClassicMyDeposits />
          <ClassicMarket />
          <PoolStatsChart />
          <PoolStats />
        </>
      )}
      {pool.type === PoolType.HYBRID && (
        <>
          <HybridPoolComposition />
        </>
      )}
    </div>
  )
}

Pool.Provider = TridentPoolPageContextProvider
Pool.Layout = TridentLayout

export default Pool
