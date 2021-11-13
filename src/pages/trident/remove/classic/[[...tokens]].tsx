import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { BREADCRUMBS } from 'app/features/trident/Breadcrumb'
import { liquidityModeAtom, poolAtom } from 'app/features/trident/context/atoms'
import useCurrenciesFromURL from 'app/features/trident/context/hooks/useCurrenciesFromURL'
import ClassicStandardAside from 'app/features/trident/remove/classic/ClassicStandardAside'
import ClassicStandardMode from 'app/features/trident/remove/classic/ClassicStandardMode'
import ClassicUnzapMode from 'app/features/trident/remove/classic/ClassicUnzapMode'
import ClassicZapAside from 'app/features/trident/remove/classic/ClassicZapAside'
import RemoveTransactionReviewStandardModal from 'app/features/trident/remove/classic/RemoveTransactionReviewStandardModal'
import RemoveTransactionReviewZapModal from 'app/features/trident/remove/classic/RemoveTransactionReviewZapModal'
import TridentRecoilRoot from 'app/features/trident/TridentRecoilRoot'
import { LiquidityMode } from 'app/features/trident/types'
import WithdrawalSubmittedModal from 'app/features/trident/WithdrawalSubmittedModal'
import { ConstantProductPoolState, useTridentClassicPool } from 'app/hooks/useTridentClassicPools'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React from 'react'
import { useRecoilValue } from 'recoil'

const RemoveClassic = () => {
  const { i18n } = useLingui()
  const { currencies, fee, twap } = useCurrenciesFromURL()
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const { pool } = useRecoilValue(poolAtom)
  const classicPool = useTridentClassicPool(currencies[0], currencies[1], fee, twap)

  return (
    <>
      <TridentHeader pattern="bg-bars-pattern" className="pb-10">
        <div className="relative flex flex-col w-full gap-5 mt-px lg:justify-between lg:w-7/12">
          <div>
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="!pl-2 !py-1 rounded-full"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link
                href={
                  currencies?.[0] && currencies?.[1]
                    ? `/trident/pool/classic/${currencies?.[0]?.symbol}/${currencies?.[1]?.symbol}`
                    : '/trident/pools'
                }
              >
                {pool ? `${currencies?.[0]?.symbol}-${currencies?.[1]?.symbol}` : i18n._(t`Back`)}
              </Link>
            </Button>
          </div>
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Remove Liquidity`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Receive both pool tokens directly with Standard mode, or receive total investment as any asset in Zap mode.`
            )}
          </Typography>
          {[ConstantProductPoolState.NOT_EXISTS, ConstantProductPoolState.INVALID].includes(
            classicPool.state as any
          ) && (
            <Alert
              className="px-0 bg-transparent"
              dismissable={false}
              type="error"
              showIcon
              message={i18n._(t`A Pool could not be found for provided currencies`)}
            />
          )}
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-full gap-5 lg:w-7/12">
            <>
              {liquidityMode === LiquidityMode.ZAP && (
                <>
                  <ClassicUnzapMode />
                  <RemoveTransactionReviewZapModal />
                </>
              )}
              {liquidityMode === LiquidityMode.STANDARD && (
                <>
                  <ClassicStandardMode />
                  <RemoveTransactionReviewStandardModal />
                </>
              )}
            </>

            <WithdrawalSubmittedModal />
          </div>

          <div className="flex flex-col hidden lg:block lg:w-4/12 -mt-36">
            {liquidityMode === LiquidityMode.STANDARD ? <ClassicStandardAside /> : <ClassicZapAside />}
          </div>
        </div>
      </TridentBody>
    </>
  )
}

RemoveClassic.Provider = (props) => <TridentRecoilRoot poolType={PoolType.ConstantProduct} {...props} />
RemoveClassic.Layout = (props) => (
  <TridentLayout
    {...props}
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic'], BREADCRUMBS['remove_classic']]}
  />
)

export default RemoveClassic
