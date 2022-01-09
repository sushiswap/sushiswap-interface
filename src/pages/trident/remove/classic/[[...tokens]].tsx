import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import SettingsTab from 'app/components/Settings'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import { BREADCRUMBS } from 'app/features/trident/Breadcrumb'
import { poolAtom } from 'app/features/trident/context/atoms'
import useCurrenciesFromURL from 'app/features/trident/context/hooks/useCurrenciesFromURL'
import ClassicSingleAside from 'app/features/trident/remove/classic/ClassicSingleAside'
import ClassicSingleMode from 'app/features/trident/remove/classic/ClassicSingleMode'
import ClassicStandardAside from 'app/features/trident/remove/classic/ClassicStandardAside'
import ClassicStandardMode from 'app/features/trident/remove/classic/ClassicStandardMode'
import RemoveTransactionReviewSingleModal from 'app/features/trident/remove/classic/RemoveTransactionReviewSingleModal'
import RemoveTransactionReviewStandardModal from 'app/features/trident/remove/classic/RemoveTransactionReviewStandardModal'
import FixedRatioHeader from 'app/features/trident/remove/FixedRatioHeader'
import TridentRecoilRoot from 'app/features/trident/TridentRecoilRoot'
import NetworkGuard from 'app/guards/Network'
import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { ConstantProductPoolState } from 'app/hooks/useConstantProductPools'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React from 'react'
import { useRecoilValue } from 'recoil'

const RemoveClassic = () => {
  const { i18n } = useLingui()
  const { currencies, fee, twap } = useCurrenciesFromURL()
  const { pool } = useRecoilValue(poolAtom)
  const classicPool = useConstantProductPool(currencies[0], currencies[1], fee, twap)
  const fixedRatio = useRecoilValue(FixedRatioHeader.atom)

  return (
    <>
      <TridentHeader pattern="bg-bars-pattern" className="pb-10">
        <div className="relative flex flex-col w-full gap-5 mt-px lg:justify-between lg:w-7/12">
          <div className="flex justify-between">
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
            <SettingsTab trident />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="h2" weight={700} className="text-high-emphesis">
              {i18n._(t`Remove Liquidity`)}
            </Typography>
            <Typography variant="sm">
              {i18n._(t`Receive both pool tokens in equal amounts or receive one of the two pool tokens.`)}
            </Typography>
            {[ConstantProductPoolState.NOT_EXISTS, ConstantProductPoolState.INVALID].includes(
              classicPool.state as any
            ) && (
              <Alert
                className="px-0 pb-0 bg-transparent"
                dismissable={false}
                type="error"
                showIcon
                message={i18n._(t`A Pool could not be found for provided currencies`)}
              />
            )}
          </div>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-full gap-5 lg:w-7/12">
            <FixedRatioHeader />
            <>
              {fixedRatio ? (
                <>
                  <ClassicStandardMode />
                  <RemoveTransactionReviewStandardModal />
                </>
              ) : (
                <>
                  <ClassicSingleMode />
                  <RemoveTransactionReviewSingleModal />
                </>
              )}
            </>
          </div>

          <div className="flex flex-col hidden lg:block lg:w-4/12 -mt-36">
            {fixedRatio ? <ClassicStandardAside /> : <ClassicSingleAside />}
          </div>
        </div>
      </TridentBody>
    </>
  )
}

RemoveClassic.Guard = NetworkGuard(Feature.TRIDENT)
RemoveClassic.Provider = (props) => <TridentRecoilRoot poolType={PoolType.ConstantProduct} {...props} />
RemoveClassic.Layout = (props) => (
  <TridentLayout
    {...props}
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic'], BREADCRUMBS['remove_classic']]}
  />
)

export default RemoveClassic
