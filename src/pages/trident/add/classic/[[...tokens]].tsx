import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Alert from 'components/Alert'
import Button from 'components/Button'
import Typography from 'components/Typography'
import ClassicStandardAside from 'features/trident/add/classic/ClassicStandardAside'
import ClassicStandardMode from 'features/trident/add/classic/ClassicStandardMode'
import ClassicZapAside from 'features/trident/add/classic/ClassicZapAside'
import ClassicZapMode from 'features/trident/add/classic/ClassicZapMode'
import TransactionReviewStandardModal from 'features/trident/add/classic/TransactionReviewStandardModal'
import TransactionReviewZapModal from 'features/trident/add/classic/TransactionReviewZapModal'
import FixedRatioHeader from 'features/trident/add/FixedRatioHeader'
import { BREADCRUMBS } from 'features/trident/Breadcrumb'
import { liquidityModeAtom, poolAtom } from 'features/trident/context/atoms'
import useCurrenciesFromURL from 'features/trident/context/hooks/useCurrenciesFromURL'
import DepositSubmittedModal from 'features/trident/DepositSubmittedModal'
import { LiquidityMode } from 'features/trident/types'
import { ConstantProductPoolState, useTridentClassicPool } from 'hooks/useTridentClassicPools'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilValue } from 'recoil'
import TridentRecoilRoot from '../../../../features/trident/TridentRecoilRoot'
import { PoolType } from '@sushiswap/tines'

const AddClassic = () => {
  const { i18n } = useLingui()
  const { query } = useRouter()
  const { currencies, twap, fee } = useCurrenciesFromURL()
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [, pool] = useRecoilValue(poolAtom)
  const classicPool = useTridentClassicPool(currencies[0], currencies[1], fee, twap)

  return (
    <>
      <TridentHeader pattern="bg-bubble-pattern">
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
                  query.tokens[0] && query.tokens[1]
                    ? `/trident/pool/classic/${query.tokens[0]}/${query.tokens[1]}`
                    : '/trident/pools'
                }
              >
                {pool ? `${currencies?.[0]?.symbol}-${currencies?.[1]?.symbol}` : i18n._(t`Back`)}
              </Link>
            </Button>
          </div>
          <div>
            <Typography variant="h2" weight={700} className="text-high-emphesis">
              {i18n._(t`Add Liquidity`)}
            </Typography>
            <Typography variant="sm">
              {i18n._(
                t`Deposit any or all pool tokens directly with Standard mode,  or invest with any asset in Zap mode.`
              )}
            </Typography>
          </div>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-full lg:w-7/12">
            <FixedRatioHeader />
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
                  <ClassicZapMode />
                  <TransactionReviewZapModal />
                </>
              )}
              {liquidityMode === LiquidityMode.STANDARD && (
                <>
                  <ClassicStandardMode />
                  <TransactionReviewStandardModal />
                </>
              )}
              <DepositSubmittedModal />
            </>
          </div>
          <div className="flex flex-col hidden lg:block lg:w-4/12 -mt-40">
            {liquidityMode === LiquidityMode.STANDARD ? <ClassicStandardAside /> : <ClassicZapAside />}
          </div>
        </div>
      </TridentBody>
    </>
  )
}

AddClassic.Provider = (props) => <TridentRecoilRoot poolType={PoolType.ConstantProduct} {...props} />
AddClassic.Layout = (props) => (
  <TridentLayout
    {...props}
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic'], BREADCRUMBS['add_classic']]}
  />
)

export default AddClassic
