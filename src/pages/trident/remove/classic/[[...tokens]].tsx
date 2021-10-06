import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import SettingsTab from '../../../../components/Settings'
import Typography from '../../../../components/Typography'
import React, { useEffect } from 'react'
import ClassicStandardMode from '../../../../features/trident/remove/classic/ClassicStandardMode'
import ModeToggle from '../../../../features/trident/ModeToggle'
import { LiquidityMode } from '../../../../features/trident/types'
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  liquidityModeAtom,
  poolAtom,
  poolBalanceAtom,
  slippageAtom,
  totalSupplyAtom,
} from '../../../../features/trident/context/atoms'
import TridentLayout from '../../../../layouts/Trident'
import ClassicUnzapMode from '../../../../features/trident/remove/classic/ClassicUnzapMode'
import { useCurrency } from '../../../../hooks/Tokens'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../../hooks'
import { useRouter } from 'next/router'
import { Percent } from '@sushiswap/core-sdk'
import { ConstantProductPoolState, useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { useUserSlippageToleranceWithDefault } from '../../../../state/user/hooks'
import WithdrawalSubmittedModal from '../../../../features/trident/WithdrawalSubmittedModal'
import RemoveTransactionReviewZapModal from '../../../../features/trident/remove/classic/RemoveTransactionReviewZapModal'
import RemoveTransactionReviewStandardModal from '../../../../features/trident/remove/classic/RemoveTransactionReviewStandardModal'
import { BREADCRUMBS } from '../../../../features/trident/Breadcrumb'
import Alert from '../../../../components/Alert'
import ClassicStandardAside from '../../../../features/trident/remove/classic/ClassicStandardAside'
import ClassicZapAside from '../../../../features/trident/remove/classic/ClassicZapAside'
import useInitClassicPoolState from '../../../../features/trident/context/hooks/useInitClassicPoolState'
import useCurrenciesFromURL from '../../../../features/trident/context/hooks/useCurrenciesFromURL'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const RemoveClassic = () => {
  useInitClassicPoolState()

  const { i18n } = useLingui()
  const { query } = useRouter()
  const { currencies } = useCurrenciesFromURL()
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [, pool] = useRecoilValue(poolAtom)

  const classicPool = useTridentClassicPool(currencies?.[0], currencies?.[1], 30, true)
  const setSlippage = useSetRecoilState(slippageAtom)
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

  useEffect(() => {
    if (!allowedSlippage) return
    setSlippage(allowedSlippage)
  })

  return (
    <>
      <div>
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="py-1 pl-2 rounded-full"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/classic/${query.tokens[0]}/${query.tokens[1]}`}>
              {pool ? `${currencies?.[0]?.symbol}-${currencies?.[1]?.symbol}` : i18n._(t`Back`)}
            </Link>
          </Button>
          <SettingsTab />
        </div>
      </div>
      <div className="flex flex-col w-full gap-10 mt-px mb-5 lg:flex-row lg:justify-around">
        <div className="flex flex-col gap-5 lg:w-7/12">
          <div className="flex flex-col">
            <Typography variant="h2" weight={700} className="text-high-emphesis">
              {i18n._(t`Remove Liquidity`)}
            </Typography>
            <Typography variant="sm">
              {i18n._(
                t`Receive both pool tokens directly with Standard mode, or receive total investment as any asset in Zap mode.`
              )}
            </Typography>

            {/*spacer*/}
            <div className="h-8" />
          </div>

          <ModeToggle />

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

        <div className="flex flex-col hidden lg:block lg:w-4/12">
          {liquidityMode === LiquidityMode.STANDARD ? <ClassicStandardAside /> : <ClassicZapAside />}
        </div>
      </div>
    </>
  )
}

RemoveClassic.Provider = RecoilRoot
RemoveClassic.Layout = (props) => (
  <TridentLayout
    {...props}
    headerBg="bg-bars-pattern"
    headerHeight="h-[194px]"
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic'], BREADCRUMBS['remove_classic']]}
  />
)

export default RemoveClassic
