import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Alert from 'components/Alert'
import Button from 'components/Button'
import Typography from 'components/Typography'
import { BREADCRUMBS } from 'features/trident/Breadcrumb'
import { liquidityModeAtom, poolAtom } from 'features/trident/context/atoms'
import useCurrenciesFromURL from 'features/trident/context/hooks/useCurrenciesFromURL'
import ClassicStandardAside from 'features/trident/remove/classic/ClassicStandardAside'
import ClassicStandardMode from 'features/trident/remove/classic/ClassicStandardMode'
import ClassicUnzapMode from 'features/trident/remove/classic/ClassicUnzapMode'
import ClassicZapAside from 'features/trident/remove/classic/ClassicZapAside'
import RemoveTransactionReviewStandardModal from 'features/trident/remove/classic/RemoveTransactionReviewStandardModal'
import RemoveTransactionReviewZapModal from 'features/trident/remove/classic/RemoveTransactionReviewZapModal'
import { LiquidityMode } from 'features/trident/types'
import WithdrawalSubmittedModal from 'features/trident/WithdrawalSubmittedModal'
import { ConstantProductPoolState, useTridentClassicPool } from 'hooks/useTridentClassicPools'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilValue } from 'recoil'
import TridentRecoilRoot from '../../../../features/trident/TridentRecoilRoot'
import { PoolType } from '@sushiswap/tines'

const RemoveClassic = () => {
  const { i18n } = useLingui()
  const { query } = useRouter()
  const { currencies, fee, twap } = useCurrenciesFromURL()
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [, pool] = useRecoilValue(poolAtom)
  const classicPool = useTridentClassicPool(currencies[0], currencies[1], fee, twap)

  return (
    <>
      <TridentHeader pattern="bg-bars-pattern" className="pb-10">
        <div className="flex flex-col w-full mt-px gap-5 lg:justify-between relative lg:w-7/12">
          <div>
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="!pl-2 !py-1 rounded-full"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={`/trident/pool/classic/${query.tokens[0]}/${query.tokens[1]}`}>
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
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-row justify-between">
          <div className="lg:w-7/12 w-full flex flex-col gap-5">
            {[ConstantProductPoolState.NOT_EXISTS, ConstantProductPoolState.INVALID].includes(classicPool[0]) && (
              <Alert
                dismissable={false}
                type="error"
                showIcon
                message={i18n._(t`A Pool could not be found for provided currencies`)}
              />
            )}

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
