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

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const RemoveClassic = () => {
  const { account } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const [[, pool], setPool] = useRecoilState(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)
  const setSlippage = useSetRecoilState(slippageAtom)

  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
  const classicPool = useTridentClassicPool(currencyA, currencyB, 50, true)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

  useEffect(() => {
    if (!classicPool[1]) return
    setPool(classicPool)
  }, [classicPool, setPool])

  useEffect(() => {
    if (!totalSupply) return
    setTotalSupply(totalSupply)
  }, [setTotalSupply, totalSupply])

  useEffect(() => {
    if (!poolBalance) return
    setPoolBalance(poolBalance)
  }, [poolBalance, setPoolBalance])

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
            className="rounded-full py-1 pl-2"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/classic/${pool?.token0.address}/${pool?.token1.address}`}>
              {pool ? `${pool?.token0.symbol}-${pool?.token1.symbol}` : i18n._(t`Back`)}
            </Link>{' '}
          </Button>
          <SettingsTab />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full mt-px mb-5 gap-10 lg:justify-around">
        <div className="lg:w-7/12 flex flex-col gap-5">
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

        <div className="hidden lg:block lg:w-4/12 flex flex-col">
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
